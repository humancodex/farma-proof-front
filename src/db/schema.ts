import { pgTable, serial, text, integer, timestamp, bigint } from 'drizzle-orm/pg-core';

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  nonceHex: text('nonce_hex').notNull(),
  medicineCodeHash: text('medicine_code_hash').notNull(), // Store as hex string
  qtyRequested: integer('qty_requested').notNull(),
  state: text('state').notNull().$type<'INIT' | 'PROOF_VALID' | 'PAID' | 'FULFILLED' | 'CANCELLED' | 'EXPIRED'>(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const attestations = pgTable('attestations', {
  id: serial('id').primaryKey(),
  orderId: bigint('order_id', { mode: 'number' }).notNull().references(() => orders.id, { onDelete: 'cascade' }),
  payloadHash: text('payload_hash').notNull(), // Store as hex string
  verifierKeyId: text('verifier_key_id').notNull(),
  signatureAlg: text('signature_alg').notNull().default('Ed25519'),
  signatureHex: text('signature_hex').notNull(),
  validFrom: timestamp('valid_from').notNull(),
  validUntil: timestamp('valid_until').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type Attestation = typeof attestations.$inferSelect;
export type NewAttestation = typeof attestations.$inferInsert;