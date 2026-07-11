export default function RefundPolicyPage() {
  return (
    <div className="bg-white min-h-screen pt-[120px] pb-32 font-sans">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-[800] text-[#111111] mb-6 tracking-tight">Refund Policy</h1>
        <p className="text-[#6B7280] font-[500] mb-12">Last updated: October 2026</p>

        <div className="space-y-10 text-[#6B7280] font-[500] leading-relaxed">
          <section>
            <h2 className="text-2xl font-[800] text-[#111111] mb-4">1. General Rule</h2>
            <p>
              As a general rule, all ticket sales are final and non-refundable. Please carefully review your order before confirming your purchase. RaasPass acts as a ticketing platform for various organizers, and we must adhere to their individual policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-[800] text-[#111111] mb-4">2. Event Cancellation</h2>
            <p>
              If an event is cancelled by the organizer, you will be entitled to a full refund of the ticket price. Convenience fees and payment gateway charges may be non-refundable depending on the specific circumstances and our payment partners.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-[800] text-[#111111] mb-4">3. Postponement or Rescheduling</h2>
            <p>
              If an event is postponed or rescheduled, your ticket will usually be valid for the new date. If you are unable to attend the rescheduled date, refund eligibility will be determined by the event organizer.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-[800] text-[#111111] mb-4">4. Failed Transactions</h2>
            <p>
              If your payment was deducted but the ticket was not generated (failed transaction), the amount will be automatically refunded to your original payment method within 5-7 business days.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-[800] text-[#111111] mb-4">5. How to Request a Refund</h2>
            <p>
              For any eligible refund requests, please contact our support team at support@raaspass.com with your Booking ID and the registered email address. We will process your request in coordination with the event organizer.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
