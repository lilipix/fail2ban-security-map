CREATE TABLE bans (
  id SERIAL PRIMARY KEY,
  ip INET NOT NULL,
  jail TEXT,
  banned_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT uniq_ip_jail UNIQUE (ip, jail)
);

CREATE INDEX IF NOT EXISTS idx_bans_ip ON bans(ip);
