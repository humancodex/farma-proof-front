import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';

// In-memory store for orders (replace with your preferred storage solution)
const orders = new Map<string, {
  id: string;
  nonceHex: string;
  medicineCodeHash: string;
  qtyRequested: number;
  state: string;
  createdAt: Date;
}>();

let orderIdCounter = 1;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { medicine_code_hash, qty_requested } = body;

    if (!medicine_code_hash || !qty_requested) {
      return NextResponse.json(
        { error: 'Missing required fields: medicine_code_hash, qty_requested' },
        { status: 400 }
      );
    }

    // Generate a random nonce for this order
    const nonceHex = '0x' + randomBytes(32).toString('hex');
    const orderId = (orderIdCounter++).toString();

    // Create the order in INIT state
    const newOrder = {
      id: orderId,
      nonceHex,
      medicineCodeHash: medicine_code_hash,
      qtyRequested: qty_requested,
      state: 'INIT',
      createdAt: new Date(),
    };

    orders.set(orderId, newOrder);

    return NextResponse.json({
      order_id: orderId,
      nonce_hex: nonceHex,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orderId = searchParams.get('id');

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const order = orders.get(orderId);

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: order.id,
      nonce_hex: order.nonceHex,
      medicine_code_hash: order.medicineCodeHash,
      qty_requested: order.qtyRequested,
      state: order.state,
      created_at: order.createdAt.toISOString(),
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}