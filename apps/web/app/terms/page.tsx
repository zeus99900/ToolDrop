import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="pt-20 bg-gray-50/50 min-h-screen">
        <div className="section-padding py-16 sm:py-24">
          <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-100">
            <h1 className="text-3xl font-bold text-dark-900 mb-8">Terms of Service</h1>
            <div className="prose prose-gray max-w-none space-y-6 text-gray-600">
              <p className="text-sm text-gray-400">Last Updated: April 28, 2026</p>
              
              <section>
                <h2 className="text-xl font-bold text-dark-900 mb-3">1. Acceptance of Terms</h2>
                <p>By accessing or using the ToolDrop platform, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use the platform.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-dark-900 mb-3">2. Tool Rentals</h2>
                <p>ToolDrop provides a marketplace for tool rentals. "Official ToolDrop" rentals are provided directly by the platform. All rentals are subject to availability and the specific rental period agreed upon during checkout.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-dark-900 mb-3">3. Deposits and Payments</h2>
                <p>A refundable security deposit is required for every rental. This deposit is held by ToolDrop and released within 48 hours of the tool being returned in its original condition. Late returns may result in additional daily charges.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-dark-900 mb-3">4. Damage and Protection</h2>
                <p>Renters are responsible for the tools they rent. Optional "Damage Protection" covers accidental damage but does not cover theft, loss, or intentional misuse. Users must report any issues with tools immediately upon discovery.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-dark-900 mb-3">5. User Conduct</h2>
                <p>Users must provide accurate information, maintain the security of their accounts, and use rented tools safely and in accordance with manufacturer instructions.</p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
