import React, { useState } from 'react';
import { Navbar } from '../components';
import Footer from '../components/Footer';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import Button from '../components/Button';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Message sent:', formData);
    alert('Thank you for contacting us! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-light flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero */}
        <section className="bg-gradient-to-r from-beige to-mint py-20">
          <div className="container-custom text-center">
            <h1 className="font-serif text-5xl font-bold text-primary mb-4">Get in Touch</h1>
            <p className="text-xl text-gray-600">We'd love to hear from you</p>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-20">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              {[
                { icon: Mail, label: 'Email', value: 'hello@muse.com', href: 'mailto:hello@muse.com' },
                { icon: Phone, label: 'Phone', value: '+1 (800) 555-1234', href: 'tel:+18005551234' },
                { icon: MapPin, label: 'Address', value: '123 Fashion St, Style City, SC 12345' },
              ].map(({ icon: Icon, label, value, href }, idx) => (
                <div key={idx} className="card-base p-8 text-center hover:shadow-lg transition-shadow">
                  <Icon size={48} className="text-accent mx-auto mb-4" />
                  <h3 className="font-bold text-lg mb-2">{label}</h3>
                  {href ? (
                    <a href={href} className="text-gray-600 hover:text-accent transition-colors">
                      {value}
                    </a>
                  ) : (
                    <p className="text-gray-600">{value}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Form */}
              <div className="card-base p-8">
                <h2 className="font-serif text-3xl font-bold text-primary mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-taupe rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-taupe rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-taupe rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <textarea
                    name="message"
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3 border border-taupe rounded-lg focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                  ></textarea>
                  <Button variant="primary" size="lg" type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </div>

              {/* Info */}
              <div>
                <h2 className="font-serif text-3xl font-bold text-primary mb-6">Business Hours</h2>
                <div className="space-y-4">
                  {[
                    { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM' },
                    { day: 'Saturday', hours: '10:00 AM - 4:00 PM' },
                    { day: 'Sunday', hours: 'Closed' },
                  ].map(({ day, hours }, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <Clock size={24} className="text-accent flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-primary">{day}</p>
                        <p className="text-gray-600">{hours}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12 card-base p-8 bg-gradient-to-br from-beige to-mint">
                  <h3 className="font-bold text-lg mb-4">Visit Our Stores</h3>
                  <p className="text-gray-700 mb-4">
                    Experience our collections in person at our flagship stores located in major cities.
                  </p>
                  <Button variant="outline" className="w-full">
                    Find a Store
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Placeholder */}
        <section className="py-12 bg-gray-200 h-96">
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-beige to-mint">
            <p className="text-gray-600 text-lg">Map Placeholder</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
