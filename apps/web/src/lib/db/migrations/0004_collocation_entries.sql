CREATE TABLE "collocation_entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"phrase" text NOT NULL,
	"type" text NOT NULL,
	"skills" jsonb NOT NULL,
	"examples" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "collocation_entries_phrase_unique" UNIQUE("phrase")
);
