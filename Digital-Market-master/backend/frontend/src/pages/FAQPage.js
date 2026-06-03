import React, { useState } from 'react';
import { Navbar } from '../components';
import Footer from '../components/Footer';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const faqs = [
  {
    category: 'Orders & Shipping',
    items: [
      {
        q: 'How long does delivery take?',
        a: 'Standard delivery within Kathmandu Valley takes 1–2 business days. Outside the valley, expect 3–5 business days depending on your location.',
      },
      {
        q: 'How do I track my order?',
        a: 'Once your order is dispatched you will receive a confirmation. You can also check your order status anytime from your account under "My Orders".',
      },
      {
        q: 'Do you offer free shipping?',
        a: 'Yes! Orders above Rs. 3,000 qualify for free standard shipping anywhere in Nepal.',
      },
      {
        q: 'Can I change my delivery address after placing an order?',
        a: 'Address changes can be made within 1 hour of placing the order. Contact our support team immediately via the Contact page.',
      },
    ],
  },
  {
    category: 'Returns & Exchanges',
    items: [
      {
        q: 'What is your return policy?',
        a: 'We offer a hassle-free 30-day return window from the date of delivery. Items must be unused, unwashed, and in their original packaging with tags attached.',
      },
      {
        q: 'How do I initiate a return?',
        a: 'Go to your account → My Orders, select the item you want to return, and click "Request Return". Our team will arrange a free pickup within 48 hours.',
      },
      {
        q: 'When will I receive my refund?',
        a: 'Refunds are processed within 3–5 business days after we receive and inspect the returned item. The amount is credited back to your original payment method.',
      },
      {
        q: 'Can I exchange a product for a different size or colour?',
        a: 'Absolutely. During the return process select "Exchange" and specify what you need. Exchanges are subject to stock availability.',
      },
    ],
  },
  {
    category: 'Products & Sizing',
    items: [
      {
        q: 'How do I find the right size?',
        a: 'Visit our Size Chart page for detailed measurements across all clothing and footwear categories. If you are between sizes, we recommend sizing up.',
      },
      {
        q: 'Are product images accurate to colour?',
        a: 'We photograph every product under natural lighting. Slight variations may occur between screens, but we always aim for the most accurate representation.',
      },
      {
        q: 'Are your products eco-friendly?',
        a: 'Yes. Your-cart is committed to sustainable sourcing. All packaging is biodegradable, and we partner only with Fair Trade–certified suppliers.',
      },
    ],
  },
  {
    category: 'Payments',
    items: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept Khalti, eSewa, cash on delivery, and major debit/credit cards.',
      },
      {
        q: 'Is my payment information secure?',
        a: 'Yes. All transactions are encrypted with industry-standard SSL. We never store your card details on our servers.',
      },
      {
        q: 'Can I pay cash on delivery?',
        a: 'Cash on delivery is available for orders within Nepal. A small COD handling fee of Rs. 50 may apply for orders below Rs. 1,500.',
      },
    ],
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-6 py-4 text-left bg-white hover:bg-beige transition-colors"
      >
        <span className="font-semibold text-primary">{q}</span>
        {open ? <ChevronUp size={18} className="text-accent flex-shrink-0" /> : <ChevronDown size={18} className="text-accent flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-6 py-4 bg-gray-50 text-gray-700 leading-relaxed text-sm border-t border-gray-100">
          {a}
        </div>
      )}
    </div>
  );
}

const FAQPage = () => {
  return (
    <div className="min-h-screen bg-light flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero */}
        <section className="bg-gradient-to-r from-beige to-mint py-20">
          <div className="container-custom text-center">
            <HelpCircle size={56} className="text-accent mx-auto mb-4" />
            <h1 className="font-serif text-5xl font-bold text-primary mb-4">Frequently Asked Questions</h1>
            <p className="text-xl text-gray-600">Everything you need to know about shopping at Your-cart</p>
          </div>
        </section>

        {/* FAQ Sections */}
        <section className="py-20">
          <div className="container-custom max-w-3xl mx-auto space-y-14">
            {faqs.map(({ category, items }) => (
              <div key={category}>
                <h2 className="font-serif text-2xl font-bold text-primary mb-6 border-l-4 border-accent pl-4">
                  {category}
                </h2>
                <div className="space-y-3">
                  {items.map((item) => (
                    <FAQItem key={item.q} q={item.q} a={item.a} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Still have questions */}
        <section className="py-16 bg-gradient-to-b from-beige to-white">
          <div className="container-custom text-center">
            <h2 className="font-serif text-3xl font-bold text-primary mb-4">Still have questions?</h2>
            <p className="text-gray-600 mb-8">Our support team is happy to help.</p>
            <a
              href="/contact"
              className="inline-block bg-accent text-primary font-bold px-8 py-3 rounded-full hover:bg-opacity-90 transition-all"
            >
              Contact Us
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FAQPage;
