export default function RefundsPage() {
  return (
    <div className="bg-navratri-bg min-h-screen pb-32 font-sans">
      {/* Page Header */}
      <section className="pt-16 pb-24 text-center relative overflow-hidden border-b border-navratri-border bg-navratri-dark">
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-navratri-primary/20 rounded-full blur-[120px] animate-pulse-slow"></div>
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-[40px] md:text-[52px] font-display font-[800] text-white mb-4 tracking-tight">Refund & Cancellation Policy</h1>
          <p className="text-slate-400 font-[500]">Last updated: October 2026</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="bg-white rounded-card p-8 md:p-12 border border-slate-100 shadow-card hover:shadow-card-hover transition-all duration-300">
          <div className="space-y-10 text-navratri-muted font-[500] leading-relaxed text-[16px]">
            <p className="text-lg text-navratri-text font-[600] leading-relaxed">At RaasPass, we aim to provide a transparent and seamless ticketing experience.</p>
            
            <section>
              <h2 className="text-[22px] font-display font-[800] text-navratri-text mb-4">1. General Cancellation</h2>
              <p>All ticket sales are final. Tickets cannot be cancelled, exchanged, or refunded unless the event is cancelled or rescheduled by the organizer.</p>
            </section>
            
            <section>
              <h2 className="text-[22px] font-display font-[800] text-navratri-text mb-4">2. Event Cancellations</h2>
              <p>If an event is cancelled by the organizer, we will automatically issue a full refund (excluding convenience fees) to the original payment method within 5-7 business days.</p>
            </section>

            <section>
              <h2 className="text-[22px] font-display font-[800] text-navratri-text mb-4">3. Dispute Resolution</h2>
              <p>If you face any issues with your entry despite having a valid ticket, please reach out to our support team within 24 hours of the event with photographic proof, and we will escalate it to the organizer.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
