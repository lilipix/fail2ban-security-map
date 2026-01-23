import fs from "fs";

export default function syncFromFile(pool) {
  const file = "/shared/bans.log";

  if (!fs.existsSync(file)) {
    return;
  }

  let content;
  try {
    content = fs.readFileSync(file, "utf-8");
  } catch (err) {
    console.error("[Fail2ban] read error:", err.message);
    return;
  }

  const lines = content.split("\n").filter(Boolean);

  for (const line of lines) {
    if (line.startsWith("UNBAN")) continue;

    const [ip, jail] = line.split(" ");

    pool.query(
      `
      INSERT INTO bans (ip, jail)
      VALUES ($1, $2)
      ON CONFLICT (ip, jail) DO NOTHING
      `,
      [ip, jail],
    );
  }
}
