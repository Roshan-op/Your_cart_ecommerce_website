import React from 'react';
import { Navbar } from '../components';
import Footer from '../components/Footer';
import { Award, Users, ShieldCheck, BarChart2, CheckCircle, Heart } from 'lucide-react';

const pillars = [
  {
    icon: Users,
    title: 'Fair Wages for All Workers',
    desc: 'Every manufacturer and artisan in our supply chain is contractually guaranteed a living wage — not just the legal minimum. We review wage levels annually against local cost-of-living data.',
  },
  {
    icon: ShieldCheck,
    title: 'Safe Working Conditions',
    desc: 'All partner facilities undergo annual third-party safety audits. We check for adequate ventilation, protective equipment, reasonable working hours, and safe machinery.',
  },
  {
    icon: Heart,
    title: 'No Child or Forced Labour',
    desc: 'Zero tolerance, full stop. Our supplier contracts include strict clauses against child and forced labour, with immediate termination penalties for any violation.',
  },
  {
    icon: BarChart2,
    title: 'Community Development Premiums',
    desc: 'A portion of every Your-cart purchase contributes to a Fair Trade premium fund. Communities decide how to use this fund — often investing in healthcare, education, or local infrastructure.',
  },
];

const certProcess = [
  { step: '01', title: 'Supplier Application', desc: 'Potential partners apply and submit documentation on wages, working conditions, and labour practices.' },
  { step: '02', title: 'Third-Party Audit', desc: 'An independent auditor visits the facility to verify all claims against Fair Trade standards.' },
  { step: '03', title: 'Certification Granted', desc: 'Suppliers who meet all criteria receive Fair Trade certification valid for one year.' },
  { step: '04', title: 'Annual Re-Audit', desc: 'Certification is renewed annually. Any non-compliance is addressed immediately or results in disqualification.' },
];

const stats = [
  { value: '100%', label: 'Certified suppliers' },
  { value: 'Annual', label: 'Re-audit frequency' },
  { value: '3rd party', label: 'Independent auditors' },
  { value: '2020', label: 'Fair Trade since' },
];

const FairTradePage = () => {
  return (
    <div className="min-h-screen bg-light flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero */}
        <section className="bg-gradient-to-r from-beige to-mint py-20">
          <div className="container-custom text-center">
            <Award size={56} className="text-accent mx-auto mb-4" />
            <h1 className="font-serif text-5xl font-bold text-primary mb-4">Fair Trade Certified</h1>
            <p className="text-xl text-gray-600">Every purchase supports ethical wages and dignified work</p>
          </div>
        </section>

        {/* What it means */}
        <section className="py-20">
          <div className="container-custom max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl font-bold text-primary mb-6">What Fair Trade Means to Us</h2>
            <p className="text-gray-700 leading-relaxed text-lg mb-4">
              Fair Trade isn't a marketing label for Your-cart — it's a core operating principle. Since our founding
              in 2020, we have partnered exclusively with manufacturers and artisans who meet rigorous Fair Trade
              standards for wages, safety, and worker rights.
            </p>
            <p className="text-gray-700 leading-relaxed">
              When you shop at Your-cart, you're not just buying a product. You're directly contributing to better
              livelihoods for the skilled workers who made it.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 bg-beige">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map(({ value, label }) => (
                <div key={label} className="text-center">
                  <p className="font-serif text-4xl font-bold text-accent mb-2">{value}</p>
                  <p className="text-gray-600 text-sm">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Four Pillars */}
        <section className="py-20">
          <div className="container-custom">
            <h2 className="font-serif text-4xl font-bold text-center text-primary mb-16">Our Four Pillars</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {pillars.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="card-base p-8 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-beige flex items-center justify-center flex-shrink-0">
                      <Icon size={24} className="text-accent" />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-primary">{title}</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-sm">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Certification Process */}
        <section className="py-20 bg-gradient-to-b from-beige to-white">
          <div className="container-custom">
            <h2 className="font-serif text-4xl font-bold text-center text-primary mb-16">How We Certify Our Suppliers</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {certProcess.map(({ step, title, desc }) => (
                <div key={step} className="text-center">
                  <div className="w-14 h-14 rounded-full bg-accent text-primary font-bold text-xl flex items-center justify-center mx-auto mb-4">
                    {step}
                  </div>
                  <h3 className="font-bold text-primary mb-2">{title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Supplier Checklist */}
        <section className="py-20">
          <div className="container-custom max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-center text-primary mb-10">
              Our Supplier Standards at a Glance
            </h2>
            <div className="space-y-3">
              {[
                'Living wages paid above local legal minimum',
                'Maximum 48-hour standard working week with voluntary overtime',
                'Safe, clean, and well-ventilated work environments',
                'No child labour (under 15) under any circumstances',
                'No forced, bonded, or involuntary labour',
                'Freedom of association and collective bargaining respected',
                'Non-discrimination in hiring and promotion',
                'Annual third-party facility audits',
                'Community development premiums paid per order',
              ].map((item) => (
                <div key={item} className="card-base p-4 flex gap-3 items-center">
                  <CheckCircle size={18} className="text-accent flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-beige">
          <div className="container-custom text-center">
            <h2 className="font-serif text-3xl font-bold text-primary mb-4">Shop with purpose</h2>
            <p className="text-gray-600 mb-8">
              Every item you buy from Your-cart carries the Fair Trade promise — quality you can feel good about.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <a href="/shop" className="inline-block bg-accent text-primary font-bold px-8 py-3 rounded-full hover:bg-opacity-90 transition-all">
                Shop Now
              </a>
              <a href="/about" className="inline-block border-2 border-primary text-primary font-bold px-8 py-3 rounded-full hover:bg-primary hover:text-light transition-all">
                Our Story
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FairTradePage;
