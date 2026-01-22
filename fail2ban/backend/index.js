import express from "express";
import pkg from "pg";

import { initGeoIP, lookupIp } from "./geoip.js";

const { Pool } = pkg;

const app = express();
// app.set("trust proxy", true);

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin) return callback(null, true);

//       const allowedOrigins = ["https://fail2ban.localhost"];

//       if (allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: false,
//   }),
// );

app.use(express.json());

const pool = new Pool({
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
        const geo = lookupIp(ip);
        if (!geo?.location) return null;

        return {
          ip: ban.ip,
          jail: ban.jail,
          date: ban.banned_at,
          lat: geo.location.latitude,
          lon: geo.location.longitude,
        };
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
    console.log("DB OK", test.rows);

    app.listen(3000, () => {
      console.log("Backend API running on port 3000");
    });
  } catch (err) {
    console.error("Startup error:", err);
    process.exit(1);
  }
}

start();
