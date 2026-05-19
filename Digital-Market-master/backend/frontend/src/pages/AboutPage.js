import React from 'react';
import { Navbar } from '../components';
import Footer from '../components/Footer';
import { Users, Leaf, Award } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-light flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero */}
        <section className="bg-gradient-to-r from-beige to-mint py-20">
          <div className="container-custom text-center">
            <h1 className="font-serif text-5xl font-bold text-primary mb-4">About MUSE</h1>
            <p className="text-xl text-gray-600">Sustainably Stylish, Naturally You</p>
          </div>
        </section>

        {/* Story */}
        <section className="py-20">
          <div className="container-custom grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-4xl font-bold text-primary mb-6">Our Story</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Founded in 2020, MUSE was born from a simple belief: that fashion should never compromise on ethics or sustainability.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We started as a small team passionate about creating premium, eco-friendly fashion pieces that don't sacrifice style. Every product is carefully sourced and crafted with both the planet and our customers in mind.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Today, MUSE serves thousands of customers globally, proving that sustainable fashion isn't just possible—it's the future.
              </p>
            </div>
            <img
              src="/images/watch.avif"
              alt="Our Story"
              className="rounded-2xl shadow-lg h-96 object-cover"
            />
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-gradient-to-b from-beige to-white">
          <div className="container-custom">
            <h2 className="font-serif text-4xl font-bold text-center text-primary mb-16">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Leaf, title: 'Sustainability', description: 'We commit to eco-friendly practices at every step of production.' },
                { icon: Award, title: 'Quality', description: 'Premium materials and expert craftsmanship in every piece.' },
                { icon: Users, title: 'Community', description: 'We believe in supporting fair wages and ethical labor practices.' },
              ].map(({ icon: Icon, title, description }, idx) => (
                <div key={idx} className="card-base p-8 text-center">
                  <Icon size={48} className="text-accent mx-auto mb-4" />
                  <h3 className="font-bold text-xl mb-3">{title}</h3>
                  <p className="text-gray-600">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20">
          <div className="container-custom">
            <h2 className="font-serif text-4xl font-bold text-center text-primary mb-16">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: 'Sarah Johnson', role: 'Founder & CEO', image: '/images/watch.avif' },
                { name: 'Michael Chen', role: 'Creative Director', image: '/images/watch.avif' },
                { name: 'Emma Williams', role: 'Sustainability Lead', image: '/images/watch.avif' },
              ].map((member, idx) => (
                <div key={idx} className="card-base text-center overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="font-bold text-lg text-primary">{member.name}</h3>
                    <p className="text-gray-600">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
