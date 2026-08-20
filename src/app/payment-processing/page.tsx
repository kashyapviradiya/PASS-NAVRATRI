'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Loader2, Lock } from 'lucide-react';

export default function PaymentProcessing() {
  const router = useRouter();

  useEffect(() => {
    const orderDataStr = localStorage.getItem('recent_order');
    if (!orderDataStr) {
      router.push('/');
      return;
    }

    const orderData = JSON.parse(orderDataStr);

    const processPayment = async () => {
      try {
        // 1. Create Order
        const createRes = await fetch('/api/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: orderData.amount,
            eventId: orderData.event.id,
            customerEmail: orderData.customer.email,
            customerPhone: orderData.customer.phone
          })
        });
        const createData = await createRes.json();
        
        if (!createData.success) {
          throw new Error(createData.message || 'Failed to create order');
        }

        // Convert passes format for verify-payment API
        const passTypes = orderData.event.ticketTypes || orderData.event.passes || [];
        const selectedPasses = orderData.ticketTypes || orderData.passes || {};
        const formattedPasses = Object.entries(selectedPasses).map(([passId, qty]) => {
          const passInfo = passTypes.find((p: any) => p.id === passId);
          return {
            passTypeId: passId,
            passName: passInfo?.name || 'Ticket',
            quantity: qty as number,
            unitPrice: passInfo?.price || 0,
            subtotal: (passInfo?.price || 0) * (qty as number)
          };
        });

        // 2. Verify Payment & Generate Tickets
        const verifyRes = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: createData.order.id,
            razorpay_payment_id: `pay_mock_${Date.now()}`,
            razorpay_signature: '',
            bookingId: createData.order.receipt, // use the receipt ID as booking ID
            eventId: orderData.event.id,
            customerName: orderData.customer.name,
            customerPhone: orderData.customer.phone,
            customerEmail: orderData.customer.email,
            customerCity: orderData.customer.city,
            customerUid: orderData.customerUid || null,
            passes: formattedPasses,
            totalAmount: orderData.amount
          })
        });

        const verifyData = await verifyRes.json();
        
        if (!verifyData.success) {
          throw new Error(verifyData.message || 'Failed to verify payment');
        }

        // 3. Success -> Redirect
        localStorage.removeItem('checkout_event');
        localStorage.removeItem('checkout_passes');
        
        // Store success details so booking-success page can show them
        localStorage.setItem('success_booking', JSON.stringify({
          bookingId: verifyData.order.id,
          tickets: verifyData.tickets,
          event: orderData.event,
          customer: orderData.customer,
          amount: orderData.amount
        }));

        router.push(`/booking-success/${verifyData.order.id}`);

      } catch (error: any) {
        console.error('Payment processing failed:', error);
        alert(`Payment Failed: ${error.message}`);
        router.push('/checkout');
      }
    };

    processPayment();
  }, [router]);

  return (
    <div className="bg-navratri-bg min-h-screen flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full text-center">
        
        <div className="mb-8 relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 bg-navratri-primary/10 rounded-full animate-ping"></div>
          <div className="absolute inset-0 bg-white rounded-full flex items-center justify-center shadow-sm">
            <Loader2 className="w-10 h-10 text-navratri-primary animate-spin" />
          </div>
        </div>

        <h2 className="text-3xl font-display font-bold text-navratri-text mb-4 tracking-tight">Processing your payment...</h2>
        <p className="text-lg text-navratri-muted mb-8">
          Please do not close this page or press back.
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-navratri-border shadow-sm mb-12">
          <Lock className="w-4 h-4 text-navratri-gold" />
          <span className="text-sm font-medium text-navratri-text">Secure 256-bit Encryption</span>
        </div>
      </div>
    </div>
  );
}
