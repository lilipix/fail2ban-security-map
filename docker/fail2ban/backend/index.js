import express from "express";
import pkg from "pg";
import syncFromFile from "./fail2banSync.js";

import { initGeoIP, lookupIp } from "./geoip.js";
import initDb from "./initDb.js";

const { Pool } = pkg;

const app = express();

app.use(express.json());

export const pool = new Pool({
  host: "postgres",
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  port: 5432,
});

app.get("/bans", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT ip, jail, banned_at
      FROM bans
      ORDER BY banned_at DESC
      LIMIT 500
    `);

    console.log(">>> bans rows:", rows.length);

    const result = rows
      .map((ban) => {
        const ip = String(ban.ip);

        try {
          const geo = lookupIp(ip);
          if (!geo || !geo.location) return null;

          return {
            ip: ban.ip,
            jail: ban.jail,
            date: ban.banned_at,
            lat: geo.location.latitude,
            lon: geo.location.longitude,
          };
        } catch (err) {
          return null;
        }
      })
      .filter(Boolean);

    res.json(result);
  } catch (err) {
    console.error("Error fetching bans:", err);
    res.status(500).json({ error: "Database error" });
  }
});

async function start() {
  try {
    await initGeoIP();
    console.log("[GeoIP] Base chargée");

    const test = await pool.query("SELECT 1");

    await initDb();
    console.log("DB OK", test.rows);

    setInterval(() => syncFromFile(pool), 20_000);

    setInterval(async () => {
      await pool.query(`
    DELETE FROM bans
    WHERE banned_at < NOW() - INTERVAL '2 minutes'
  `);
    }, 60_000);

    app.listen(3000, () => {
      console.log("Backend API running on port 3000");
    });
  } catch (err) {
    console.error("Startup error:", err);
    process.exit(1);
  }
}

start();
