import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { Navbar } from '../components';
import Footer from '../components/Footer';
import { ShoppingBag, MapPin, LogOut, Edit2, Heart, Trash2 } from 'lucide-react';

const CustomerPanel = ({ history }) => {
  const { user, isAuthenticated, logout, updateProfile } = useAuth();
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  // Check customer access and fetch orders on mount
  useEffect(() => {
    if (!isAuthenticated) {
      history.push('/login');
      return;
    }

    // Load user data
    if (user) {
      const firstNamePart = user.name?.split(' ')[0] || '';
      const lastNamePart = user.name?.split(' ').slice(1).join(' ') || '';
      
      setFormData({
        firstName: firstNamePart,
        lastName: lastNamePart,
        email: user.email || '',
        phone: user.phone || '',
      });
      
      // Fetch orders immediately
      fetchOrdersData();
    }
    
    setLoading(false);
  }, [isAuthenticated, user, history]);

  const fetchOrdersData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No auth token found');
        return;
      }
      
      const res = await fetch('http://localhost:8000/api/orders/myorders/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        const ordersData = await res.json();
        console.log('Orders fetched:', ordersData);
        setOrders(Array.isArray(ordersData) ? ordersData : []);
      } else {
        console.error('Failed to fetch orders:', res.status, res.statusText);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchOrders = () => {
    fetchOrdersData();
  };

  // Refresh orders when tab changes to orders or component mounts
  useEffect(() => {
    if (activeTab === 'orders' && isAuthenticated) {
      fetchOrders();
    }
  }, [activeTab, isAuthenticated]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      await updateProfile(fullName, formData.email);
      setEditMode(false);
      alert('Profile updated successfully!');
    } catch (err) {
      alert('Error updating profile: ' + err.message);
    }
  };

  const handleLogout = () => {
    logout();
    history.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-light flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
            <p className="text-green-600 font-semibold">Loading your account...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <div className="grid grid-cols-4 bg-white border-b">
          {/* Sidebar */}
          <div className="col-span-1 bg-gradient-to-b from-green-600 to-green-800 text-white p-8 min-h-screen">
            <div className="mb-12 animate-fadeIn">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 text-2xl font-bold text-green-600 shadow-lg">
                {(user?.username || 'U')[0].toUpperCase()}
              </div>
              <h2 className="text-2xl font-bold mb-2">My Account</h2>
              <p className="text-green-100">{user?.username || 'Customer'}</p>
              <p className="text-xs text-green-200 mt-2">ID: {user?.id}</p>
            </div>

            <nav className="space-y-3">
              {[
                { id: 'profile', label: 'Profile', icon: '👤' },
                { id: 'orders', label: 'Orders', icon: '📦' },
                { id: 'addresses', label: 'Addresses', icon: '📍' },
                { id: 'wishlist', label: 'Wishlist', icon: '❤️' },
                { id: 'settings', label: 'Settings', icon: '⚙️' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all transform ${
                    activeTab === tab.id
                      ? 'bg-white text-green-600 shadow-lg scale-105'
                      : 'hover:bg-white hover:bg-opacity-10 text-white'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span> {tab.label}
                </button>
              ))}
              <hr className="my-4 border-green-400" />
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-red-500 transition-all transform hover:scale-105 text-white"
              >
                <LogOut size={18} className="inline mr-2" /> Logout
              </button>
            </nav>
          </div>

          {/* Content Area */}
          <div className="col-span-3 p-12 bg-gray-50">
            {activeTab === 'profile' && (
              <div className="animate-fadeIn">
                <div className="flex justify-between items-center mb-8">
                  <h1 className="text-4xl font-bold text-primary">My Profile</h1>
                  <button
                    onClick={() => setEditMode(!editMode)}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all flex items-center gap-2"
                  >
                    <Edit2 size={18} /> {editMode ? 'Cancel' : 'Edit Profile'}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  {/* Profile Form */}
                  <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all">
                    <h2 className="text-xl font-bold text-primary mb-6">Personal Information</h2>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            className={`w-full px-4 py-2 border border-gray-300 rounded-lg transition-all ${
                              editMode ? 'bg-white' : 'bg-gray-100'
                            }`}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            className={`w-full px-4 py-2 border border-gray-300 rounded-lg transition-all ${
                              editMode ? 'bg-white' : 'bg-gray-100'
                            }`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          className={`w-full px-4 py-2 border border-gray-300 rounded-lg transition-all ${
                            editMode ? 'bg-white' : 'bg-gray-100'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          className={`w-full px-4 py-2 border border-gray-300 rounded-lg transition-all ${
                            editMode ? 'bg-white' : 'bg-gray-100'
                          }`}
                        />
                      </div>

                      {editMode && (
                        <button
                          onClick={handleSaveProfile}
                          className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all mt-4 font-semibold"
                        >
                          Save Changes
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Account Info */}
                  <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all">
                    <h2 className="text-xl font-bold text-primary mb-6">Account Information</h2>
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm text-gray-600">Customer ID</p>
                        <p className="text-lg font-semibold text-primary mt-1">{user?.id}</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm text-gray-600">Username</p>
                        <p className="text-lg font-semibold text-primary mt-1">{user?.username}</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm text-gray-600">Account Status</p>
                        <p className="text-lg font-semibold text-green-500 mt-1">✓ Active</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm text-gray-600">Total Orders</p>
                        <p className="text-lg font-semibold text-primary mt-1">{orders.length}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="animate-fadeIn">
                <h1 className="text-4xl font-bold text-primary mb-8">My Orders ({orders.length})</h1>
                
                {orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order._id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transform hover:scale-102 transition-all">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <p className="text-sm text-gray-600 font-mono">Order ID: {order._id}</p>
                            <h3 className="text-lg font-bold text-primary mt-1">Total: Rs. {Number(order.totalPrice).toFixed(2)}</h3>
                            <p className="text-sm text-gray-600 mt-2">
                              Status: <span className={order.ispaid ? 'text-green-500 font-semibold' : 'text-orange-500 font-semibold'}>
                                {order.ispaid ? '✓ Paid' : '⏳ Pending'}
                              </span>
                              {order.isDelivered && <span className="ml-3 text-green-500 font-semibold">✓ Delivered</span>}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Ordered on: {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {/* Vendors Section */}
                        {order.vendors && order.vendors.length > 0 && (
                          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm font-semibold text-blue-900 mb-2">Vendors:</p>
                            <div className="flex flex-wrap gap-2">
                              {order.vendors.map((vendor, idx) => (
                                <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                                  📦 {vendor}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Items Section */}
                        {order.items && order.items.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm font-semibold text-gray-700 mb-4">📦 Ordered Products:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow hover:shadow-lg transition-all transform hover:scale-105">
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
                                        <ShoppingBag size={32} className="mx-auto mb-2" />
                                        <p className="text-xs">No Image</p>
                                      </div>
                                    )}
                                  </div>

                                  {/* Product Info */}
                                  <div className="p-4">
                                    <p className="font-bold text-primary line-clamp-2 mb-2">{item.name}</p>
                                    <div className="space-y-2 mb-3">
                                      <p className="text-sm text-gray-600">
                                        <span className="font-semibold">Quantity:</span> {item.qty}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        <span className="font-semibold">Price:</span> Rs. {Number(item.price).toFixed(2)}
                                      </p>
                                      <p className="text-lg font-bold text-accent">
                                        Subtotal: Rs. {(item.qty * Number(item.price)).toFixed(2)}
                                      </p>
                                    </div>
                                    {item.vendorName && (
                                      <p className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded inline-block font-semibold">
                                        📦 {item.vendorName}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Order Summary */}
                            <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                              <div className="grid grid-cols-3 gap-4">
                                <div className="text-center">
                                  <p className="text-sm text-gray-600">Total Items</p>
                                  <p className="text-2xl font-bold text-primary mt-1">
                                    {order.items.reduce((sum, item) => sum + item.qty, 0)}
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
                          </div>
                        )}

                        {/* Shipping Address */}
                        {order.shippingAddress && (
                          <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                            <p className="text-sm font-semibold text-green-900 mb-2">📍 Shipping Address:</p>
                            <div className="text-sm text-green-900">
                              <p>{order.shippingAddress.address}</p>
                              <p>{order.shippingAddress.city}</p>
                              <p>Phone: {order.shippingAddress.PhoneNumber}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white p-12 rounded-xl shadow-md text-center">
                    <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-600 mb-4 font-semibold">No orders yet</p>
                    <a href="/shop" className="text-green-600 hover:underline font-semibold">Start shopping →</a>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="animate-fadeIn">
                <div className="flex justify-between items-center mb-8">
                  <h1 className="text-4xl font-bold text-primary">Saved Addresses</h1>
                  <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all">
                    + Add Address
                  </button>
                </div>
                <div className="bg-white p-12 rounded-xl shadow-md text-center">
                  <MapPin size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-600">No addresses saved yet</p>
                </div>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="animate-fadeIn">
                <h1 className="text-4xl font-bold text-primary mb-8">My Wishlist</h1>
                {wishlistItems.length === 0 ? (
                  <div className="bg-white p-12 rounded-xl shadow-md text-center">
                    <Heart size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-600 mb-6">Your wishlist is empty</p>
                    <Link to="/shop" className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all">
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistItems.map((item) => (
                      <div key={item._id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden">
                        {/* Product Image */}
                        <Link to={`/product/${item._id}`} className="block overflow-hidden h-48 bg-gray-100">
                          <img
                            src={item.image && item.image.includes('http') ? item.image : `http://localhost:8000${item.image || '/media/placeholder.jpg'}`}
                            alt={item.name}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          />
                        </Link>

                        {/* Product Info */}
                        <div className="p-4">
                          <Link to={`/product/${item._id}`} className="block">
                            <h3 className="font-bold text-primary hover:text-accent line-clamp-2 mb-2">
                              {item.name}
                            </h3>
                          </Link>
                          
                          <p className="text-gray-600 text-sm mb-2">{item.category}</p>
                          
                          <div className="flex items-center justify-between mb-4">
                            <p className="text-2xl font-bold text-accent">Rs. {item.price}</p>
                            <div className="flex items-center gap-1 text-yellow-400">
                              <span className="text-sm font-semibold">{item.rating || 0}</span>
                              <span className="text-xs">★</span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <Link
                              to={`/product/${item._id}`}
                              className="flex-1 bg-primary text-white px-3 py-2 rounded-lg hover:shadow-lg transition-all text-center text-sm font-semibold"
                            >
                              View
                            </Link>
                            <button
                              onClick={() => removeFromWishlist(item._id)}
                              className="px-3 py-2 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                              title="Remove from wishlist"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="animate-fadeIn">
                <h1 className="text-4xl font-bold text-primary mb-8">Account Settings</h1>
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
                    <h3 className="text-lg font-bold text-primary mb-4">Password</h3>
                    <button className="bg-primary text-white px-6 py-2 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all">
                      Change Password
                    </button>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
                    <h3 className="text-lg font-bold text-primary mb-4">Notifications</h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                        <span>Email notifications</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                        <span>Order updates</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                        <input type="checkbox" className="w-4 h-4" />
                        <span>Promotional emails</span>
                      </label>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-md border border-red-200 hover:shadow-lg transition-all">
                    <h3 className="text-lg font-bold text-red-600 mb-4">Danger Zone</h3>
                    <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CustomerPanel;
