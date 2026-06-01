import React, { useState } from 'react';
import { Mail, Phone, MapPin, Share2, Heart } from 'lucide-react';

function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-primary text-light py-16">
      <div className="container-custom">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Newsletter Section */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-6 text-accent">Your-cart's Newsletter</h3>
            <p className="text-light text-sm mb-4">Subscribe for exclusive offers and updates on sustainable fashion.</p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg bg-secondary text-light placeholder-light placeholder-opacity-60 focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button
                type="submit"
                className="w-full bg-accent text-primary font-bold py-2 rounded-lg hover:bg-opacity-90 transition-all"
              >
                SUBSCRIBE
              </button>
              {subscribed && <p className="text-green-400 text-sm">Thank you for subscribing!</p>}
            </form>
          </div>

          {/* Terms & Conditions */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-6 text-accent">Terms and Conditions</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="text-light hover:text-accent transition">Free Returns</a></li>
              <li><a href="#" className="text-light hover:text-accent transition">30 Days Return Policy</a></li>
              <li><a href="#" className="text-light hover:text-accent transition">Eco-Friendly Packaging</a></li>
              <li><a href="#" className="text-light hover:text-accent transition">Fair Trade Certified</a></li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-6 text-accent">Information</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="text-light hover:text-accent transition">FAQs</a></li>
              <li><a href="#" className="text-light hover:text-accent transition">About Your-cart</a></li>
              <li><a href="#" className="text-light hover:text-accent transition">Privacy Policy</a></li>
              <li><a href="#" className="text-light hover:text-accent transition">Your-cart Legal</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-6 text-accent">Contact</h3>
            <div className="space-y-4 text-light text-sm">
              <div className="flex items-start gap-3">
                <Phone size={18} className="text-accent mt-1 flex-shrink-0" />
                <div>
                  <p>+977-1-5550000</p>
                  <p className="text-xs text-light opacity-75">Mon-Fri: 9AM-6PM</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={18} className="text-accent mt-1 flex-shrink-0" />
                <p>support@your-cart.com</p>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-accent mt-1 flex-shrink-0" />
                <div>
                  <p className="font-bold">Kathmandu, Nepal</p>
                  <p className="text-xs text-light opacity-75">Head Office</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-secondary border-opacity-30 my-8"></div>

        {/* Social & Brand Info */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          <div>
            <p className="text-accent font-bold mb-2">Follow Your-cart</p>
            <div className="flex gap-4">
              <a href="#" className="text-light hover:text-accent transition">
                <Share2 size={20} title="Share on Facebook" />
              </a>
              <a href="#" className="text-light hover:text-accent transition">
                <Heart size={20} title="Like on Instagram" />
              </a>
            </div>
          </div>
          <div className="text-center text-sm text-light opacity-75">
            <p>Premium Sustainable Fashion | Est. 2020</p>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-xs text-light opacity-60 space-y-2">
          <p>© 2020-2026 Your-cart. All rights reserved. | Sustainably Stylish, Naturally You</p>
          <p>Your-cart is committed to ethical production and environmental responsibility.</p>
        </div>
      </div>

      <style jsx>{`
        footer {
          background: linear-gradient(135deg, #12161A 0%, #1a1f28 100%);
        }
      `}</style>
    </footer>
  );
}

export default Footer;
