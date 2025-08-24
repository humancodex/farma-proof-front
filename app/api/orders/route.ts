import { NextRequest, NextResponse } from 'next/server';
import { db, orders } from '@/src/db';
import { randomBytes } from 'crypto';

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

    // Create the order in INIT state
    const [newOrder] = await db.insert(orders).values({
      nonceHex,
      medicineCodeHash: medicine_code_hash,
      qtyRequested: qty_requested,
      state: 'INIT',
    }).returning();

    return NextResponse.json({
      order_id: newOrder.id.toString(),
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

    // Validate that orderId is a valid integer
    const orderIdInt = parseInt(orderId);
    if (isNaN(orderIdInt)) {
      return NextResponse.json(
        { error: 'Order ID must be a valid integer' },
        { status: 400 }
      );
    }

    const order = await db.query.orders.findFirst({
      where: (orders, { eq }) => eq(orders.id, orderIdInt),
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: order.id.toString(),
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