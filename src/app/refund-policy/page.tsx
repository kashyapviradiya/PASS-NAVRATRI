export default function RefundPolicyPage() {
  return (
    <div className="bg-navratri-bg min-h-screen pb-32 font-sans">
      {/* Page Header */}
      <section className="pt-24 pb-32 text-center relative overflow-hidden bg-navratri-dark">
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-navratri-primary/20 rounded-full blur-[120px] animate-pulse-slow"></div>
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-display-lg font-display text-white mb-4">Refund Policy</h1>
          <p className="text-white/60 font-medium">Last updated: October 2026</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="card-base p-8 md:p-12 border-none">
          <div className="space-y-10 text-navratri-muted font-medium leading-relaxed text-base">
            <section>
              <h2 className="text-2xl font-display font-bold text-navratri-text mb-4">1. General Rule</h2>
              <p>
                As a general rule, all ticket sales are final and non-refundable. Please carefully review your order before confirming your purchase. RaasPass acts as a ticketing platform for various organizers, and we must adhere to their individual policies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-navratri-text mb-4">2. Event Cancellation</h2>
              <p>
                If an event is cancelled by the organizer, you will be entitled to a full refund of the ticket price. Convenience fees and payment gateway charges may be non-refundable depending on the specific circumstances and our payment partners.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-navratri-text mb-4">3. Postponement or Rescheduling</h2>
              <p>
                If an event is postponed or rescheduled, your ticket will usually be valid for the new date. If you are unable to attend the rescheduled date, refund eligibility will be determined by the event organizer.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-navratri-text mb-4">4. Failed Transactions</h2>
              <p>
                If your payment was deducted but the ticket was not generated (failed transaction), the amount will be automatically refunded to your original payment method within 5-7 business days.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-navratri-text mb-4">5. How to Request a Refund</h2>
              <p>
                For any eligible refund requests, please contact our support team at support@raaspass.com with your Booking ID and the registered email address. We will process your request in coordination with the event organizer.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
