import { NextRequest, NextResponse } from 'next/server';
import { db, orders, attestations } from '@/src/db';
import { eq } from 'drizzle-orm';
import { hashAttestationPayload, signAttestation } from '@/src/lib/attestation';
import type { AttestationPayloadV2 } from '@/packages/types/attestation';

// Rate limiting - simple in-memory store (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // 10 requests
const RATE_WINDOW = 60000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);
  
  if (!record || record.resetTime < now) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }
  
  if (record.count >= RATE_LIMIT) {
    return false;
  }
  
  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { payload } = body as { payload: AttestationPayloadV2 };

    if (!payload) {
      return NextResponse.json(
        { error: 'Missing payload' },
        { status: 400 }
      );
    }

    // Validate payload structure
    if (
      payload.attestation_version !== "2" ||
      payload.domain !== "FARMA_PROOF/ACCEPT_PROOF" ||
      !payload.network_id ||
      !payload.order_id ||
      !payload.order_nonce ||
      !payload.medicine_code_hash ||
      !payload.qty_requested ||
      !payload.proof_statement
    ) {
      return NextResponse.json(
        { error: 'Invalid payload structure' },
        { status: 400 }
      );
    }

    // Check valid_until is not stale (must be within 30 minutes from now)
    const validUntil = new Date(payload.valid_until);
    const now = new Date();
    const maxTTL = 30 * 60 * 1000; // 30 minutes
    
    if (validUntil < now) {
      return NextResponse.json(
        { error: 'Attestation already expired' },
        { status: 400 }
      );
    }
    
    if (validUntil.getTime() - now.getTime() > maxTTL) {
      return NextResponse.json(
        { error: 'Valid until time too far in future (max 30 minutes)' },
        { status: 400 }
      );
    }

    // Validate against database
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, parseInt(payload.order_id)),
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Verify order details match
    if (
      order.nonceHex !== payload.order_nonce ||
      order.medicineCodeHash !== payload.medicine_code_hash ||
      order.qtyRequested !== payload.qty_requested
    ) {
      return NextResponse.json(
        { error: 'Order details do not match' },
        { status: 400 }
      );
    }

    // Hash the payload
    const payloadHash = hashAttestationPayload(payload);

    // Sign with Ed25519
    const privateKey = process.env.VERIFIER_ED25519_SK;
    const verifierKeyId = process.env.VERIFIER_KEY_ID;

    if (!privateKey || !verifierKeyId) {
      console.error('Verifier keys not configured');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const signature = await signAttestation(payloadHash, privateKey);

    // Store attestation metadata in database
    await db.insert(attestations).values({
      orderId: parseInt(payload.order_id),
      payloadHash: '0x' + Buffer.from(payloadHash).toString('hex'),
      verifierKeyId,
      signatureAlg: 'Ed25519',
      signatureHex: signature,
      validFrom: new Date(payload.valid_from),
      validUntil: new Date(payload.valid_until),
    });

    // Update order state to PROOF_VALID
    await db.update(orders)
      .set({ state: 'PROOF_VALID' })
      .where(eq(orders.id, parseInt(payload.order_id)));

    return NextResponse.json({
      verifier_key_id: verifierKeyId,
      signature_alg: 'Ed25519' as const,
      signature,
    });
  } catch (error) {
    console.error('Error creating attestation:', error);
    return NextResponse.json(
      { error: 'Failed to create attestation' },
      { status: 500 }
    );
  }
}