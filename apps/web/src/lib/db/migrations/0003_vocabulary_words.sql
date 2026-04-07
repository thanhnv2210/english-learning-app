CREATE TABLE "vocabulary_words" (
	"id" serial PRIMARY KEY NOT NULL,
	"word" text NOT NULL,
	"definition" text NOT NULL,
	"family_words" jsonb NOT NULL,
	"synonyms" jsonb NOT NULL,
	"collocations" jsonb NOT NULL,
	"examples" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "vocabulary_words_word_unique" UNIQUE("word")
);
--> statement-breakpoint
CREATE TABLE "vocabulary_word_domains" (
	"word_id" integer NOT NULL,
	"domain_id" integer NOT NULL,
	CONSTRAINT "vocabulary_word_domains_pkey" PRIMARY KEY("word_id","domain_id")
);
--> statement-breakpoint
ALTER TABLE "vocabulary_word_domains" ADD CONSTRAINT "vocabulary_word_domains_word_id_vocabulary_words_id_fk" FOREIGN KEY ("word_id") REFERENCES "public"."vocabulary_words"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "vocabulary_word_domains" ADD CONSTRAINT "vocabulary_word_domains_domain_id_writing_domains_id_fk" FOREIGN KEY ("domain_id") REFERENCES "public"."writing_domains"("id") ON DELETE cascade ON UPDATE no action;
