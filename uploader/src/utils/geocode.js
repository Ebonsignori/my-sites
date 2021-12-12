/* eslint-disable no-console */
import Geocode from "react-geocode";

Geocode.setApiKey(process.env.GOOGLE_MAPS_API_KEY);

Geocode.setLanguage("en");

Geocode.setLocationType("ROOFTOP");

const noRes = { label: "No Results", value: "No Results" };
export async function cordsToAddress(lat, long) {
  let response;
  try {
    response = await Geocode.fromLatLng(lat, long);
  } catch (err) {
    console.error(err);
    return [noRes];
  }
  if (!response?.results?.length) {
    return [noRes];
  }
  const uniqueAddresses = {};
  return response.results
    .map((address) => {
      if (!uniqueAddresses[address.formatted_address]) {
        uniqueAddresses[address.formatted_address] = true;
      } else {
        return null;
      }
      return {
        label: address.formatted_address,
        value: address.formatted_address,
        lat: address.geometry.location.lat,
        long: address.geometry.location.lng,
      };
    })
    .filter((x) => x);
}

const noAddress = { lat: "", long: "" };
export async function addressToCords(addressString) {
  let response;
  try {
    response = await Geocode.fromAddress(addressString);
  } catch (err) {
    console.error(err);
    return noAddress;
  }
  const { lat, lng: long } = response.results[0].geometry.location;
  if (!lat || !long) {
    return noAddress;
  }
  return { lat, long };
}
