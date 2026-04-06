CREATE TABLE "writing_domains" (
	"id" serial PRIMARY KEY NOT NULL,
	"rank" integer NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	CONSTRAINT "writing_domains_rank_unique" UNIQUE("rank"),
	CONSTRAINT "writing_domains_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "user_domain_preferences" (
	"user_id" integer NOT NULL,
	"domain_id" integer NOT NULL,
	CONSTRAINT "user_domain_preferences_pkey" PRIMARY KEY("user_id","domain_id")
);
--> statement-breakpoint
ALTER TABLE "user_domain_preferences" ADD CONSTRAINT "user_domain_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "user_domain_preferences" ADD CONSTRAINT "user_domain_preferences_domain_id_writing_domains_id_fk" FOREIGN KEY ("domain_id") REFERENCES "public"."writing_domains"("id") ON DELETE cascade ON UPDATE no action;
