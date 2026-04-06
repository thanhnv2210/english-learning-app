CREATE TABLE "cue_cards" (
	"id" serial PRIMARY KEY NOT NULL,
	"prompt" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "mock_exams" ADD COLUMN "feedback" jsonb;--> statement-breakpoint
ALTER TABLE "mock_exams" ADD COLUMN "cue_card_id" integer;--> statement-breakpoint
ALTER TABLE "mock_exams" ADD CONSTRAINT "mock_exams_cue_card_id_cue_cards_id_fk" FOREIGN KEY ("cue_card_id") REFERENCES "public"."cue_cards"("id") ON DELETE no action ON UPDATE no action;