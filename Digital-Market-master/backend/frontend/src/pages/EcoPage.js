import React from 'react';
import { Navbar } from '../components';
import Footer from '../components/Footer';
import { Leaf, Package, Recycle, Droplets, Wind, CheckCircle } from 'lucide-react';

const commitments = [
  {
    icon: Package,
    title: 'Biodegradable Mailer Bags',
    desc: 'Every soft package ships in a fully compostable mailer made from plant-based PBAT and cornstarch. They break down naturally within 3–6 months in a home compost setting.',
  },
  {
    icon: Recycle,
    title: 'Recycled Cardboard Boxes',
    desc: 'Our rigid boxes are made from a minimum of 80% post-consumer recycled cardboard. Once unpacked, the box itself is 100% kerbside recyclable.',
  },
  {
    icon: Droplets,
    title: 'Soy-Based Ink Printing',
    desc: 'All labels, receipts, and printed inserts use soy-based inks — a renewable alternative to petroleum-based inks that produces sharper prints with less volatile organic compounds.',
  },
  {
    icon: Wind,
    title: 'Zero Single-Use Plastics',
    desc: 'Since 2023, Your-cart has eliminated all single-use plastics from our packaging supply chain. No bubble wrap, no plastic tape, no polystyrene void fill.',
  },
];

const stats = [
  { value: '100%', label: 'Plastic-free packaging' },
  { value: '80%+', label: 'Recycled material in boxes' },
  { value: '3–6mo', label: 'Compost breakdown time' },
  { value: '2023', label: 'Year we went fully plastic-free' },
];

const EcoPage = () => {
  return (
    <div className="min-h-screen bg-light flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero */}
        <section className="bg-gradient-to-r from-beige to-mint py-20">
          <div className="container-custom text-center">
            <Leaf size={56} className="text-accent mx-auto mb-4" />
            <h1 className="font-serif text-5xl font-bold text-primary mb-4">Eco-Friendly Packaging</h1>
            <p className="text-xl text-gray-600">Every box, bag, and label chosen with the planet in mind</p>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-20">
          <div className="container-custom max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl font-bold text-primary mb-6">Our Packaging Mission</h2>
            <p className="text-gray-700 leading-relaxed text-lg mb-4">
              At Your-cart, we believe that great products shouldn't come at the planet's expense. That's why we
              redesigned our entire packaging line from the ground up — choosing materials that are biodegradable,
              recycled, or both, without sacrificing the unboxing experience.
            </p>
            <p className="text-gray-700 leading-relaxed">
              From the moment your order leaves our warehouse to the moment it lands on your doorstep, every touchpoint
              has been reviewed for environmental impact.
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

        {/* Commitments */}
        <section className="py-20">
          <div className="container-custom">
            <h2 className="font-serif text-4xl font-bold text-center text-primary mb-16">What We Use</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {commitments.map(({ icon: Icon, title, desc }) => (
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

        {/* What you can do */}
        <section className="py-20 bg-gradient-to-b from-beige to-white">
          <div className="container-custom max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-center text-primary mb-10">
              What You Can Do With Your Packaging
            </h2>
            <div className="space-y-4">
              {[
                { action: 'Mailer bags', tip: 'Cut open and add to your home compost bin — they fully break down in 3–6 months.' },
                { action: 'Cardboard boxes', tip: 'Flatten and place in your kerbside recycling collection. Or reuse for storage, moving, or craft projects.' },
                { action: 'Paper inserts', tip: 'Recycle with regular paper or use as scratchpads before recycling.' },
                { action: 'Tissue paper', tip: 'If unwrinkled, reuse as gift wrap. Otherwise add to your compost.' },
              ].map(({ action, tip }) => (
                <div key={action} className="card-base p-5 flex gap-4 items-start">
                  <CheckCircle size={18} className="text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-primary">{action}: </span>
                    <span className="text-gray-600 text-sm">{tip}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="container-custom text-center">
            <h2 className="font-serif text-3xl font-bold text-primary mb-4">Want to know more about our sustainability efforts?</h2>
            <p className="text-gray-600 mb-8">Read our full story or get in touch with our team.</p>
            <div className="flex justify-center gap-4 flex-wrap">
              <a href="/about" className="inline-block bg-accent text-primary font-bold px-8 py-3 rounded-full hover:bg-opacity-90 transition-all">
                Our Story
              </a>
              <a href="/contact" className="inline-block border-2 border-primary text-primary font-bold px-8 py-3 rounded-full hover:bg-primary hover:text-light transition-all">
                Contact Us
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default EcoPage;
