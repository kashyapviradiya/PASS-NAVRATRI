import { NextRequest, NextResponse } from 'next/server';
import { razorpay } from '@/lib/razorpay';
import { generateBookingId } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, eventId, customerEmail, customerPhone } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ success: false, message: 'Invalid amount' }, { status: 400 });
    }

    const receiptId = generateBookingId(); // e.g. RP-2026-000001

    if (process.env.DEMO_MODE === 'true' && (!process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET === 'mock_secret')) {
      // Return a mock order if no keys are provided and we're in DEMO_MODE
      return NextResponse.json({
        success: true,
        order: {
          id: `order_mock_${Date.now()}`,
          amount: amount * 100,
          currency: 'INR',
          receipt: receiptId,
          status: 'created',
        }
      });
    }

    const orderOptions = {
      amount: Math.round(amount * 100), // amount in paise
      currency: 'INR',
      receipt: receiptId,
      notes: {
        eventId,
        customerEmail: customerEmail || '',
        customerPhone: customerPhone || ''
      }
    };

    const order = await razorpay.orders.create(orderOptions);

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error('Create order error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal server error' }, { status: 500 });
  }
}
