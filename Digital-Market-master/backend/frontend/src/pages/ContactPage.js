import React, { useState } from 'react';
import { Navbar } from '../components';
import Footer from '../components/Footer';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import Button from '../components/Button';

const MAPS_URL = 'https://maps.google.com/?q=27.673360,85.338511';

const contacts = [
  {
    icon: Mail,
    label: 'Email',
    value: 'support@your-cart.com',
    href: 'mailto:support@your-cart.com',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+977-98-1238-3254',
    href: 'tel:+9779812383254',
  },
  {
    icon: MapPin,
    label: 'Address',
    value: 'Balkumari, Lalitpur, Nepal',
    href: MAPS_URL,
  },
];

const hours = [
  { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM' },
  { day: 'Saturday', hours: 'Closed' },
  { day: 'Sunday', hours: '10:00 AM - 4:00 PM' },
];

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setSendError('');
    try {
      const res = await fetch('http://localhost:8000/api/contact/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSent(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSendError('Something went wrong. Please try again.');
      }
    } catch {
      setSendError('Could not reach the server. Please try again later.');
    } finally {
      setSending(false);
    }
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

        {/* Contact cards */}
        <section className="py-20">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              {contacts.map(({ icon: Icon, label, value, href }) => (
                <a
                  key={label}
                  href={href}
                  target={label === 'Address' ? '_blank' : undefined}
                  rel={label === 'Address' ? 'noopener noreferrer' : undefined}
                  className="card-base p-8 text-center hover:shadow-lg transition-shadow block group"
                >
                  <Icon size={48} className="text-accent mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-lg mb-2 text-primary">{label}</h3>
                  <p className="text-gray-600 group-hover:text-accent transition-colors">{value}</p>
                </a>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Form */}
              <div className="card-base p-8">
                <h2 className="font-serif text-3xl font-bold text-primary mb-6">Send us a Message</h2>

                {sent ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-xl text-primary mb-2">Message Sent!</h3>
                    <p className="text-gray-600 mb-6">We've received your message and will reply within 2 business days. Check your inbox for a confirmation.</p>
                    <button onClick={() => setSent(false)} className="text-accent hover:underline font-semibold text-sm">
                      Send another message
                    </button>
                  </div>
                ) : (
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
                    />
                    {sendError && <p className="text-red-500 text-sm">{sendError}</p>}
                    <Button variant="primary" size="lg" type="submit" className="w-full" disabled={sending}>
                      {sending ? 'Sending…' : 'Send Message'}
                    </Button>
                  </form>
                )}
              </div>

              {/* Business hours + store */}
              <div>
                <h2 className="font-serif text-3xl font-bold text-primary mb-6">Business Hours</h2>
                <div className="space-y-4">
                  {hours.map(({ day, hours: h }) => (
                    <div key={day} className="flex items-center gap-4">
                      <Clock size={24} className="text-accent flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-primary">{day}</p>
                        <p className="text-gray-600">{h}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12 card-base p-8 bg-gradient-to-br from-beige to-mint">
                  <h3 className="font-bold text-lg mb-4">Visit Our Store</h3>
                  <p className="text-gray-700 mb-4">
                    Come experience our collections in person at our store in Balkumari, Lalitpur.
                  </p>
                  <a
                    href={MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full"
                  >
                    <Button variant="outline" className="w-full">
                      Find Our Store
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map */}
        <section className="w-full" style={{ height: '450px' }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d1481.8615489963884!2d85.33851122553101!3d27.673359995444795!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2s!5e1!3m2!1sen!2snp!4v1780495407819!5m2!1sen!2snp"
            width="100%"
            height="100%"
            style={{ border: 0, display: 'block' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Your-cart Store Location"
          />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
