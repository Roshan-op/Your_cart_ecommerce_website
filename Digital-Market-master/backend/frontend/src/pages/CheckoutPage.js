import React, { useState } from 'react';
import { Navbar } from '../components';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { initiateKhaltiPayment } from '../services/khaltiService';
import { CreditCard, Lock } from 'lucide-react';

/* ─── helpers ─────────────────────────────────────────────────────────────── */

const fmtCardNumber = (v) =>
  v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

const fmtExpiry = (v) => {
  const d = v.replace(/\D/g, '').slice(0, 4);
  return d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d;
};

const validateCard = (card) => {
  const errs = {};
  if (card.cardNumber.replace(/\s/g, '').length !== 16)
    errs.cardNumber = 'Enter a valid 16-digit card number';
  if (!card.cardName.trim())
    errs.cardName = 'Cardholder name is required';
  const [mm = '', yy = ''] = card.expiry.split('/');
  const month = parseInt(mm, 10);
  const year = parseInt('20' + yy, 10);
  const now = new Date();
  if (
    mm.length !== 2 || yy.length !== 2 ||
    month < 1 || month > 12 ||
    year < now.getFullYear() ||
    (year === now.getFullYear() && month < now.getMonth() + 1)
  ) errs.expiry = 'Enter a valid expiry date (MM/YY)';
  if (!/^\d{3,4}$/.test(card.cvv))
    errs.cvv = 'Enter a valid CVV (3–4 digits)';
  return errs;
};

/* ─── component ───────────────────────────────────────────────────────────── */

const CheckoutPage = ({ history }) => {
  const { cartItems, getTotalPrice, createOrder, loading: cartLoading } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [processingMsg, setProcessingMsg] = useState('');
  const [error, setError] = useState(null);
  const [showLoginPrompt] = useState(!isAuthenticated);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: user?.email || '',
    phone: '', address: '', city: '', postalCode: '', country: '',
  });

  const [cardData, setCardData] = useState({
    cardNumber: '', cardName: '', expiry: '', cvv: '',
  });
  const [cardErrors, setCardErrors] = useState({});

  /* redirect if empty cart */
  React.useEffect(() => {
    if (cartItems.length === 0 && !cartLoading) {
      if (history) history.push('/cart');
      else window.location.href = '/cart';
    }
  }, [cartItems, cartLoading, history]);

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.1;
  const shippingPrice = 10;
  const total = subtotal + tax + shippingPrice;

  /* ── input handlers ── */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setError(null);
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardErrors((p) => ({ ...p, [name]: '' }));
    if (name === 'cardNumber')
      setCardData((p) => ({ ...p, cardNumber: fmtCardNumber(value) }));
    else if (name === 'expiry')
      setCardData((p) => ({ ...p, expiry: fmtExpiry(value) }));
    else if (name === 'cvv')
      setCardData((p) => ({ ...p, cvv: value.replace(/\D/g, '').slice(0, 4) }));
    else
      setCardData((p) => ({ ...p, [name]: value }));
  };

  /* ── submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    /* step 1 → validate shipping */
    if (step === 1) {
      const { firstName, lastName, email, phone, address, city, postalCode, country } = formData;
      if (!firstName || !lastName || !email || !phone || !address || !city || !postalCode || !country) {
        setError('Please fill in all required fields');
        return;
      }
      setStep(2);
      return;
    }

    /* step 2 → validate card if needed, then place order */
    if (paymentMethod === 'card') {
      const errs = validateCard(cardData);
      if (Object.keys(errs).length > 0) { setCardErrors(errs); return; }
    }

    try {
      setLoading(true);
      const shippingAddress = {
        address: formData.address, city: formData.city,
        postalCode: formData.postalCode, country: formData.country,
        PhoneNumber: formData.phone,
      };

      const order = await createOrder(shippingAddress, paymentMethod);

      if (paymentMethod === 'khalti') {
        setLoading(false);
        initiateKhaltiPayment({
          orderId: order._id, totalPrice: total,
          phone: formData.phone, email: formData.email,
        });
        return;
      }

      if (paymentMethod === 'card') {
        setProcessingMsg('Verifying card details…');
        await new Promise((r) => setTimeout(r, 900));
        setProcessingMsg('Authorising payment…');
        await new Promise((r) => setTimeout(r, 900));
        setProcessingMsg('Confirming transaction…');
        await new Promise((r) => setTimeout(r, 700));
      }

      setLoading(false);
      if (history) history.push(`/payment-success/${order._id}`);
      else window.location.href = `/payment-success/${order._id}`;
    } catch (err) {
      setError(err.message || 'Failed to place order');
      setLoading(false);
      setProcessingMsg('');
    }
  };

  /* ─── login gate ──────────────────────────────────────────────────────────── */
  if (showLoginPrompt && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-light flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-xl p-10 max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="font-serif text-2xl font-bold text-primary mb-2">Login Required</h2>
            <p className="text-gray-500 mb-8 text-sm leading-relaxed">
              You need to be logged in to complete your checkout. Would you like to go to the login page?
            </p>
            <div className="flex gap-3">
              <button onClick={() => history ? history.push('/cart') : (window.location.href = '/cart')}
                className="flex-1 py-3 rounded-lg border-2 border-primary text-primary font-semibold hover:bg-gray-50 transition-colors">
                No, go back
              </button>
              <button onClick={() => {
                  localStorage.setItem('postLoginRedirect', '/cart');
                  history ? history.push('/login') : (window.location.href = '/login');
                }}
                className="flex-1 py-3 rounded-lg bg-primary text-light font-semibold hover:shadow-lg transition-all">
                Yes, login
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-light flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <p>Your cart is empty. Redirecting…</p>
        </main>
      </div>
    );
  }

  /* ─── button label ──────────────────────────────────────────────────────── */
  const submitLabel = () => {
    if (loading) return processingMsg || 'Processing…';
    if (step === 1) return 'Continue to Payment';
    if (paymentMethod === 'card')   return 'Pay Now';
    if (paymentMethod === 'khalti') return 'Continue to Khalti';
    return 'Place Order';
  };

  /* ─── main render ───────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-light flex flex-col">
      <Navbar />

      <main className="flex-grow py-12">
        <div className="container-custom">
          <h1 className="font-serif text-4xl font-bold text-primary mb-12">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ── left: form ── */}
            <div className="lg:col-span-2">
              <div className="card-base p-8">
                {/* step indicator */}
                <div className="flex gap-8 mb-12">
                  {[{ n: 1, label: 'Shipping' }, { n: 2, label: 'Payment' }].map(({ n, label }) => (
                    <div key={n} className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${step >= n ? 'bg-primary text-light' : 'bg-beige text-gray-400'}`}>
                        {n}
                      </div>
                      <span className={step >= n ? 'text-primary font-semibold' : 'text-gray-400'}>
                        {label}
                      </span>
                    </div>
                  ))}
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* ── STEP 1: shipping ── */}
                  {step === 1 && (
                    <div>
                      <h2 className="font-bold text-2xl mb-6">Shipping Address</h2>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        {['firstName', 'lastName'].map((f) => (
                          <input key={f} type="text" name={f}
                            placeholder={f === 'firstName' ? 'First Name' : 'Last Name'}
                            value={formData[f]} onChange={handleInputChange} required disabled={loading}
                            className="px-4 py-3 border border-taupe rounded-lg focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-gray-100" />
                        ))}
                      </div>
                      <input type="email" name="email" placeholder="Email Address"
                        value={formData.email} onChange={handleInputChange} required disabled={loading}
                        className="w-full px-4 py-3 border border-taupe rounded-lg focus:outline-none focus:ring-2 focus:ring-accent mb-4 disabled:bg-gray-100" />
                      <input type="tel" name="phone" placeholder="Phone Number"
                        value={formData.phone} onChange={handleInputChange} required disabled={loading}
                        className="w-full px-4 py-3 border border-taupe rounded-lg focus:outline-none focus:ring-2 focus:ring-accent mb-4 disabled:bg-gray-100" />
                      <input type="text" name="address" placeholder="Street Address"
                        value={formData.address} onChange={handleInputChange} required disabled={loading}
                        className="w-full px-4 py-3 border border-taupe rounded-lg focus:outline-none focus:ring-2 focus:ring-accent mb-4 disabled:bg-gray-100" />
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <input type="text" name="city" placeholder="City"
                          value={formData.city} onChange={handleInputChange} required disabled={loading}
                          className="px-4 py-3 border border-taupe rounded-lg focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-gray-100" />
                        <input type="text" name="postalCode" placeholder="Postal Code"
                          value={formData.postalCode} onChange={handleInputChange} required disabled={loading}
                          className="px-4 py-3 border border-taupe rounded-lg focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-gray-100" />
                      </div>
                      <input type="text" name="country" placeholder="Country"
                        value={formData.country} onChange={handleInputChange} required disabled={loading}
                        className="w-full px-4 py-3 border border-taupe rounded-lg focus:outline-none focus:ring-2 focus:ring-accent mb-8 disabled:bg-gray-100" />
                    </div>
                  )}

                  {/* ── STEP 2: payment ── */}
                  {step === 2 && (
                    <div>
                      <h2 className="font-bold text-2xl mb-6">Payment Method</h2>

                      <div className="space-y-3 mb-6">
                        {/* Card */}
                        <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-primary bg-beige' : 'border-gray-200 hover:border-gray-300'}`}>
                          <input type="radio" name="payment" value="card"
                            checked={paymentMethod === 'card'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            disabled={loading} className="w-4 h-4 accent-primary" />
                          <span className="ml-4 text-2xl">💳</span>
                          <div className="ml-3">
                            <span className="font-semibold text-primary block">Credit / Debit Card</span>
                            <span className="text-xs text-gray-500">Visa, Mastercard, and others</span>
                          </div>
                        </label>

                        {/* Khalti */}
                        <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${paymentMethod === 'khalti' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'}`}>
                          <input type="radio" name="payment" value="khalti"
                            checked={paymentMethod === 'khalti'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            disabled={loading} className="w-4 h-4 accent-purple-600" />
                          <span className="ml-4 text-2xl">📱</span>
                          <div className="ml-3">
                            <span className="font-semibold text-primary block">Khalti Digital Wallet</span>
                            <span className="text-xs text-gray-500">Fast and secure digital payment</span>
                          </div>
                        </label>

                        {/* COD */}
                        <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                          <input type="radio" name="payment" value="cod"
                            checked={paymentMethod === 'cod'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            disabled={loading} className="w-4 h-4 accent-green-600" />
                          <span className="ml-4 text-2xl">🏠</span>
                          <div className="ml-3">
                            <span className="font-semibold text-primary block">Cash on Delivery</span>
                            <span className="text-xs text-gray-500">Pay in cash when your order arrives</span>
                          </div>
                        </label>
                      </div>

                      {/* ── card details form (only when card selected) ── */}
                      {paymentMethod === 'card' && (
                        <div className="mt-2 p-5 bg-gray-50 border border-gray-200 rounded-xl">
                          <div className="flex items-center gap-2 mb-4">
                            <CreditCard size={18} className="text-primary" />
                            <span className="font-semibold text-primary text-sm">Card Details</span>
                            <Lock size={13} className="text-gray-400 ml-auto" />
                            <span className="text-xs text-gray-400">Secure</span>
                          </div>

                          {/* Card number */}
                          <div className="mb-3">
                            <input
                              type="text"
                              name="cardNumber"
                              placeholder="1234 5678 9012 3456"
                              value={cardData.cardNumber}
                              onChange={handleCardChange}
                              disabled={loading}
                              inputMode="numeric"
                              autoComplete="off"
                              className={`w-full px-4 py-3 border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-gray-100 ${cardErrors.cardNumber ? 'border-red-400 bg-red-50' : 'border-taupe bg-white'}`}
                            />
                            {cardErrors.cardNumber && <p className="mt-1 text-xs text-red-500">{cardErrors.cardNumber}</p>}
                          </div>

                          {/* Cardholder name */}
                          <div className="mb-3">
                            <input
                              type="text"
                              name="cardName"
                              placeholder="Cardholder Name"
                              value={cardData.cardName}
                              onChange={handleCardChange}
                              disabled={loading}
                              autoComplete="off"
                              className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-gray-100 ${cardErrors.cardName ? 'border-red-400 bg-red-50' : 'border-taupe bg-white'}`}
                            />
                            {cardErrors.cardName && <p className="mt-1 text-xs text-red-500">{cardErrors.cardName}</p>}
                          </div>

                          {/* Expiry + CVV */}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <input
                                type="text"
                                name="expiry"
                                placeholder="MM/YY"
                                value={cardData.expiry}
                                onChange={handleCardChange}
                                disabled={loading}
                                autoComplete="off"
                                inputMode="numeric"
                                className={`w-full px-4 py-3 border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-gray-100 ${cardErrors.expiry ? 'border-red-400 bg-red-50' : 'border-taupe bg-white'}`}
                              />
                              {cardErrors.expiry && <p className="mt-1 text-xs text-red-500">{cardErrors.expiry}</p>}
                            </div>
                            <div>
                              <input
                                type="password"
                                name="cvv"
                                placeholder="CVV"
                                value={cardData.cvv}
                                onChange={handleCardChange}
                                disabled={loading}
                                inputMode="numeric"
                                autoComplete="off"
                                className={`w-full px-4 py-3 border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-gray-100 ${cardErrors.cvv ? 'border-red-400 bg-red-50' : 'border-taupe bg-white'}`}
                              />
                              {cardErrors.cvv && <p className="mt-1 text-xs text-red-500">{cardErrors.cvv}</p>}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* COD note */}
                      {paymentMethod === 'cod' && (
                        <div className="mt-2 p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
                          Your order will be confirmed and payment collected upon delivery. Please have the exact amount ready.
                        </div>
                      )}
                    </div>
                  )}

                  {/* action buttons */}
                  <div className="flex gap-4 mt-8">
                    {step === 2 && (
                      <button type="button" onClick={() => setStep(1)} disabled={loading}
                        className="px-6 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-light transition-all disabled:opacity-50">
                        Back
                      </button>
                    )}
                    <button type="submit" disabled={loading}
                      className="flex-1 bg-primary text-light px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                      {loading && (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      )}
                      {submitLabel()}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* ── right: order summary ── */}
            <div className="lg:col-span-1">
              <div className="card-base p-6 sticky top-20">
                <h2 className="font-bold text-xl mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 max-h-64 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex justify-between text-sm">
                      <span className="text-gray-600 truncate pr-2">{item.name} × {item.qty || 1}</span>
                      <span className="font-semibold whitespace-nowrap">
                        Rs. {(Number(item.price) * (item.qty || 1)).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">Rs. {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold">Rs. {shippingPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (10%)</span>
                    <span className="font-semibold">Rs. {tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-2xl text-primary">Rs. {total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
