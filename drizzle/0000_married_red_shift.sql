CREATE TABLE IF NOT EXISTS "books" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"author" varchar(256) NOT NULL,
	"total_pages" integer NOT NULL,
	"current_page" integer DEFAULT 0,
	"start_date" timestamp DEFAULT CURRENT_TIMESTAMP,
	"last_updated" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reading_updates" (
	"id" serial PRIMARY KEY NOT NULL,
	"book_id" integer,
	"timestamp" timestamp DEFAULT CURRENT_TIMESTAMP,
	"previous_page" integer NOT NULL,
	"current_page" integer NOT NULL,
	"summary" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reading_updates" ADD CONSTRAINT "reading_updates_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
