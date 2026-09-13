CREATE TABLE IF NOT EXISTS subscriber_events (id TEXT PRIMARY KEY,subscriber_id TEXT NOT NULL REFERENCES subscribers(id),kind TEXT NOT NULL,detail TEXT NOT NULL,created_at TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS subscriber_events_lookup ON subscriber_events(subscriber_id,created_at);
CREATE TABLE IF NOT EXISTS subscriber_tags (id TEXT PRIMARY KEY,name TEXT NOT NULL UNIQUE,provider_group TEXT);
CREATE TABLE IF NOT EXISTS subscriber_tag_links (subscriber_id TEXT NOT NULL REFERENCES subscribers(id),tag_id TEXT NOT NULL REFERENCES subscriber_tags(id),PRIMARY KEY(subscriber_id,tag_id));
CREATE TABLE IF NOT EXISTS subscriber_providers (subscriber_id TEXT NOT NULL REFERENCES subscribers(id),provider TEXT NOT NULL,external_id TEXT,last_synced_at TEXT,status TEXT NOT NULL DEFAULT 'not_synced',PRIMARY KEY(subscriber_id,provider));
CREATE TABLE IF NOT EXISTS signup_limits (key TEXT PRIMARY KEY,attempts INTEGER NOT NULL,expires_at TEXT NOT NULL);
