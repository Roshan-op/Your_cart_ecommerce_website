import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from '../components';
import Footer from '../components/Footer';
import { RotateCcw, Calendar, CheckCircle } from 'lucide-react';

const steps = [
  { step: '01', title: 'Request a Return', desc: 'Log in to your account, go to My Orders, and click "Request Return" on the item.' },
  { step: '02', title: 'Free Pickup Arranged', desc: 'We schedule a free pickup from your address within 48 hours — no courier trips needed.' },
  { step: '03', title: 'Item Inspected', desc: 'Our team inspects the returned item to confirm it meets our return criteria.' },
  { step: '04', title: 'Refund Processed', desc: 'Your refund is issued within 3–5 business days to your original payment method.' },
];

const ReturnsPage = () => {
  const location = useLocation();

  // Scroll to the hash anchor after ScrollToTop has already fired
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen bg-light flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero */}
        <section className="bg-gradient-to-r from-beige to-mint py-20">
          <div className="container-custom text-center">
            <h1 className="font-serif text-5xl font-bold text-primary mb-4">Returns & Refunds</h1>
            <p className="text-xl text-gray-600">Shop with confidence — we stand behind every product</p>
          </div>
        </section>

        {/* Free Returns */}
        <section id="free-returns" className="py-10 scroll-mt-20">
          <div className="container-custom max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-full bg-beige flex items-center justify-center flex-shrink-0">
                <RotateCcw size={28} className="text-accent" />
              </div>
              <div>
                <h2 className="font-serif text-3xl font-bold text-primary">Free Returns</h2>
                <p className="text-gray-500 text-sm mt-1">No fees, no hassle — ever</p>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed mb-5">
              Changed your mind? No problem. All returns at Your-cart are completely free of charge. We arrange a courier
              pickup directly from your door — anywhere in Nepal — so you never have to deal with a post office queue.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
              {[
                { title: 'No Shipping Fees', desc: 'We cover 100% of the return courier cost on every eligible item.' },
                { title: 'Doorstep Pickup', desc: 'We schedule a pickup from your address within 48 hours of your request.' },
                { title: 'No Questions Asked', desc: 'Eligible items are accepted back without interrogation — just initiate the return.' },
              ].map(({ title, desc }) => (
                <div key={title} className="card-base p-4 text-center">
                  <h3 className="font-bold text-primary mb-1">{title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-beige rounded-xl p-5">
              <p className="text-sm text-gray-700 font-semibold mb-2">Eligible return conditions:</p>
              <ul className="space-y-1.5">
                {[
                  'Item is unused and unwashed',
                  'Original tags are still attached',
                  'Original packaging is intact',
                  'Return is initiated within 30 days of delivery',
                ].map((pt) => (
                  <li key={pt} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle size={15} className="text-accent flex-shrink-0" />
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="container-custom max-w-4xl mx-auto">
          <hr className="border-gray-200" />
        </div>

        {/* 30-Day Return Policy */}
        <section id="return-policy" className="py-10 scroll-mt-20">
          <div className="container-custom max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-full bg-beige flex items-center justify-center flex-shrink-0">
                <Calendar size={28} className="text-accent" />
              </div>
              <div>
                <h2 className="font-serif text-3xl font-bold text-primary">30-Day Return Policy</h2>
                <p className="text-gray-500 text-sm mt-1">A full month to decide</p>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed mb-5">
              You have 30 full calendar days from the date of delivery to return any item, no matter the reason.
              We believe that's enough time to be sure you love what you bought — and if you don't, we make the process
              as painless as possible.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              {[
                { label: 'Return window', value: '30 calendar days from delivery' },
                { label: 'Refund method', value: 'Original payment method' },
                { label: 'Refund timeline', value: '3–5 business days after inspection' },
                { label: 'Exchanges', value: 'Accepted within the same window' },
              ].map(({ label, value }) => (
                <div key={label} className="card-base p-4 flex justify-between items-center">
                  <span className="text-gray-500 text-sm">{label}</span>
                  <span className="font-semibold text-primary text-sm">{value}</span>
                </div>
              ))}
            </div>

            <div className="bg-mint bg-opacity-30 rounded-xl p-5 border border-accent border-opacity-20">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-primary">Exchange instead of a refund?</span> During the return flow
                select "Exchange" and tell us what you need (size, colour, different item). Exchanges ship free and are
                subject to stock availability.
              </p>
            </div>
          </div>
        </section>

        {/* How to Return */}
        <section className="py-10 bg-gradient-to-b from-beige to-white">
          <div className="container-custom">
            <h2 className="font-serif text-4xl font-bold text-center text-primary mb-10">How to Return</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {steps.map(({ step, title, desc }) => (
                <div key={step} className="text-center">
                  <div className="w-14 h-14 rounded-full bg-accent text-primary font-bold text-xl flex items-center justify-center mx-auto mb-3">
                    {step}
                  </div>
                  <h3 className="font-bold text-primary mb-1">{title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-10">
          <div className="container-custom text-center">
            <h2 className="font-serif text-3xl font-bold text-primary mb-3">Need help with a return?</h2>
            <p className="text-gray-600 mb-6">Our support team is available Mon–Fri, 9 AM–6 PM.</p>
            <a
              href="/contact"
              className="inline-block bg-accent text-primary font-bold px-8 py-3 rounded-full hover:bg-opacity-90 transition-all"
            >
              Contact Support
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ReturnsPage;
