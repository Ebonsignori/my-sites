const opn = require("better-opn");
const args = process.argv.slice(2);

opn(`http://localhost:${args[0]}`);
