import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Share2, Check } from 'lucide-react';

function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subError, setSubError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setSubError('');
    if (!email) return;
    try {
      const res = await fetch('http://localhost:8000/api/newsletter/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSubscribed(true);
        setEmail('');
        setTimeout(() => setSubscribed(false), 4000);
      } else {
        setSubError('Could not subscribe. Please try again.');
      }
    } catch {
      setSubError('Could not reach server.');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
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
                className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: '#ffffff' }}
              />
              <button
                type="submit"
                className="w-full bg-accent text-primary font-bold py-2 rounded-lg hover:bg-opacity-90 transition-all"
              >
                SUBSCRIBE
              </button>
              {subscribed && <p className="text-green-400 text-sm">Thank you! Check your inbox.</p>}
              {subError && <p className="text-red-400 text-sm">{subError}</p>}
            </form>
          </div>

          {/* Terms & Conditions */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-6 text-accent">Terms and Conditions</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/returns#free-returns" className="text-light hover:text-accent transition">Free Returns</Link></li>
              <li><Link to="/returns#return-policy" className="text-light hover:text-accent transition">30 Days Return Policy</Link></li>
              <li><Link to="/eco" className="text-light hover:text-accent transition">Eco-Friendly Packaging</Link></li>
              <li><Link to="/fair-trade" className="text-light hover:text-accent transition">Fair Trade Certified</Link></li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-6 text-accent">Information</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/faq" className="text-light hover:text-accent transition">FAQs</Link></li>
              <li><Link to="/about" className="text-light hover:text-accent transition">About Your-cart</Link></li>
              <li><Link to="/privacy" className="text-light hover:text-accent transition">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-6 text-accent">Contact</h3>
            <div className="space-y-5 text-sm">
              <div className="flex items-start gap-3">
                <Phone size={18} className="text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <a href="tel:+9779812383254" style={{ color: '#ffffff' }} className="hover:text-accent transition leading-snug block">+977-98-1238-3254</a>
                  <p style={{ color: 'rgba(255,255,255,0.65)' }} className="text-xs mt-0.5">Mon-Fri: 9AM-6PM</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={18} className="text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <a href="mailto:support@your-cart.com" style={{ color: '#ffffff' }} className="hover:text-accent transition leading-snug block">support@your-cart.com</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p style={{ color: '#ffffff' }} className="font-bold leading-snug">Kathmandu, Nepal</p>
                  <p style={{ color: 'rgba(255,255,255,0.65)' }} className="text-xs mt-0.5">Head Office</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-secondary border-opacity-30 mt-8"></div>

        {/* Share & Brand Info */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          <div>
            <p className="text-accent font-bold mb-2">Share Your-cart</p>
            <button
              onClick={handleCopyLink}
              title="Copy site link"
              className="flex items-center gap-2 text-light hover:text-accent transition"
            >
              {copied ? (
                <>
                  <Check size={20} className="text-green-400" />
                  <span className="text-green-400 text-sm">Link copied!</span>
                </>
              ) : (
                <>
                  <Share2 size={20} />
                  <span className="text-sm">Copy link</span>
                </>
              )}
            </button>
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
        footer input::placeholder {
          color: rgba(255, 255, 255, 0.55);
        }
      `}</style>
    </footer>
  );
}

export default Footer;
