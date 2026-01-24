import express from "express";
import pkg from "pg";

import { initGeoIP, lookupIp } from "./geoip.js";

const { Pool } = pkg;

const app = express();

app.use(express.json());

// lowered threshold for project
const BAN_THRESHOLD = 1;

const attempts = {};

const pool = new Pool({
  host: "postgres",
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  port: 5432,
});

app.post("/events", async (req, res) => {
  const { ip, jail = "geo-simulator" } = req.body;
  if (!ip) return res.status(400).json({ error: "ip required" });

  attempts[ip] = (attempts[ip] || 0) + 1;

  if (attempts[ip] < BAN_THRESHOLD) {
    return res.json({ banned: false, attempts: attempts[ip] });
  }

  try {
    await pool.query(
      `
        INSERT INTO bans (ip, jail)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
        `,
      [ip, jail],
    );

    return res.json({ banned: true });
  } catch (error) {
    console.error("Insert ban error", err);
    res.status(500).json({ error: "DB error" });
  }
});

app.get("/bans", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT ip, jail, banned_at
      FROM bans
      ORDER BY banned_at DESC
      LIMIT 500
    `);

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
    await pool.query("SELECT 1");

    app.listen(3000, () => {
      console.log("Backend API running on port 3000");
    });
  } catch (err) {
    console.error("Startup error:", err);
    process.exit(1);
  }
}

start();
