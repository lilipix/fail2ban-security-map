import fs from "fs";

export default async function syncFromFile(pool) {
  const file = "/shared/bans.log";

  if (!fs.existsSync(file)) return;

  let content;
  try {
    content = fs.readFileSync(file, "utf-8");
  } catch (err) {
    console.error("[Fail2Ban] read error:", err.message);
    return;
  }

  const lines = content.split("\n").filter(Boolean);

  for (const line of lines) {
    const parts = line.split(" ");
    const type = parts[0];
    const ip = parts[1];
    const jail = parts[2];

    if (!ip || !jail) continue;

    if (type === "BAN") {
      await pool.query(
        `
        INSERT INTO bans (ip, jail)
        VALUES ($1, $2)
        ON CONFLICT (ip, jail) DO NOTHING
        `,
        [ip, jail],
      );
    }

    if (type === "UNBAN") {
      await pool.query(
        `
        DELETE FROM bans
        WHERE ip = $1 AND jail = $2
        `,
        [ip, jail],
      );
    }
  }

  fs.writeFileSync(file, "");
}
