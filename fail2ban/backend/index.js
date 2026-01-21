import express from "express";
import pkg from "pg";
import cors from "cors";
import { initGeoIP, lookupIp } from "./geoip.js";

const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: "postgres",
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  port: 5432,
});

// app.get("/bans", async (req, res) => {
//   try {
//     const result = await pool.query(
//       "SELECT * FROM bans ORDER BY banned_at DESC",
//     );
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Database error" });
//   }
// });

async function start() {
  try {
    await initGeoIP();
    console.log("[GeoIP] Ready");

    app.listen(3000, () => {
      console.log("Backend API running on port 3000");
    });
  } catch (err) {
    console.error("Startup error:", err);
    process.exit(1);
  }
}

start();
