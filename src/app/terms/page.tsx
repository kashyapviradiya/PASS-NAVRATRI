export default function TermsPage() {
  return (
    <div className="bg-navratri-bg min-h-screen pb-32 font-sans">
      {/* Page Header */}
      <section className="pt-24 pb-32 text-center relative overflow-hidden bg-navratri-dark">
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-navratri-primary/20 rounded-full blur-[120px] animate-pulse-slow"></div>
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-display-lg font-display text-white mb-4">Terms & Conditions</h1>
          <p className="text-white/60 font-medium">Last updated: October 2026</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="card-base p-8 md:p-12 border-none">
          <div className="space-y-10 text-navratri-muted font-medium leading-relaxed text-base">
            <section>
              <h2 className="text-2xl font-display font-bold text-navratri-text mb-4">1. Agreement to Terms</h2>
              <p>
                By accessing our website and booking tickets through RaasPass, you agree to be bound by these Terms and Conditions and agree that you are responsible for the agreement with any applicable local laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-navratri-text mb-4">2. Ticket Booking and Usage</h2>
              <ul className="list-disc pl-5 space-y-3">
                <li>All tickets are subject to availability and the specific event's capacity.</li>
                <li>A valid ID may be required at the venue to verify the ticket holder's identity.</li>
                <li>Tickets are generally non-transferable unless explicitly stated by the event organizer.</li>
                <li>RaasPass reserves the right to cancel any booking if fraud or illegal activity is suspected.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-navratri-text mb-4">3. Event Cancellation and Changes</h2>
              <p>
                RaasPass acts as an intermediary platform between you and the event organizers. We are not responsible for event cancellations, postponements, or changes to the lineup. In such cases, the organizer's refund policy will apply.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-navratri-text mb-4">4. Code of Conduct</h2>
              <p>
                You agree to adhere to the rules and regulations of the venue and the event organizer. Failure to do so may result in your immediate removal from the venue without a refund.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-navratri-text mb-4">5. Modifications</h2>
              <p>
                RaasPass may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
