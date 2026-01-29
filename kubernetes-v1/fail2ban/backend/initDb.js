import { pool } from "./index.js";

export default async function initDb() {
  try {
    console.log("[DB] Initialisation du schéma...");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS bans (
        id SERIAL PRIMARY KEY,
        ip INET NOT NULL,
        jail TEXT NOT NULL,
        banned_at TIMESTAMP DEFAULT NOW(),
        CONSTRAINT uniq_ip_jail UNIQUE (ip, jail)
      );
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_bans_ip ON bans(ip);
    `);

    console.log("[DB] Schéma OK");
  } catch (err) {
    console.error("[DB] Erreur d'initialisation", err);
    throw err;
  }
}
