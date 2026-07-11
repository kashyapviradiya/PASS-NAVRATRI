export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen pt-[120px] pb-32 font-sans">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-[800] text-[#111111] mb-6 tracking-tight">Terms & Conditions</h1>
        <p className="text-[#6B7280] font-[500] mb-12">Last updated: October 2026</p>

        <div className="space-y-10 text-[#6B7280] font-[500] leading-relaxed">
          <section>
            <h2 className="text-2xl font-[800] text-[#111111] mb-4">1. Agreement to Terms</h2>
            <p>
              By accessing our website and booking tickets through RaasPass, you agree to be bound by these Terms and Conditions and agree that you are responsible for the agreement with any applicable local laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-[800] text-[#111111] mb-4">2. Ticket Booking and Usage</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>All tickets are subject to availability and the specific event's capacity.</li>
              <li>A valid ID may be required at the venue to verify the ticket holder's identity.</li>
              <li>Tickets are generally non-transferable unless explicitly stated by the event organizer.</li>
              <li>RaasPass reserves the right to cancel any booking if fraud or illegal activity is suspected.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-[800] text-[#111111] mb-4">3. Event Cancellation and Changes</h2>
            <p>
              RaasPass acts as an intermediary platform between you and the event organizers. We are not responsible for event cancellations, postponements, or changes to the lineup. In such cases, the organizer's refund policy will apply.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-[800] text-[#111111] mb-4">4. Code of Conduct</h2>
            <p>
              You agree to adhere to the rules and regulations of the venue and the event organizer. Failure to do so may result in your immediate removal from the venue without a refund.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-[800] text-[#111111] mb-4">5. Modifications</h2>
            <p>
              RaasPass may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
