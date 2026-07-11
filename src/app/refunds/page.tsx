export default function RefundsPage() {
  return (
    <div className="min-h-screen bg-white pt-[120px] pb-20 font-sans">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-[800] text-[#111111] mb-10 tracking-tight">Refund & Cancellation Policy</h1>
        
        <div className="space-y-8 text-[#6B7280] font-[500] leading-relaxed">
          <p className="text-lg text-[#111111] font-[600]">At RaasPass, we aim to provide a transparent and seamless ticketing experience.</p>
          
          <section className="space-y-4">
            <h3 className="text-xl font-[800] text-[#111111]">1. General Cancellation</h3>
            <p>All ticket sales are final. Tickets cannot be cancelled, exchanged, or refunded unless the event is cancelled or rescheduled by the organizer.</p>
          </section>
          
          <section className="space-y-4">
            <h3 className="text-xl font-[800] text-[#111111]">2. Event Cancellations</h3>
            <p>If an event is cancelled by the organizer, we will automatically issue a full refund (excluding convenience fees) to the original payment method within 5-7 business days.</p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-[800] text-[#111111]">3. Dispute Resolution</h3>
            <p>If you face any issues with your entry despite having a valid ticket, please reach out to our support team within 24 hours of the event with photographic proof, and we will escalate it to the organizer.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
