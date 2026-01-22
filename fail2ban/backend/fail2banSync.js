import { exec } from "child_process";

/**
 * Synchronise les IP bannies Fail2ban -> BDD
 */
export function syncFail2ban(pool) {
  exec(
    "docker exec fail2ban-config fail2ban fail2ban-client status sshd",
    async (err, stdout) => {
      if (err) {
        console.error("[Fail2ban] error:", err.message);
        return;
      }

      const match = stdout.match(/Banned IP list:\s*(.*)/);
      if (!match) return;

      const ips = match[1]
        .split(" ")
        .map((ip) => ip.trim())
        .filter(Boolean);

      for (const ip of ips) {
        try {
          await pool.query(
            `
          INSERT INTO bans (ip, jail)
          VALUES ($1, 'sshd')
          ON CONFLICT (ip, jail) DO NOTHING
          `,
            [ip],
          );
        } catch (e) {
          console.error("[DB] insert error:", e.message);
        }
      }

      console.log(">>> synced bans:", ips.length);
    },
  );
}
