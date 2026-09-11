CREATE TRIGGER IF NOT EXISTS preserve_commentary_versions_update BEFORE UPDATE ON site_settings WHEN OLD.id LIKE 'version:%' BEGIN SELECT RAISE(ABORT, 'Published version history is immutable'); END;
--> statement-breakpoint
CREATE TRIGGER IF NOT EXISTS preserve_commentary_versions_delete BEFORE DELETE ON site_settings WHEN OLD.id LIKE 'version:%' BEGIN SELECT RAISE(ABORT, 'Published version history cannot be deleted'); END;
