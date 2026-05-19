import React, { useState, useEffect } from 'react';
import { Navbar, Loading } from '../components';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { orderAPI, apiUtils } from '../api/api';
import KhaltiCheckout from 'khalti-checkout-web';

const OrderDetailsPage = ({ match, history }) => {
  const { user, isAuthenticated } = useAuth();
  const orderId = match.params.id;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingPay, setLoadingPay] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await orderAPI.getOrder(orderId);
        setOrder(data);
      } catch (err) {
        setError(err.message || 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };

    if (!isAuthenticated) {
      history.push('/login');
      return;
    }

    fetchOrder();
  }, [orderId, isAuthenticated, history]);

  // Initialize Khalti Checkout
  const initializeKhaltiPayment = () => {
    if (!order) return;

    const config = {
      publicKey: 'test_public_key_37cb6b253b0f4ae5824d4d48bca676e3',
      productIdentity: String(order._id),
      productName: order.orderItems[0]?.name || 'Order Payment',
      productUrl: `http://localhost:3000/order/${order._id}`,
      amount: Math.ceil(order.totalPrice * 100), // Khalti expects amount in paisa (1 Rs = 100 paisa)
      eventHandler: {
        onSuccess(payload) {
          handlePaymentSuccess(payload);
        },
        onError(error) {
          console.error('Payment error:', error);
          setError('Payment failed: ' + error.message);
        },
        onClose() {
          console.log('Payment widget closed');
        },
      },
      paymentPreference: [
        'KHALTI',
        'EBANKING',
        'MOBILE_BANKING',
        'CONNECT_IPS',
        'SCT',
      ],
    };

    const checkout = new KhaltiCheckout(config);
    checkout.show({ amount: Math.ceil(order.totalPrice * 100) });
  };

  // Handle successful payment
  const handlePaymentSuccess = async (payload) => {
    try {
      setLoadingPay(true);
      setError(null);

      // Verify payment on backend
      await orderAPI.markAsPaid(orderId);

      // Show success state
      setPaymentSuccess(true);
      
      // Refresh order details
      const updatedOrder = await orderAPI.getOrder(orderId);
      setOrder(updatedOrder);
    } catch (err) {
      setError('Payment verification failed: ' + err.message);
    } finally {
      setLoadingPay(false);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-light flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <Loading />
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-light flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error || 'Order not found'}</p>
            <button
              onClick={() => history.push('/shop')}
              className="bg-primary text-light px-6 py-3 rounded-lg hover:shadow-lg transition-all"
            >
              Continue Shopping
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const subtotal = order.orderItems.reduce((acc, item) => acc + (parseFloat(item.price) * item.qty), 0);
  const tax = Number(order.taxPrice) || subtotal * 0.1;
  const shipping = Number(order.shippingPrice) || 10;
  const total = Number(order.totalPrice) || (subtotal + tax + shipping);

  return (
    <div className="min-h-screen bg-light flex flex-col">
      {/* Payment Success Overlay */}
      {paymentSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 text-center animate-fadeIn">
            {/* Success Checkmark */}
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-primary mb-3">Payment Successful!</h2>
            <p className="text-gray-600 mb-2">Your order has been confirmed</p>
            <p className="text-sm text-gray-500 mb-6">Order ID: #{order._id}</p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
              <p className="text-green-700 font-semibold mb-2">✓ Payment Received</p>
              <p className="text-green-600 text-sm">
                Thank you for your purchase. A confirmation email has been sent to {order.user?.email}
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => history.push('/')}
                className="w-full bg-primary text-light px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => setPaymentSuccess(false)}
                className="w-full bg-gray-100 text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all"
              >
                View Order Details
              </button>
            </div>
          </div>
        </div>
      )}

      <Navbar />

      <main className="flex-grow py-12">
        <div className="container-custom">
          <div className="mb-8">
            <button
              onClick={() => history.goBack()}
              className="text-primary hover:underline flex items-center gap-2"
            >
              ← Back
            </button>
          </div>

          <h1 className="font-serif text-4xl font-bold text-primary mb-8">
            Order #{order._id}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <div className="card-base p-6">
                <h2 className="font-bold text-xl mb-4">Shipping Address</h2>
                {order.shippingAddress ? (
                  <div className="space-y-2 text-gray-700">
                    <p>{order.shippingAddress.address}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                    <p>{order.shippingAddress.country}</p>
                    <p>Phone: {order.shippingAddress.PhoneNumber}</p>
                  </div>
                ) : (
                  <p className="text-gray-500">No shipping address</p>
                )}
              </div>

              {/* Order Items */}
              <div className="card-base p-6">
                <h2 className="font-bold text-xl mb-4">Order Items</h2>
                <div className="space-y-4">
                  {order.orderItems && order.orderItems.length > 0 ? (
                    order.orderItems.map((item) => (
                      <div key={item._id} className="flex gap-4 py-4 border-b last:border-b-0">
                        <img
                          src={apiUtils.getImageUrl(item.image)}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-grow">
                          <h3 className="font-semibold text-primary">{item.name}</h3>
                          <p className="text-sm text-gray-600">Qty: {item.qty}</p>
                          <p className="font-semibold mt-2">Rs. {(item.price * item.qty).toFixed(2)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No items in order</p>
                  )}
                </div>
              </div>

              {/* Payment Status */}
              <div className="card-base p-6">
                <h2 className="font-bold text-xl mb-4">Payment Status</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: order.ispaid ? '#d4edda' : '#f8d7da' }}>
                    <span className="font-semibold">Status:</span>
                    <span className={order.ispaid ? 'text-green-700' : 'text-red-700'}>
                      {order.ispaid ? 'PAID' : 'PENDING PAYMENT'}
                    </span>
                  </div>
                  {error && (
                    <div className="p-3 bg-red-100 text-red-700 rounded-lg">
                      {error}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card-base p-6 sticky top-24">
                <h2 className="font-bold text-xl mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6 pb-6 border-b">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span>Rs. {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping:</span>
                    <span>Rs. {shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (10%):</span>
                    <span>Rs. {tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="font-bold text-lg">Total:</span>
                  <span className="font-bold text-2xl text-primary">Rs. {total.toFixed(2)}</span>
                </div>

                {!order.ispaid && (
                  <button
                    onClick={initializeKhaltiPayment}
                    disabled={loadingPay}
                    className="w-full bg-primary text-light px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {loadingPay ? 'Processing...' : 'Pay with Khalti'}
                  </button>
                )}

                {order.ispaid && (
                  <div className="w-full bg-green-100 text-green-700 px-6 py-3 rounded-lg font-semibold text-center">
                    ✓ Payment Completed
                  </div>
                )}

                {/* Payment Methods Info */}
                <div className="mt-6 pt-6 border-t text-sm text-gray-600 space-y-2">
                  <p className="font-semibold text-primary">Payment Methods:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Khalti</li>
                    <li>E-Banking</li>
                    <li>Mobile Banking</li>
                    <li>Connect IPS</li>
                    <li>SCT</li>
                  </ul>
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

export default OrderDetailsPage;
