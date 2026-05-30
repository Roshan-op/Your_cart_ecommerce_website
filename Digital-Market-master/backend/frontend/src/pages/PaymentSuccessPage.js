import React, { useState, useEffect } from 'react';
import { Navbar } from '../components';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../api/api';

const PaymentSuccessPage = ({ match, history }) => {
  const { isAuthenticated } = useAuth();
  const orderId = match.params.id;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

    if (orderId) {
      fetchOrder();
    }
  }, [orderId, isAuthenticated, history]);

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
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Processing your payment...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light flex flex-col">
      <Navbar />

      <main className="flex-grow py-12">
        <div className="container-custom">
          {/* Success Message */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-8 text-center">
              <div className="text-6xl text-green-500 mb-4">✓</div>
              <h1 className="font-serif text-4xl font-bold text-green-700 mb-2">Payment Successful!</h1>
              <p className="text-gray-600 text-lg">
                Thank you for your purchase. Your order has been confirmed.
              </p>
            </div>
          </div>

          {/* Order Details */}
          {order && (
            <div className="max-w-2xl mx-auto">
              <div className="card-base p-8">
                <h2 className="font-bold text-2xl mb-6 text-primary">Order Details</h2>

                {/* Order Info */}
                <div className="grid grid-cols-2 gap-6 mb-8 pb-8 border-b border-gray-200">
                  <div>
                    <p className="text-gray-600 text-sm">Order Number</p>
                    <p className="font-bold text-lg text-primary">#{order._id}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Payment Status</p>
                    <p className="font-bold text-lg text-green-600">✓ Paid</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Order Date</p>
                    <p className="font-bold text-lg">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Delivery Status</p>
                    <p className="font-bold text-lg text-blue-600">
                      {order.isDelivered ? '✓ Delivered' : '📦 In Transit'}
                    </p>
                  </div>
                </div>

                {/* Items */}
                <div className="mb-8 pb-8 border-b border-gray-200">
                  <h3 className="font-bold text-lg mb-4">📦 Order Items</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {order.orderItems && order.orderItems.length > 0 ? (
                      order.orderItems.map((item, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow hover:shadow-lg transition-all">
                          {/* Product Image */}
                          <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                            {item.image ? (
                              <img
                                src={item.image.includes('http') ? item.image : `http://localhost:8000${item.image}`}
                                alt={item.name}
                                className="w-full h-full object-cover hover:scale-110 transition-transform"
                              />
                            ) : (
                              <div className="text-gray-400 text-center">
                                <p className="text-2xl mb-2">📦</p>
                                <p className="text-xs">No Image</p>
                              </div>
                            )}
                          </div>

                          {/* Product Info */}
                          <div className="p-4">
                            <p className="font-bold text-primary line-clamp-2 mb-2">{item.name}</p>
                            <div className="space-y-2">
                              <p className="text-sm text-gray-600">
                                <span className="font-semibold">Quantity:</span> {item.qty}
                              </p>
                              <p className="text-sm text-gray-600">
                                <span className="font-semibold">Price:</span> Rs. {Number(item.price).toFixed(2)}
                              </p>
                              <p className="text-lg font-bold text-accent">
                                Rs. {(Number(item.price) * item.qty).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No items in this order</p>
                    )}
                  </div>

                  {/* Order Summary */}
                  {order.orderItems && order.orderItems.length > 0 && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Total Items</p>
                          <p className="text-2xl font-bold text-primary mt-1">
                            {order.orderItems.reduce((sum, item) => sum + item.qty, 0)}
                          </p>
                        </div>
                        <div className="text-center border-l border-r border-gray-300">
                          <p className="text-sm text-gray-600">Shipping</p>
                          <p className="text-2xl font-bold text-accent mt-1">
                            Rs. {Number(order.shippingPrice || 0).toFixed(2)}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Total Order</p>
                          <p className="text-2xl font-bold text-green-600 mt-1">
                            Rs. {Number(order.totalPrice).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Shipping Address */}
                {order.shippingAddress && (
                  <div className="mb-8 pb-8 border-b border-gray-200">
                    <h3 className="font-bold text-lg mb-4">Shipping Address</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-semibold">{order.shippingAddress.address}</p>
                      <p className="text-gray-600">{order.shippingAddress.city}</p>
                      <p className="text-gray-600">Phone: {order.shippingAddress.PhoneNumber}</p>
                    </div>
                  </div>
                )}

                {/* Price Summary */}
                <div className="space-y-3 mb-8">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>Rs. {(Number(order.totalPrice) - Number(order.shippingPrice) - Number(order.taxPrice || 0)).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>Rs. {Number(order.shippingPrice || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>Rs. {Number(order.taxPrice || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-primary pt-4 border-t border-gray-200">
                    <span>Total Amount Paid</span>
                    <span className="text-2xl">Rs. {Number(order.totalPrice).toFixed(2)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 flex-wrap">
                  <button
                    onClick={() => (history ? history.push(`/order/${orderId}`) : window.location.href = `/order/${orderId}`)}
                    className="flex-1 min-w-fit bg-primary text-light px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    View Order Details
                  </button>
                  <button
                    onClick={() => (history ? history.push('/account') : window.location.href = '/account')}
                    className="flex-1 min-w-fit bg-blue-600 text-light px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    📊 My Dashboard
                  </button>
                  <button
                    onClick={() => (history ? history.push('/shop') : window.location.href = '/shop')}
                    className="flex-1 min-w-fit border-2 border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary hover:text-light transition-all"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>

              {/* Info Box */}
              <div className="mt-8 bg-blue-50 border border-blue-300 rounded-lg p-6">
                <h3 className="font-bold text-blue-900 mb-2">✨ What's Next?</h3>
                <ul className="text-blue-800 space-y-2 text-sm">
                  <li>✓ A confirmation email has been sent to your email address</li>
                  <li>✓ Your order is being prepared for shipment</li>
                  <li>✓ You will receive tracking information via email once it's dispatched</li>
                  <li>✓ View all your orders and products in your <strong>Dashboard</strong></li>
                  <li>✓ Track your order status anytime in your account</li>
                </ul>
              </div>
            </div>
          )}

          {error && (
            <div className="max-w-2xl mx-auto mt-8">
              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 text-center">
                <p className="text-red-700 font-semibold">{error}</p>
                <button
                  onClick={() => (history ? history.push('/') : window.location.href = '/')}
                  className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700"
                >
                  Return to Home
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentSuccessPage;
