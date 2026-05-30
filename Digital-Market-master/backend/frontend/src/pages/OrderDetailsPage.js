import React, { useState, useEffect } from 'react';
import { Navbar, Loading } from '../components';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { orderAPI, apiUtils } from '../api/api';

const OrderDetailsPage = ({ match, history }) => {
  const { user, isAuthenticated } = useAuth();
  const orderId = match.params.id;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
                  <div className="w-full bg-yellow-100 text-yellow-700 px-6 py-3 rounded-lg font-semibold text-center">
                    ⏳ Awaiting Payment
                  </div>
                )}

                {order.ispaid && (
                  <div className="w-full bg-green-100 text-green-700 px-6 py-3 rounded-lg font-semibold text-center">
                    ✓ Payment Completed
                  </div>
                )}
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
