export default function PrivacyPolicyPage() {
  return (
    <div className="bg-navratri-bg min-h-screen pb-32 font-sans">
      {/* Page Header */}
      <section className="pt-16 pb-24 text-center relative overflow-hidden border-b border-navratri-border bg-[#5A2132]">
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-navratri-primary/20 rounded-full blur-[120px] animate-pulse-slow"></div>
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-[40px] md:text-[52px] font-display font-[800] text-white mb-4 tracking-tight">Privacy Policy</h1>
          <p className="text-slate-400 font-[500]">Last updated: October 2026</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="bg-white rounded-card p-8 md:p-12 border border-slate-100 shadow-card hover:shadow-card-hover transition-all duration-300">
          <div className="space-y-10 text-navratri-muted font-[500] leading-relaxed text-[16px]">
            <section>
              <h2 className="text-[22px] font-display font-[800] text-navratri-text mb-4">1. Introduction</h2>
              <p>
                Welcome to RaasPass. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights.
              </p>
            </section>

            <section>
              <h2 className="text-[22px] font-display font-[800] text-navratri-text mb-4">2. The Data We Collect</h2>
              <p className="mb-4">We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
              <ul className="list-disc pl-5 space-y-3">
                <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
                <li><strong>Contact Data</strong> includes billing address, delivery address, email address and telephone numbers.</li>
                <li><strong>Financial Data</strong> includes payment card details (securely handled by our payment partners).</li>
                <li><strong>Transaction Data</strong> includes details about payments to and from you and other details of products and services you have purchased from us.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-[22px] font-display font-[800] text-navratri-text mb-4">3. How We Use Your Data</h2>
              <p className="mb-4">We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
              <ul className="list-disc pl-5 space-y-3">
                <li>Where we need to perform the contract we are about to enter into or have entered into with you (e.g., booking a ticket).</li>
                <li>Where it is necessary for our legitimate interests and your interests and fundamental rights do not override those interests.</li>
                <li>Where we need to comply with a legal or regulatory obligation.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-[22px] font-display font-[800] text-navratri-text mb-4">4. Data Security</h2>
              <p>
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
              </p>
            </section>

            <section>
              <h2 className="text-[22px] font-display font-[800] text-navratri-text mb-4">5. Contact Us</h2>
              <p>
                If you have any questions about this privacy policy or our privacy practices, please contact us at privacy@raaspass.com.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
