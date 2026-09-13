CREATE TABLE IF NOT EXISTS subscribers (id TEXT PRIMARY KEY,email TEXT NOT NULL UNIQUE,first_name TEXT NOT NULL DEFAULT '',status TEXT NOT NULL DEFAULT 'active',source_type TEXT NOT NULL DEFAULT 'footer',source_url TEXT NOT NULL DEFAULT '',tags TEXT NOT NULL DEFAULT '[]',consent_at TEXT NOT NULL,unsubscribe_token TEXT NOT NULL UNIQUE,created_at TEXT NOT NULL,updated_at TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS subscriber_status ON subscribers(status);
CREATE INDEX IF NOT EXISTS subscriber_source ON subscribers(source_type);
