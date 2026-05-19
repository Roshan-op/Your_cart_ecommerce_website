import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components';
import {
  Package, ShoppingCart, TrendingUp, BarChart3, LogOut, Plus, Trash2, Edit2,
  AlertCircle, CheckCircle, DollarSign, AlertTriangle, Settings, User, Lock, Mail,
  Upload, Image as ImageIcon, X, ChevronRight
} from 'lucide-react';

const VendorPanelEnhanced = () => {
  const history = useHistory();
  const { user, isAuthenticated, logout, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState({ totalProducts: 0, totalOrders: 0, totalSales: 0, monthSales: 0, outOfStock: 0, lowStock: 0, recentOrders: [] });
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '', price: 0, category: '', brand: '', description: '', countInStock: 0, gender: 'both', available_sizes: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [orderFilter, setOrderFilter] = useState('all');
  const [earnings, setEarnings] = useState({ totalEarnings: 0, monthEarnings: 0, weekEarnings: 0, recentTransactions: [] });
  const [inventory, setInventory] = useState({ totalProducts: 0, totalStock: 0, outOfStock: 0, lowStock: 0, inventory: [] });
  const [profileForm, setProfileForm] = useState({ firstName: '', lastName: '', email: '', newPassword: '', confirmPassword: '' });
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      history.push('/login');
      return;
    }
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated, authLoading, activeTab, orderFilter]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [dashRes, prodRes, ordRes, earnRes, invRes, notifRes] = await Promise.all([
        fetch('http://localhost:8000/api/vendor/dashboard/', { headers }),
        fetch('http://localhost:8000/api/vendor/products/', { headers }),
        fetch(`http://localhost:8000/api/vendor/orders/?status=${orderFilter}`, { headers }),
        fetch('http://localhost:8000/api/vendor/earnings/', { headers }),
        fetch('http://localhost:8000/api/vendor/inventory/', { headers }),
        fetch('http://localhost:8000/api/vendor/notifications/', { headers })
      ]);

      if (dashRes.ok) setStats(await dashRes.json());
      if (prodRes.ok) setProducts((await prodRes.json()).products || []);
      if (ordRes.ok) setOrders((await ordRes.json()).orders || []);
      if (earnRes.ok) setEarnings(await earnRes.json());
      if (invRes.ok) setInventory(await invRes.json());
      if (notifRes.ok) setNotifications((await notifRes.json()).notifications || []);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async () => {
    if (!productForm.name || !productForm.price || !productForm.category) {
      alert('Please fill required fields');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const formData = new FormData();
      formData.append('name', productForm.name);
      formData.append('price', productForm.price);
      formData.append('category', productForm.category);
      formData.append('brand', productForm.brand);
      formData.append('description', productForm.description);
      formData.append('countInStock', productForm.countInStock);
      formData.append('gender', productForm.gender);
      formData.append('available_sizes', productForm.available_sizes);
      if (imageFile) formData.append('image', imageFile);

      const res = await fetch('http://localhost:8000/api/vendor/products/', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (res.ok) {
        alert('Product added successfully!');
        setProductForm({ name: '', price: 0, category: '', brand: '', description: '', countInStock: 0, gender: 'both', available_sizes: '' });
        setImageFile(null);
        setImagePreview(null);
        fetchAllData();
      } else {
        alert('Error adding product');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error adding product');
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;

    try {
      const token = localStorage.getItem('authToken');
      const formData = new FormData();
      formData.append('name', productForm.name);
      formData.append('price', productForm.price);
      formData.append('category', productForm.category);
      formData.append('brand', productForm.brand);
      formData.append('description', productForm.description);
      formData.append('countInStock', productForm.countInStock);
      formData.append('gender', productForm.gender);
      formData.append('available_sizes', productForm.available_sizes);
      if (imageFile) formData.append('image', imageFile);

      const res = await fetch(`http://localhost:8000/api/vendor/products/${editingProduct._id}/`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (res.ok) {
        alert('Product updated successfully!');
        setEditingProduct(null);
        setProductForm({ name: '', price: 0, category: '', brand: '', description: '', countInStock: 0, gender: 'both', available_sizes: '' });
        setImageFile(null);
        setImagePreview(null);
        fetchAllData();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error updating product');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`http://localhost:8000/api/vendor/products/${productId}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setProducts(products.filter(p => p._id !== productId));
        alert('Product deleted!');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleUpdateOrderStatus = async (orderId) => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`http://localhost:8000/api/vendor/orders/${orderId}/status/`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDelivered: true })
      });
      if (res.ok) {
        alert('Order marked as delivered!');
        fetchAllData();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleUpdateProfile = async () => {
    if (profileForm.newPassword !== profileForm.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch('http://localhost:8000/api/vendor/profile/', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm)
      });
      if (res.ok) {
        alert('Profile updated!');
        setProfileForm({ firstName: '', lastName: '', email: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleLogout = () => {
    logout();
    history.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
            <p className="text-gray-600 font-medium">Loading vendor dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <Navbar />

      <div className="flex-grow flex">
        {/* Sidebar */}
        <div className="w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white p-8 shadow-2xl fixed h-full overflow-y-auto">
          <div className="mb-12">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mb-4 text-2xl font-bold shadow-lg">
              V
            </div>
            <h2 className="text-2xl font-bold mb-1">Vendor Hub</h2>
            <p className="text-slate-300 text-sm">Manage your business</p>
          </div>

          <nav className="space-y-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'products', label: 'Products', icon: '📦' },
              { id: 'orders', label: 'Orders', icon: '🛒' },
              { id: 'earnings', label: 'Earnings', icon: '💰' },
              { id: 'inventory', label: 'Inventory', icon: '📋' },
              { id: 'settings', label: 'Settings', icon: '⚙️' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-300 hover:bg-slate-700/50'
                }`}
              >
                <span>{tab.icon}</span> {tab.label}
                {activeTab === tab.id && <ChevronRight size={16} className="ml-auto" />}
              </button>
            ))}
            <hr className="my-4 border-slate-700" />
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 rounded-lg text-slate-300 hover:bg-red-600/20 hover:text-red-400 transition-all flex items-center gap-3"
            >
              <LogOut size={18} /> Logout
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-grow ml-72 p-8 overflow-auto">
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user?.username}!</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Products', value: stats.totalProducts, icon: Package, color: 'blue' },
                  { label: 'Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'green' },
                  { label: 'Total Sales', value: `Rs.${stats.totalSales?.toFixed(0) || 0}`, icon: TrendingUp, color: 'purple' },
                  { label: 'This Month', value: `Rs.${stats.monthSales?.toFixed(0) || 0}`, icon: BarChart3, color: 'orange' }
                ].map((stat, idx) => {
                  const Icon = stat.icon;
                  const colors = {
                    blue: 'bg-blue-50 border-blue-200 text-blue-600',
                    green: 'bg-green-50 border-green-200 text-green-600',
                    purple: 'bg-purple-50 border-purple-200 text-purple-600',
                    orange: 'bg-orange-50 border-orange-200 text-orange-600'
                  };
                  return (
                    <div key={idx} className={`${colors[stat.color]} p-6 rounded-xl border-2 shadow-sm hover:shadow-md transition-all`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-600 text-sm font-semibold mb-1">{stat.label}</p>
                          <p className="text-3xl font-bold">{stat.value}</p>
                        </div>
                        <Icon size={40} className="opacity-20" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Alerts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {stats.outOfStock > 0 && (
                  <div className="bg-red-50 border-2 border-red-200 p-4 rounded-xl flex items-start gap-4">
                    <AlertTriangle size={24} className="text-red-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-red-900">Out of Stock</h3>
                      <p className="text-red-700 text-sm">{stats.outOfStock} products need restocking</p>
                    </div>
                  </div>
                )}
                {stats.lowStock > 0 && (
                  <div className="bg-yellow-50 border-2 border-yellow-200 p-4 rounded-xl flex items-start gap-4">
                    <AlertCircle size={24} className="text-yellow-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-yellow-900">Low Stock</h3>
                      <p className="text-yellow-700 text-sm">{stats.lowStock} products have low inventory</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-xl shadow-md border-2 border-gray-100 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Orders</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b-2 border-gray-200">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Order ID</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentOrders?.slice(0, 5).map(order => (
                        <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-semibold text-gray-900">#{order._id}</td>
                          <td className="py-3 px-4 text-gray-700">{order.user}</td>
                          <td className="py-3 px-4 font-semibold">Rs.{order.totalPrice?.toFixed(2)}</td>
                          <td className="py-3 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              order.isDelivered ? 'bg-green-100 text-green-700' : order.ispaid ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {order.isDelivered ? 'Delivered' : order.ispaid ? 'Paid' : 'Pending'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Products */}
          {activeTab === 'products' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">My Products</h1>
                  <p className="text-gray-600 mt-1">{products.length} products</p>
                </div>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setProductForm({ name: '', price: 0, category: '', brand: '', description: '', countInStock: 0, gender: 'both', available_sizes: '' });
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                >
                  <Plus size={20} /> Add Product
                </button>
              </div>

              {/* Product Form */}
              <div className="bg-white rounded-xl shadow-md border-2 border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Form Fields */}
                  <div className="lg:col-span-2 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name *</label>
                        <input
                          type="text"
                          placeholder="Enter product name"
                          value={productForm.name}
                          onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Price *</label>
                        <input
                          type="number"
                          placeholder="0.00"
                          value={productForm.price}
                          onChange={(e) => setProductForm({...productForm, price: parseFloat(e.target.value)})}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                        <input
                          type="text"
                          placeholder="e.g., Shirts, Shoes"
                          value={productForm.category}
                          onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Brand</label>
                        <input
                          type="text"
                          placeholder="e.g., Nike, Adidas"
                          value={productForm.brand}
                          onChange={(e) => setProductForm({...productForm, brand: e.target.value})}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Stock</label>
                        <input
                          type="number"
                          placeholder="0"
                          value={productForm.countInStock}
                          onChange={(e) => setProductForm({...productForm, countInStock: parseInt(e.target.value)})}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                        <select
                          value={productForm.gender}
                          onChange={(e) => setProductForm({...productForm, gender: e.target.value})}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition"
                        >
                          <option value="both">Both/Unisex</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Available Sizes</label>
                      <input
                        type="text"
                        placeholder="Comma-separated: XS,S,M,L,XL"
                        value={productForm.available_sizes}
                        onChange={(e) => setProductForm({...productForm, available_sizes: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                      <textarea
                        placeholder="Product description"
                        value={productForm.description}
                        onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition h-24 resize-none"
                      />
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div className="lg:col-span-1">
                    <div className="border-4 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition cursor-pointer bg-gray-50">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                        id="image-input"
                      />
                      <label htmlFor="image-input" className="cursor-pointer block">
                        {imagePreview ? (
                          <div>
                            <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-lg mb-3" />
                            <p className="text-sm text-blue-600 font-semibold">Change Image</p>
                          </div>
                        ) : (
                          <div>
                            <Upload size={48} className="mx-auto text-gray-400 mb-3" />
                            <p className="text-gray-700 font-semibold mb-1">Upload Image</p>
                            <p className="text-gray-500 text-sm">PNG, JPG up to 10MB</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                  >
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                  {editingProduct && (
                    <button
                      onClick={() => {
                        setEditingProduct(null);
                        setImagePreview(null);
                        setImageFile(null);
                        setProductForm({ name: '', price: 0, category: '', brand: '', description: '', countInStock: 0, gender: 'both', available_sizes: '' });
                      }}
                      className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition font-semibold"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              {/* Products Grid */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Your Inventory</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map(product => (
                    <div key={product._id} className="bg-white rounded-xl shadow-md border-2 border-gray-100 overflow-hidden hover:shadow-lg transition-all">
                      <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                        {product.image ? (
                          <img src={`http://localhost:8000${product.image}`} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon size={48} className="text-gray-400" />
                        )}
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold text-gray-900 mb-1 line-clamp-2">{product.name}</h4>
                        <p className="text-sm text-gray-600 mb-3">{product.category}</p>
                        <div className="flex justify-between items-center mb-4">
                          <p className="text-2xl font-bold text-blue-600">Rs.{product.price}</p>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            product.countInStock > 5 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            Stock: {product.countInStock}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingProduct(product);
                              setProductForm({
                                name: product.name, price: product.price, category: product.category,
                                brand: product.brand, description: product.description,
                                countInStock: product.countInStock, gender: product.gender,
                                available_sizes: product.available_sizes || ''
                              });
                              setImagePreview(product.image ? `http://localhost:8000${product.image}` : null);
                            }}
                            className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-blue-700 flex items-center justify-center gap-1 transition"
                          >
                            <Edit2 size={16} /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-red-700 flex items-center justify-center gap-1 transition"
                          >
                            <Trash2 size={16} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h1 className="text-4xl font-bold text-gray-900">My Orders</h1>
              
              <div className="flex gap-2 mb-6 flex-wrap">
                {['all', 'pending', 'paid', 'delivered'].map(filter => (
                  <button
                    key={filter}
                    onClick={() => setOrderFilter(filter)}
                    className={`px-4 py-2 rounded-lg capitalize font-semibold transition ${
                      orderFilter === filter ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {orders.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md border-2 border-gray-100 p-12 text-center">
                  <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 text-lg">No orders found for this status</p>
                  <p className="text-gray-400 text-sm mt-2">Orders will appear here when customers place them</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order._id} className="bg-white rounded-xl shadow-md border-2 border-gray-100 p-6 hover:shadow-lg transition">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-gray-600 text-sm font-semibold">Order ID</p>
                          <p className="text-lg font-bold text-gray-900">#{order._id ? String(order._id).substring(0, 8) : 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm font-semibold">Customer</p>
                          <p className="text-lg font-semibold text-gray-900">{order.user}</p>
                          <p className="text-xs text-gray-500">{order.userEmail}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm font-semibold">Amount</p>
                          <p className="text-lg font-bold text-green-600">Rs.{order.totalPrice?.toFixed(2) || 0}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm font-semibold">Order Date</p>
                          <p className="text-lg font-semibold text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="border-t-2 border-gray-100 pt-4 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-gray-600 text-sm font-semibold">Payment Status</p>
                            <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-semibold ${
                              order.ispaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {order.ispaid ? '✓ Paid' : '✗ Not Paid'}
                            </span>
                          </div>
                          <div>
                            <p className="text-gray-600 text-sm font-semibold">Delivery Status</p>
                            <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-semibold ${
                              order.isDelivered ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {order.isDelivered ? '✓ Delivered' : '📦 Processing'}
                            </span>
                          </div>
                          <div>
                            <p className="text-gray-600 text-sm font-semibold">Items</p>
                            <p className="text-lg font-semibold text-gray-900 mt-1">{order.items?.length || 0} item(s)</p>
                          </div>
                        </div>

                        {order.items && order.items.length > 0 && (
                          <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <p className="text-sm font-semibold text-gray-700 mb-2">Order Items:</p>
                            <div className="space-y-2">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                  <span className="text-gray-700">• {item.name} (Qty: {item.qty})</span>
                                  <span className="font-semibold text-gray-900">Rs.{(item.price * item.qty).toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {order.shippingAddress && (
                          <div className="bg-blue-50 rounded-lg p-4 mb-4">
                            <p className="text-sm font-semibold text-gray-700 mb-2">Shipping Address:</p>
                            <p className="text-sm text-gray-700">{order.shippingAddress.address}</p>
                            <p className="text-sm text-gray-700">{order.shippingAddress.city}</p>
                            <p className="text-sm text-gray-700">📱 {order.shippingAddress.PhoneNumber}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-3">
                        {!order.isDelivered && order.ispaid && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order._id)}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition flex items-center gap-2"
                          >
                            <CheckCircle size={18} />
                            Mark as Delivered
                          </button>
                        )}
                        {order.isDelivered && (
                          <div className="text-sm text-green-600 font-semibold flex items-center gap-2">
                            <CheckCircle size={18} />
                            Order Delivered
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Earnings Tab */}
          {activeTab === 'earnings' && (
            <div className="space-y-8">
              <h1 className="text-4xl font-bold text-gray-900">Earnings</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Total Earnings', value: `Rs.${earnings.totalEarnings?.toFixed(0) || 0}`, icon: DollarSign, color: 'blue' },
                  { label: 'This Month', value: `Rs.${earnings.monthEarnings?.toFixed(0) || 0}`, icon: BarChart3, color: 'green' },
                  { label: 'This Week', value: `Rs.${earnings.weekEarnings?.toFixed(0) || 0}`, icon: TrendingUp, color: 'purple' }
                ].map((stat, idx) => {
                  const Icon = stat.icon;
                  const colors = {
                    blue: 'bg-blue-50 border-blue-200 text-blue-600',
                    green: 'bg-green-50 border-green-200 text-green-600',
                    purple: 'bg-purple-50 border-purple-200 text-purple-600'
                  };
                  return (
                    <div key={idx} className={`${colors[stat.color]} p-6 rounded-xl border-2 shadow-sm`}>
                      <p className="text-gray-600 text-sm font-semibold mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                  );
                })}
              </div>

              <div className="bg-white rounded-xl shadow-md border-2 border-gray-100 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Transactions</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b-2 border-gray-200">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Order ID</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {earnings.recentTransactions?.map(trans => (
                        <tr key={trans._id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-semibold">#{trans._id}</td>
                          <td className="py-3 px-4">{trans.user}</td>
                          <td className="py-3 px-4 font-bold text-green-600">Rs.{trans.amount?.toFixed(2)}</td>
                          <td className="py-3 px-4">{new Date(trans.date).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Inventory Tab */}
          {activeTab === 'inventory' && (
            <div className="space-y-8">
              <h1 className="text-4xl font-bold text-gray-900">Inventory</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Products', value: inventory.totalProducts, icon: Package, color: 'blue' },
                  { label: 'Total Stock', value: inventory.totalStock, icon: ShoppingCart, color: 'green' },
                  { label: 'Low Stock', value: inventory.lowStock, icon: AlertCircle, color: 'orange' },
                  { label: 'Out of Stock', value: inventory.outOfStock, icon: AlertTriangle, color: 'red' }
                ].map((stat, idx) => {
                  const Icon = stat.icon;
                  const colors = {
                    blue: 'bg-blue-50 border-blue-200 text-blue-600',
                    green: 'bg-green-50 border-green-200 text-green-600',
                    orange: 'bg-orange-50 border-orange-200 text-orange-600',
                    red: 'bg-red-50 border-red-200 text-red-600'
                  };
                  return (
                    <div key={idx} className={`${colors[stat.color]} p-6 rounded-xl border-2 shadow-sm`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-600 text-sm font-semibold">{stat.label}</p>
                          <p className="text-3xl font-bold mt-2">{stat.value}</p>
                        </div>
                        <Icon size={40} className="opacity-20" />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-white rounded-xl shadow-md border-2 border-gray-100 overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Product</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Category</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Price</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Stock</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.inventory?.map(item => (
                      <tr key={item._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-6 font-semibold">{item.name}</td>
                        <td className="py-4 px-6">{item.category}</td>
                        <td className="py-4 px-6">Rs.{item.price}</td>
                        <td className="py-4 px-6 font-semibold">{item.countInStock}</td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            item.countInStock > 5 ? 'bg-green-100 text-green-700' : 
                            item.countInStock > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {item.countInStock > 5 ? 'In Stock' : item.countInStock > 0 ? 'Low Stock' : 'Out of Stock'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-8">
              <h1 className="text-4xl font-bold text-gray-900">Settings</h1>
              
              <div className="bg-white rounded-xl shadow-md border-2 border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Update Profile</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      placeholder="First Name"
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="Email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <hr className="my-8 border-gray-200" />

                <h3 className="text-xl font-bold text-gray-900 mb-6">Change Password</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                    <input
                      type="password"
                      placeholder="New Password"
                      value={profileForm.newPassword}
                      onChange={(e) => setProfileForm({...profileForm, newPassword: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      value={profileForm.confirmPassword}
                      onChange={(e) => setProfileForm({...profileForm, confirmPassword: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <button
                  onClick={handleUpdateProfile}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorPanelEnhanced;
