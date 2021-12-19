/*
 * Script intended to be run as a cron towards the end of the day (EST)
 * that updates stats.json with article page views (> 10 seconds)
 * These page views are ingested by app at build time to enable sort by popularity
 *
 */
/* eslint-disable camelcase */
const { BetaAnalyticsDataClient } = require("@google-analytics/data");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
const { DateTime } = require("luxon");

const todayEST = DateTime.now()
  .setZone("America/New_York")
  .toFormat("yyyy-MM-dd");

const statsJsonPath = path.join(__dirname, "..", "stats.json");
function writeStatsJson(contents) {
  fs.writeFileSync(statsJsonPath, JSON.stringify(contents, null, 2));
}
let statsJson = {
  // Initial start date, should never revert to this after this script it run once
  lastUpdated: "2021-12-12",
  stats: {},
};
// Create stats.json if DNE
if (!fs.existsSync(statsJsonPath)) {
  writeStatsJson(statsJson);
} else {
  statsJson = JSON.parse(fs.readFileSync(statsJsonPath, "utf8"));
}

// Get env from shell env (GitHub Action) or from local (uncommitted) file
const secretEnvFile = path.join(__dirname, "..", "..", ".env.secrets");
let propertyId = process.env.GA_WRITING_ID;
let clientEmail = process.env.GA_CLIENT_EMAIL;
let clientId = process.env.GA_CLIENT_ID;
let privateKey = process.env.GA_PRIVATE_KEY;
if (fs.existsSync(secretEnvFile)) {
  const localEnv = dotenv.parse(fs.readFileSync(secretEnvFile));
  propertyId = localEnv.GA_WRITING_ID;
  clientEmail = localEnv.GA_CLIENT_EMAIL;
  clientId = localEnv.GA_CLIENT_ID;
  privateKey = localEnv.GA_PRIVATE_KEY.replaceAll("\\n", "\n");
} else {
  // eslint-disable-next-line no-console
  console.log("Secrets file doesn't exist. Using shell ENV");
}

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: clientEmail,
    client_id: clientId,
    private_key: privateKey,
  },
});
const analyticsDataClient = new BetaAnalyticsDataClient({
  auth,
});

async function main() {
  const [response] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [
      {
        startDate: statsJson.lastUpdated,
        endDate: todayEST,
      },
    ],
    dimensions: [
      {
        name: "pagePath",
      },
    ],
    metrics: [
      {
        name: "engagedSessions",
      },
      {
        name: "engagementRate",
      },
    ],
  });

  if (response && response.rows.length) {
    // Update stats-json
    statsJson.lastUpdated = todayEST;
    for (const row of response.rows) {
      let slug = row.dimensionValues[0].value;
      if (slug !== "/") {
        slug = slug.replace("/", "");
      }
      const metrics = {
        engagedSessions: row.metricValues[0].value,
        lastEngagementRate: row.metricValues[1].value,
        popularity: row.metricValues[0].value * row.metricValues[1].value,
      };
      if (statsJson.stats[slug]) {
        // Update engagementRate and add sessions to previous stats
        statsJson.stats[slug].engagedSessions += metrics.engagedSessions;
        statsJson.stats[slug].lastEngagementRate = metrics.lastEngagementRate;
        statsJson.stats[slug].popularity +=
          metrics.engagedSessions * metrics.lastEngagementRate;
      } else {
        // New stats for an article
        statsJson.stats[slug] = metrics;
      }
    }
    writeStatsJson(statsJson);
    // eslint-disable-next-line no-console
    console.log("Stats.json updated");
  } else {
    if (response.rowCount === 0) {
      // eslint-disable-next-line no-console
      console.log("No new metrics since last update");
      process.exit(0);
    } else {
      throw Error("Missing rows in GA response.");
    }
  }
}

main();
