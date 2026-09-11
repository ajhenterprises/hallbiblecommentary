-- Run once in Supabase SQL Editor. Safe to run repeatedly.
CREATE OR REPLACE FUNCTION public.protect_hall_versions() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.id LIKE 'version:%' THEN
    RAISE EXCEPTION 'Published version history is immutable';
  END IF;
  IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS protect_hall_versions ON public.site_settings;
CREATE TRIGGER protect_hall_versions BEFORE UPDATE OR DELETE ON public.site_settings
FOR EACH ROW EXECUTE FUNCTION public.protect_hall_versions();
