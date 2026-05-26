import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { Navbar, Button } from '../components';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { apiUtils } from '../api/api';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-light flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-20">
          <div className="text-center">
            <h1 className="font-serif text-4xl font-bold text-primary mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">Add some items to get started!</p>
            <Link to="/shop">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light flex flex-col">
      <Navbar />

      <main className="flex-grow py-12">
        <div className="container-custom">
          {/* Back Link */}
          <Link to="/shop" className="flex items-center gap-2 text-accent hover:text-secondary mb-8 transition-colors">
            <ArrowLeft size={20} />
            Continue Shopping
          </Link>

          <h1 className="font-serif text-4xl font-bold text-primary mb-12">Shopping Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="card-base p-6 flex gap-6 hover:shadow-lg transition-shadow"
                  >
                    {/* Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={apiUtils.getImageUrl(item.image)}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-grow">
                      <Link
                        to={`/product/${item._id}`}
                        className="font-serif text-lg font-bold text-primary hover:text-accent transition-colors"
                      >
                        {item.name}
                      </Link>
                      <p className="text-gray-600 text-sm mt-1">{item.category}</p>
                      <p className="text-2xl font-bold text-accent mt-2">Rs. {item.price}</p>
                      {item.selectedSize && <p className="text-sm text-gray-600 mt-2">Size: <strong>{item.selectedSize}</strong></p>}
                      {item.selectedGender && <p className="text-sm text-gray-600">Gender: <strong>{item.selectedGender}</strong></p>}
                      {item.selectedColor && <p className="text-sm text-gray-600">Color: <strong>{item.selectedColor}</strong></p>}
                    </div>

                    {/* Quantity & Actions */}
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>

                      <div className="flex items-center border border-primary rounded-lg">
                        <button
                          onClick={() => updateQuantity(item._id, (item.qty || 1) - 1)}
                          className="p-2 hover:bg-beige transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4 font-semibold">{item.qty || 1}</span>
                        <button
                          onClick={() => updateQuantity(item._id, (item.qty || 1) + 1)}
                          className="p-2 hover:bg-beige transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <p className="font-bold text-primary">
                        Rs. {(item.price * (item.qty || 1)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="card-base p-6 sticky top-20">
                <h2 className="font-bold text-xl mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">Rs. {getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-semibold">Rs. {(getTotalPrice() * 0.13).toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between mb-8">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-2xl text-primary">
                    Rs. {(getTotalPrice() * 1.13).toFixed(2)}
                  </span>
                </div>

                <Link to="/checkout">
                  <Button variant="primary" size="lg" className="w-full">
                    Proceed to Checkout
                  </Button>
                </Link>

                <button className="w-full mt-4 text-primary font-semibold hover:text-accent transition-colors">
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;
