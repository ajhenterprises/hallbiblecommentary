-- Run once in a new Supabase project. Do not apply over an existing installation.
CREATE TABLE "audit" (
	"id" text PRIMARY KEY NOT NULL,
	"actor" text NOT NULL,
	"action" text NOT NULL,
	"record_id" text NOT NULL,
	"created_at" text NOT NULL
);

CREATE TABLE "content" (
	"id" text PRIMARY KEY NOT NULL,
	"kind" text NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"body" text NOT NULL,
	"excerpt" text DEFAULT '' NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"entry_type" text DEFAULT 'range' NOT NULL,
	"book" text,
	"chapter" integer,
	"verse_start" integer,
	"verse_end" integer,
	"topics" text DEFAULT '[]' NOT NULL,
	"people" text DEFAULT '[]' NOT NULL,
	"series" text DEFAULT '' NOT NULL,
	"categories" text DEFAULT '[]' NOT NULL,
	"related" text DEFAULT '[]' NOT NULL,
	"sermon_id" text,
	"provenance" text DEFAULT '[]' NOT NULL,
	"generated_body" text,
	"publish_date" text,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL,
	"revision" integer DEFAULT 1 NOT NULL
);

CREATE UNIQUE INDEX "content_slug_unique" ON "content" ("slug");
CREATE INDEX "content_public" ON "content" ("status","kind","publish_date");
CREATE INDEX "content_location" ON "content" ("book","chapter");
CREATE TABLE "sermons" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"passage" text NOT NULL,
	"series" text DEFAULT '' NOT NULL,
	"preached_at" text,
	"tags" text DEFAULT '[]' NOT NULL,
	"text" text NOT NULL,
	"upload_key" text,
	"filename" text,
	"status" text DEFAULT 'private' NOT NULL,
	"created_at" text NOT NULL
);

CREATE TABLE "taxonomy" (
	"id" text PRIMARY KEY NOT NULL,
	"kind" text NOT NULL,
	"name" text NOT NULL
);

CREATE INDEX "taxonomy_kind" ON "taxonomy" ("kind");
CREATE TABLE "verse_mappings" (
	"content_id" text NOT NULL,
	"book" text NOT NULL,
	"chapter" integer NOT NULL,
	"start" integer NOT NULL,
	"end" integer NOT NULL,
	FOREIGN KEY ("content_id") REFERENCES "content"("id") ON UPDATE no action ON DELETE cascade
);

CREATE INDEX "verse_lookup" ON "verse_mappings" ("book","chapter","start","end");
ALTER TABLE "content" ADD "attribution" text DEFAULT '{"origin":"aaron","author":"","title":"","url":"","note":""}' NOT NULL;
CREATE TABLE "inquiries" (
	"id" text PRIMARY KEY NOT NULL,
	"kind" text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"organization" text DEFAULT '' NOT NULL,
	"event_date" text,
	"location" text DEFAULT '' NOT NULL,
	"message" text NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"rate_key" text NOT NULL,
	"created_at" text NOT NULL
);

CREATE INDEX "inquiry_rate" ON "inquiries" ("rate_key","created_at");
ALTER TABLE "sermons" ADD "description" text DEFAULT '' NOT NULL;
ALTER TABLE "sermons" ADD "related" text DEFAULT '[]' NOT NULL;
ALTER TABLE "sermons" ADD "video_url" text DEFAULT '' NOT NULL;
ALTER TABLE "sermons" ADD "audio_url" text DEFAULT '' NOT NULL;
CREATE TABLE "site_settings" (
	"id" text PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"updated_at" text NOT NULL
);

ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.content FROM anon, authenticated;

ALTER TABLE public.sermons ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.sermons FROM anon, authenticated;

ALTER TABLE public.verse_mappings ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.verse_mappings FROM anon, authenticated;

ALTER TABLE public.taxonomy ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.taxonomy FROM anon, authenticated;

ALTER TABLE public.audit ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.audit FROM anon, authenticated;

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.inquiries FROM anon, authenticated;

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.site_settings FROM anon, authenticated;

INSERT INTO storage.buckets (id,name,public,file_size_limit) VALUES ('sermon-uploads','sermon-uploads',false,10485760) ON CONFLICT (id) DO NOTHING;
