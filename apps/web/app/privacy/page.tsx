import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="pt-20 bg-gray-50/50 min-h-screen">
        <div className="section-padding py-16 sm:py-24">
          <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-100">
            <h1 className="text-3xl font-bold text-dark-900 mb-8">Privacy Policy</h1>
            <div className="prose prose-gray max-w-none space-y-6 text-gray-600">
              <p className="text-sm text-gray-400">Last Updated: April 28, 2026</p>
              
              <section>
                <h2 className="text-xl font-bold text-dark-900 mb-3">1. Information We Collect</h2>
                <p>We collect information you provide directly to us, such as when you create an account, make a booking, or contact us for support. This includes your name, email address, phone number, and payment information (processed securely via Stripe).</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-dark-900 mb-3">2. How We Use Information</h2>
                <p>We use your information to facilitate rentals, process payments, provide customer support, and improve the ToolDrop platform. We may also use your location to show relevant tools and calculate delivery fees.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-dark-900 mb-3">3. Sharing of Information</h2>
                <p>We do not sell your personal data. We share information with third-party service providers (like Stripe for payments and Google Maps for location) only as necessary to provide our services.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-dark-900 mb-3">4. Your Data Rights</h2>
                <p>You have the right to access, update, or delete your personal information at any time via your user dashboard. For permanent account deletion, please contact hello@tooldrop.ca.</p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
