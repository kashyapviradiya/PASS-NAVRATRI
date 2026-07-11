import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.warn('Webhook secret not configured, skipping verification for development.');
    } else if (signature) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(body)
        .digest('hex');

      if (expectedSignature !== signature) {
        return NextResponse.json({ success: false, message: 'Invalid webhook signature' }, { status: 400 });
      }
    }

    const payload = JSON.parse(body);

    if (payload.event === 'payment.captured' || payload.event === 'order.paid') {
      const paymentEntity = payload.payload.payment.entity;
      const orderId = paymentEntity.order_id;
      
      // Update booking status if needed. 
      // Most logic should have already happened in verify-payment, but this acts as a fallback for drops.
      const bookingsSnapshot = await adminDb.collection('bookings').where('orderId', '==', orderId).get();
      
      if (!bookingsSnapshot.empty) {
        const bookingDoc = bookingsSnapshot.docs[0];
        if (bookingDoc.data().paymentStatus !== 'success') {
          // If frontend crashed before verify-payment but payment was successful, we should trigger fulfillment here.
          // For simplicity in MVP, we just update the payment status log. Full idempotent fulfillment should be abstracted to a service.
          await bookingDoc.ref.update({
            paymentStatus: 'success',
            webhookReceivedAt: new Date().toISOString()
          });
          console.log(`Webhook fallback: Marked order ${orderId} as paid.`);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ success: false, message: 'Webhook processing failed' }, { status: 500 });
  }
}
