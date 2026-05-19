import React, { useState } from 'react';
import KhaltiCheckout from "khalti-checkout-web";
import { Navbar } from '../components';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CheckoutPage = ({ history }) => {
  const { cartItems, getTotalPrice, createOrder, loading: cartLoading } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('khalti');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      alert('Please login first');
      if (history) history.push('/login');
      else window.location.href = '/login';
    }
  }, [isAuthenticated, history]);

  // Redirect if cart is empty
  React.useEffect(() => {
    if (cartItems.length === 0 && !cartLoading) {
      if (history) history.push('/cart');
      else window.location.href = '/cart';
    }
  }, [cartItems, cartLoading, history]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (step === 1) {
      // Validate shipping form
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || 
          !formData.address || !formData.city || !formData.postalCode || !formData.country) {
        setError('Please fill in all required fields');
        return;
      }
      setStep(2);
    } else {
      // Submit order and handle payment
      try {
        setLoading(true);

        // Prepare shipping address
        const shippingAddress = {
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
          PhoneNumber: formData.phone,
        };

        // Create order
        const order = await createOrder(shippingAddress, paymentMethod);

        // Handle payment based on method
        if (paymentMethod === 'khalti') {
          // Initialize Khalti payment
          const khaltiConfig = {
            publicKey: "test_public_key_37cb6b253b0f4ae5824d4d48bca676e3",
            productIdentity: order._id,
            productName: "Digital Market Order #" + order._id,
            productUrl: `http://localhost:3000/order/${order._id}`,
            amount: Math.round((subtotal + shippingPrice + tax) * 100), // Amount in paisa
            eventHandler: {
              onSuccess: async (payload) => {
                try {
                  // Verify payment with backend
                  const token = localStorage.getItem('authToken');
                  const verifyResponse = await fetch('http://127.0.0.1:8000/api/orders/verify-khalti/', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                      orderId: order._id,
                      khaltiToken: payload.token,
                      khaltiAmount: payload.amount,
                    }),
                  });

                  const responseData = await verifyResponse.json();
                  
                  if (verifyResponse.ok) {
                    // Payment verified successfully
                    setLoading(false);
                    if (history) history.push(`/order/${order._id}?payment=success`);
                    else window.location.href = `/order/${order._id}?payment=success`;
                  } else {
                    throw new Error(responseData.error || 'Payment verification failed');
                  }
                } catch (verifyError) {
                  console.error('Khalti verification error:', verifyError);
                  setError('Payment verification failed: ' + verifyError.message);
                  setLoading(false);
                }
              },
              onError: (error) => {
                console.error('Khalti payment error:', error);
                setError('Payment failed: ' + (error.message || 'Unknown error'));
                setLoading(false);
              },
              onClose: () => {
                console.log("Khalti widget closed");
                setLoading(false);
              },
            },
            paymentPreference: [
              "KHALTI",
              "EBANKING",
              "MOBILE_BANKING",
              "CONNECT_IPS",
              "SCT",
            ],
          };

          // Initialize and show Khalti checkout
          const checkout = new KhaltiCheckout(khaltiConfig);
          checkout.show();
        } else if (paymentMethod === 'cod') {
          // Cash on Delivery - go directly to order confirmation
          setLoading(false);
          if (history) history.push(`/order/${order._id}`);
          else window.location.href = `/order/${order._id}`;
        } else {
          // Other payment methods
          setLoading(false);
          if (history) history.push(`/order/${order._id}`);
          else window.location.href = `/order/${order._id}`;
        }
      } catch (err) {
        setError(err.message || 'Failed to place order');
        setLoading(false);
      }
    }
  };

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.1;
  const shippingPrice = 10;
  const total = subtotal + tax + shippingPrice;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-light flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <p>Redirecting to login...</p>
        </main>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-light flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <p>Your cart is empty. Redirecting...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light flex flex-col">
      <Navbar />

      <main className="flex-grow py-12">
        <div className="container-custom">
          <h1 className="font-serif text-4xl font-bold text-primary mb-12">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <div className="card-base p-8">
                {/* Steps */}
                <div className="flex gap-8 mb-12">
                  {[1, 2].map((s) => (
                    <div key={s} className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          step >= s ? 'bg-primary text-light' : 'bg-beige text-primary'
                        }`}
                      >
                        {s}
                      </div>
                      <span className={step >= s ? 'text-primary font-semibold' : 'text-gray-600'}>
                        {s === 1 ? 'Shipping' : 'Payment'}
                      </span>
                    </div>
                  ))}
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {step === 1 ? (
                    <div>
                      <h2 className="font-bold text-2xl mb-6">Shipping Address</h2>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <input
                          type="text"
                          name="firstName"
                          placeholder="First Name"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          disabled={loading}
                          className="col-span-1 px-4 py-3 border border-taupe rounded-lg focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-gray-100"
                        />
                        <input
                          type="text"
                          name="lastName"
                          placeholder="Last Name"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          disabled={loading}
                          className="col-span-1 px-4 py-3 border border-taupe rounded-lg focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-gray-100"
                        />
                      </div>

                      <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                        className="w-full px-4 py-3 border border-taupe rounded-lg focus:outline-none focus:ring-2 focus:ring-accent mb-4 disabled:bg-gray-100"
                      />

                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                        className="w-full px-4 py-3 border border-taupe rounded-lg focus:outline-none focus:ring-2 focus:ring-accent mb-4 disabled:bg-gray-100"
                      />

                      <input
                        type="text"
                        name="address"
                        placeholder="Street Address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                        className="w-full px-4 py-3 border border-taupe rounded-lg focus:outline-none focus:ring-2 focus:ring-accent mb-4 disabled:bg-gray-100"
                      />

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <input
                          type="text"
                          name="city"
                          placeholder="City"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          disabled={loading}
                          className="px-4 py-3 border border-taupe rounded-lg focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-gray-100"
                        />
                        <input
                          type="text"
                          name="postalCode"
                          placeholder="Postal Code"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          required
                          disabled={loading}
                          className="px-4 py-3 border border-taupe rounded-lg focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-gray-100"
                        />
                      </div>

                      <input
                        type="text"
                        name="country"
                        placeholder="Country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                        className="w-full px-4 py-3 border border-taupe rounded-lg focus:outline-none focus:ring-2 focus:ring-accent mb-8 disabled:bg-gray-100"
                      />
                    </div>
                  ) : (
                    <div>
                      <h2 className="font-bold text-2xl mb-6">Payment Method</h2>

                      <div className="space-y-4">
                        {[
                          { id: 'khalti', name: 'Khalti', icon: '🏦' },
                          { id: 'esewa', name: 'eSewa', icon: '💳' },
                          { id: 'cod', name: 'Cash on Delivery', icon: '🚚' },
                        ].map((method) => (
                          <label key={method.id} className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-accent transition-colors">
                            <input
                              type="radio"
                              name="payment"
                              value={method.id}
                              checked={paymentMethod === method.id}
                              onChange={(e) => setPaymentMethod(e.target.value)}
                              disabled={loading}
                              className="w-4 h-4 text-accent"
                            />
                            <span className="ml-4 text-2xl">{method.icon}</span>
                            <span className="ml-4 font-semibold text-primary">{method.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4 mt-8">
                    {step === 2 && (
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        disabled={loading}
                        className="px-6 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-light transition-all disabled:opacity-50"
                      >
                        Back
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-primary text-light px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      {loading ? 'Processing...' : (step === 1 ? 'Continue to Payment' : 'Place Order')}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card-base p-6 sticky top-20">
                <h2 className="font-bold text-xl mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 max-h-64 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.name} x {item.qty || 1}
                      </span>
                      <span className="font-semibold">Rs. {(item.price * (item.qty || 1)).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
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
