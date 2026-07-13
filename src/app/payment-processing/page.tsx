'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Loader2, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

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
        const passTypes = orderData.event.ticketTypes || [];
        const formattedPasses = Object.entries(orderData.passes).map(([passId, qty]) => {
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

        router.push('/booking-success');

      } catch (error: any) {
        console.error('Payment processing failed:', error);
        alert(`Payment Failed: ${error.message}`);
        router.push('/checkout');
      }
    };

    processPayment();
  }, [router]);

  return (
    <div className="bg-[#F7F7F8] min-h-screen flex items-center justify-center p-4 font-sans selection:bg-[#9333EA] selection:text-white">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[2rem] p-10 md:p-16 max-w-md w-full text-center shadow-xl border border-gray-100"
      >
        
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 bg-[#9333EA]/10 rounded-full animate-ping"></div>
          <div className="relative bg-white rounded-full w-full h-full flex items-center justify-center border-4 border-[#F7F7F8] shadow-sm z-10">
            <Loader2 className="w-10 h-10 text-[#9333EA] animate-spin" />
          </div>
        </div>

        <h2 className="text-2xl font-[800] text-[#111111] mb-3 tracking-tight">Processing Payment</h2>
        <p className="text-[#6B7280] font-[500] mb-8 leading-relaxed">
          Please wait while we secure your transaction. Do not refresh or close this page.
        </p>

        <div className="flex flex-col items-center gap-3 p-4 bg-green-50/50 rounded-2xl border border-green-100">
          <div className="flex items-center gap-2 text-green-600 font-[800] text-sm tracking-wide">
            <Lock className="w-4 h-4" /> SECURE 256-BIT ENCRYPTION
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-100">
          <p className="text-[10px] font-[800] text-gray-400 uppercase tracking-widest mb-4">Supported Partners</p>
          <div className="flex justify-center items-center gap-4 opacity-50 grayscale">
            <div className="font-[800] text-sm">UPI</div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="font-[800] text-sm">VISA</div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="font-[800] text-sm">Mastercard</div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="font-[800] text-sm">RuPay</div>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
