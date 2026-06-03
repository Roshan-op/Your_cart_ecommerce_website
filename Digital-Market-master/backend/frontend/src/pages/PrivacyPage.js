import React from 'react';
import { Navbar } from '../components';
import Footer from '../components/Footer';
import { Shield, Eye, Lock, FileText, UserCheck, Trash2 } from 'lucide-react';

const sections = [
  {
    icon: Eye,
    title: 'Information We Collect',
    content: [
      {
        subtitle: 'Account Information',
        text: 'When you create an account we collect your name, email address, and phone number. This information is used solely to manage your account and process orders.',
      },
      {
        subtitle: 'Order & Payment Data',
        text: 'We collect your delivery address and order history. Payment details (card numbers, wallet tokens) are handled directly by our payment processors — Khalti and eSewa — and are never stored on Your-cart servers.',
      },
      {
        subtitle: 'Usage Data',
        text: 'We collect anonymised data on how you interact with our website (pages visited, search queries, clicks) to improve your shopping experience. This data cannot be used to identify you personally.',
      },
    ],
  },
  {
    icon: Lock,
    title: 'How We Use Your Data',
    content: [
      {
        subtitle: 'To Fulfil Your Orders',
        text: 'Your name, address, and contact details are shared with our logistics partners only to the extent necessary to deliver your order.',
      },
      {
        subtitle: 'To Communicate With You',
        text: 'We send order confirmations, shipping updates, and — if you opt in — newsletters with exclusive offers. You can unsubscribe from marketing emails at any time.',
      },
      {
        subtitle: 'To Improve Our Services',
        text: 'Aggregated, anonymised data helps us understand which products our customers love and how to make the shopping experience better for everyone.',
      },
    ],
  },
  {
    icon: UserCheck,
    title: 'Your Rights',
    content: [
      {
        subtitle: 'Access & Correction',
        text: 'You can view and update your personal information at any time from your account settings.',
      },
      {
        subtitle: 'Data Deletion',
        text: 'You have the right to request deletion of your account and all associated personal data. Contact us at support@your-cart.com and we will process your request within 14 days.',
      },
      {
        subtitle: 'Opt-Out',
        text: 'You may opt out of marketing communications at any time using the unsubscribe link in any email, or by contacting our support team.',
      },
    ],
  },
  {
    icon: Shield,
    title: 'Data Security',
    content: [
      {
        subtitle: 'Encryption',
        text: 'All data transmitted between your browser and our servers is encrypted using TLS (HTTPS). Sensitive fields in our database are encrypted at rest.',
      },
      {
        subtitle: 'Access Controls',
        text: 'Access to customer data is restricted to authorised team members only, on a need-to-know basis. All access is logged and audited regularly.',
      },
      {
        subtitle: 'Third-Party Processors',
        text: 'We work only with reputable third-party services (Khalti, eSewa, Google Analytics) that comply with industry data protection standards.',
      },
    ],
  },
];

const legalTerms = [
  {
    title: 'Intellectual Property',
    text: 'All content on this website — including logos, images, text, and design — is the property of Your-cart and protected by applicable copyright and trademark laws. Unauthorised reproduction is prohibited.',
  },
  {
    title: 'Limitation of Liability',
    text: 'Your-cart shall not be liable for any indirect, incidental, or consequential damages arising from the use of our platform. Our total liability for any claim shall not exceed the amount paid for the relevant order.',
  },
  {
    title: 'Governing Law',
    text: 'These terms are governed by the laws of Nepal. Any disputes shall be subject to the exclusive jurisdiction of the courts of Kathmandu.',
  },
  {
    title: 'Changes to These Terms',
    text: 'We may update this Privacy Policy and Legal Terms periodically. Continued use of our platform after changes are posted constitutes your acceptance of the revised terms.',
  },
];

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-light flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero */}
        <section className="bg-gradient-to-r from-beige to-mint py-20">
          <div className="container-custom text-center">
            <Shield size={56} className="text-accent mx-auto mb-4" />
            <h1 className="font-serif text-5xl font-bold text-primary mb-4">Privacy Policy & Legal</h1>
            <p className="text-xl text-gray-600">Last updated: June 2026</p>
          </div>
        </section>

        {/* Intro */}
        <section className="py-12">
          <div className="container-custom max-w-3xl mx-auto">
            <p className="text-gray-700 leading-relaxed text-base">
              At Your-cart, your privacy matters as much as your style. This page explains what information we collect,
              why we collect it, and the rights you have over your data. It also sets out the legal terms that govern
              your use of our platform.
            </p>
          </div>
        </section>

        {/* Privacy Sections */}
        <section className="pb-20">
          <div className="container-custom max-w-3xl mx-auto space-y-14">
            {sections.map(({ icon: Icon, title, content }) => (
              <div key={title}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-beige flex items-center justify-center flex-shrink-0">
                    <Icon size={20} className="text-accent" />
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-primary">{title}</h2>
                </div>
                <div className="space-y-5 pl-13">
                  {content.map(({ subtitle, text }) => (
                    <div key={subtitle}>
                      <h3 className="font-semibold text-primary mb-1">{subtitle}</h3>
                      <p className="text-gray-600 leading-relaxed text-sm">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Legal Terms */}
        <section className="py-20 bg-gradient-to-b from-beige to-white">
          <div className="container-custom max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-10">
              <FileText size={28} className="text-accent" />
              <h2 className="font-serif text-3xl font-bold text-primary">Legal Terms</h2>
            </div>
            <div className="space-y-6">
              {legalTerms.map(({ title, text }) => (
                <div key={title} className="card-base p-6">
                  <h3 className="font-bold text-primary mb-2">{title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-16">
          <div className="container-custom text-center">
            <h2 className="font-serif text-3xl font-bold text-primary mb-4">Questions about your privacy?</h2>
            <p className="text-gray-600 mb-8">
              Reach us at{' '}
              <a href="mailto:support@your-cart.com" className="text-accent hover:underline">
                support@your-cart.com
              </a>{' '}
              — we respond within 2 business days.
            </p>
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

export default PrivacyPage;
