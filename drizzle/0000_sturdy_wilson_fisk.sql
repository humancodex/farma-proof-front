CREATE TABLE "attestations" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" bigint NOT NULL,
	"payload_hash" text NOT NULL,
	"verifier_key_id" text NOT NULL,
	"signature_alg" text DEFAULT 'Ed25519' NOT NULL,
	"signature_hex" text NOT NULL,
	"valid_from" timestamp NOT NULL,
	"valid_until" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"nonce_hex" text NOT NULL,
	"medicine_code_hash" text NOT NULL,
	"qty_requested" integer NOT NULL,
	"state" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "attestations" ADD CONSTRAINT "attestations_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;