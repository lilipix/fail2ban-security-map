import { Reader } from "@maxmind/geoip2-node";

let reader;

export async function initGeoIP() {
  reader = await Reader.open("/usr/share/GeoIP/GeoLite2-City.mmdb");
  console.log("[GeoIP] Base chargée");
}

export function lookupIp(ip) {
  if (!reader) return null;
  return reader.city(ip);
}
