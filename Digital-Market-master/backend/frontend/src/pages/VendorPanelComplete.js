import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Navbar } from '../components';
import Footer from '../components/Footer';
import {
  Package,
  ShoppingCart,
  TrendingUp,
  BarChart3,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  Eye,
  Download,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  AlertTriangle,
  Bell,
  Settings,
  User,
  Lock,
  Mail
} from 'lucide-react';

const VendorPanelNew = ({ history }) => {
  const { user, isAuthenticated, logout, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  
  // Dashboard stats
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0,
    monthSales: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    outOfStock: 0,
    lowStock: 0,
    recentOrders: []
  });
  
  // Products
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: 0,
    category: '',
    brand: '',
    description: '',
    countInStock: 0,
    gender: 'both',
    available_sizes: ''
  });
  
  // Orders
  const [orders, setOrders] = useState([]);
  const [orderFilter, setOrderFilter] = useState('all');
  
  // Earnings
  const [earnings, setEarnings] = useState({
    totalEarnings: 0,
    monthEarnings: 0,
    weekEarnings: 0,
    dailyEarnings: [],
    recentTransactions: []
  });
  
  // Inventory
  const [inventory, setInventory] = useState({
    totalProducts: 0,
    totalStock: 0,
    outOfStock: 0,
    lowStock: 0,
    inventory: []
  });
  
  // Profile
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Notifications
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Check vendor access and fetch data
  useEffect(() => {
    if (!isAuthenticated) {
      history.push('/login');
      return;
    }

    fetchAllData();
  }, [isAuthenticated, user, history, activeTab]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const headers = { 'Authorization': `Bearer ${token}` };

      // Fetch dashboard stats
      const dashRes = await fetch('http://localhost:8000/api/vendor/dashboard/', {
        headers
      });
      if (dashRes.ok) {
        const dashData = await dashRes.json();
        setStats(dashData);
      }

      // Fetch products
      const prodRes = await fetch('http://localhost:8000/api/vendor/products/', {
        headers
      });
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData.products || []);
      }

      // Fetch orders
      const ordRes = await fetch(`http://localhost:8000/api/vendor/orders/?status=${orderFilter}`, {
        headers
      });
      if (ordRes.ok) {
        const ordData = await ordRes.json();
        setOrders(ordData.orders || []);
      }

      // Fetch earnings
      const earnRes = await fetch('http://localhost:8000/api/vendor/earnings/', {
        headers
      });
      if (earnRes.ok) {
        const earnData = await earnRes.json();
        setEarnings(earnData);
      }

      // Fetch inventory
      const invRes = await fetch('http://localhost:8000/api/vendor/inventory/', {
        headers
      });
      if (invRes.ok) {
        const invData = await invRes.json();
        setInventory(invData);
      }

      // Fetch notifications
      const notifRes = await fetch('http://localhost:8000/api/vendor/notifications/', {
        headers
      });
      if (notifRes.ok) {
        const notifData = await notifRes.json();
        setNotifications(notifData.notifications || []);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleAddProduct = async () => {
    if (!productForm.name || !productForm.price || !productForm.category) {
      alert('Please fill required fields');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch('http://localhost:8000/api/vendor/products/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productForm)
      });

      if (res.ok) {
        const newProduct = await res.json();
        setProducts([newProduct, ...products]);
        setProductForm({
          name: '',
          price: 0,
          category: '',
          brand: '',
          description: '',
          countInStock: 0,
          gender: 'both',
          available_sizes: ''
        });
        alert('Product added successfully!');
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
      const res = await fetch(`http://localhost:8000/api/vendor/products/${editingProduct._id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productForm)
      });

      if (res.ok) {
        const updatedProduct = await res.json();
        setProducts(products.map(p => p._id === updatedProduct._id ? updatedProduct : p));
        setEditingProduct(null);
        setProductForm({
          name: '',
          price: 0,
          category: '',
          brand: '',
          description: '',
          countInStock: 0,
          gender: 'both',
          available_sizes: ''
        });
        alert('Product updated successfully!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error updating product');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`http://localhost:8000/api/vendor/products/${productId}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        setProducts(products.filter(p => p._id !== productId));
        alert('Product deleted successfully!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error deleting product');
    }
  };

  const handleUpdateOrderStatus = async (orderId) => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`http://localhost:8000/api/vendor/orders/${orderId}/status/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isDelivered: true })
      });

      if (res.ok) {
        alert('Order marked as delivered!');
        fetchAllData();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error updating order');
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
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: profileForm.firstName,
          lastName: profileForm.lastName,
          email: profileForm.email,
          newPassword: profileForm.newPassword
        })
      });

      if (res.ok) {
        alert('Profile updated successfully!');
        setProfileForm({
          firstName: '',
          lastName: '',
          email: '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error updating profile');
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
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-blue-600 font-semibold">Loading vendor dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />

      <div className="flex-grow flex">
        {/* Sidebar */}
        <div className="w-64 bg-gradient-to-b from-blue-600 to-blue-800 text-white p-6 shadow-lg">
          <div className="mb-8">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 text-lg font-bold text-blue-600 shadow">
              V
            </div>
            <h2 className="text-2xl font-bold">Vendor Panel</h2>
            <p className="text-blue-100 text-sm">{user?.username}</p>
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
                className={`w-full text-left px-4 py-2 rounded transition ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 font-semibold shadow'
                    : 'hover:bg-blue-500 text-white'
                }`}
              >
                <span className="mr-2">{tab.icon}</span> {tab.label}
              </button>
            ))}
            <hr className="my-4 border-blue-400" />
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 rounded hover:bg-red-500 transition flex items-center"
            >
              <LogOut size={18} className="mr-2" /> Logout
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-grow overflow-auto">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="p-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-8">Dashboard</h1>

              {/* Stats Cards */}
              <div className="grid grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-semibold">Products</p>
                      <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalProducts}</p>
                    </div>
                    <Package size={40} className="text-blue-200" />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-semibold">Orders</p>
                      <p className="text-3xl font-bold text-green-600 mt-2">{stats.totalOrders}</p>
                    </div>
                    <ShoppingCart size={40} className="text-green-200" />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-semibold">Total Sales</p>
                      <p className="text-3xl font-bold text-purple-600 mt-2">Rs.{stats.totalSales.toFixed(0)}</p>
                    </div>
                    <TrendingUp size={40} className="text-purple-200" />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-semibold">This Month</p>
                      <p className="text-3xl font-bold text-orange-600 mt-2">Rs.{stats.monthSales.toFixed(0)}</p>
                    </div>
                    <BarChart3 size={40} className="text-orange-200" />
                  </div>
                </div>
              </div>

              {/* Alerts */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                {stats.outOfStock > 0 && (
                  <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex items-start gap-3">
                    <AlertTriangle size={24} className="text-red-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-red-900">Out of Stock</h3>
                      <p className="text-red-700">{stats.outOfStock} products need restocking</p>
                    </div>
                  </div>
                )}

                {stats.lowStock > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg flex items-start gap-3">
                    <AlertCircle size={24} className="text-yellow-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-yellow-900">Low Stock</h3>
                      <p className="text-yellow-700">{stats.lowStock} products have low inventory</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Recent Orders */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Orders</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-4 font-semibold text-gray-700">Order ID</th>
                        <th className="text-left py-2 px-4 font-semibold text-gray-700">Customer</th>
                        <th className="text-left py-2 px-4 font-semibold text-gray-700">Amount</th>
                        <th className="text-left py-2 px-4 font-semibold text-gray-700">Status</th>
                        <th className="text-left py-2 px-4 font-semibold text-gray-700">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentOrders?.slice(0, 5).map(order => (
                        <tr key={order._id} className="border-b hover:bg-gray-50">
                          <td className="py-2 px-4">#{order._id}</td>
                          <td className="py-2 px-4">{order.user}</td>
                          <td className="py-2 px-4 font-semibold">Rs.{order.totalPrice.toFixed(2)}</td>
                          <td className="py-2 px-4">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              order.isDelivered
                                ? 'bg-green-100 text-green-700'
                                : order.ispaid
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {order.isDelivered ? 'Delivered' : order.ispaid ? 'Paid' : 'Pending'}
                            </span>
                          </td>
                          <td className="py-2 px-4 text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800">My Products</h1>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <Plus size={20} /> Add Product
                </button>
              </div>

              {/* Product Form */}
              {!editingProduct ? (
                <div className="bg-white p-6 rounded-lg shadow mb-8">
                  <h2 className="text-xl font-bold mb-4">Add New Product</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Product Name"
                      value={productForm.name}
                      onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                      className="border p-2 rounded"
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={productForm.price}
                      onChange={(e) => setProductForm({...productForm, price: parseFloat(e.target.value)})}
                      className="border p-2 rounded"
                    />
                    <input
                      type="text"
                      placeholder="Category"
                      value={productForm.category}
                      onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                      className="border p-2 rounded"
                    />
                    <input
                      type="text"
                      placeholder="Brand"
                      value={productForm.brand}
                      onChange={(e) => setProductForm({...productForm, brand: e.target.value})}
                      className="border p-2 rounded"
                    />
                    <input
                      type="number"
                      placeholder="Stock"
                      value={productForm.countInStock}
                      onChange={(e) => setProductForm({...productForm, countInStock: parseInt(e.target.value)})}
                      className="border p-2 rounded"
                    />
                    <select
                      value={productForm.gender}
                      onChange={(e) => setProductForm({...productForm, gender: e.target.value})}
                      className="border p-2 rounded"
                    >
                      <option value="both">Both/Unisex</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                    <textarea
                      placeholder="Description"
                      value={productForm.description}
                      onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                      className="border p-2 rounded col-span-2"
                      rows="3"
                    />
                    <input
                      type="text"
                      placeholder="Available Sizes (comma-separated)"
                      value={productForm.available_sizes}
                      onChange={(e) => setProductForm({...productForm, available_sizes: e.target.value})}
                      className="border p-2 rounded col-span-2"
                    />
                  </div>
                  <button
                    onClick={handleAddProduct}
                    className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                  >
                    Add Product
                  </button>
                </div>
              ) : (
                <div className="bg-white p-6 rounded-lg shadow mb-8">
                  <h2 className="text-xl font-bold mb-4">Edit Product</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Product Name"
                      value={productForm.name}
                      onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                      className="border p-2 rounded"
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={productForm.price}
                      onChange={(e) => setProductForm({...productForm, price: parseFloat(e.target.value)})}
                      className="border p-2 rounded"
                    />
                    <input
                      type="text"
                      placeholder="Category"
                      value={productForm.category}
                      onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                      className="border p-2 rounded"
                    />
                    <input
                      type="text"
                      placeholder="Brand"
                      value={productForm.brand}
                      onChange={(e) => setProductForm({...productForm, brand: e.target.value})}
                      className="border p-2 rounded"
                    />
                    <input
                      type="number"
                      placeholder="Stock"
                      value={productForm.countInStock}
                      onChange={(e) => setProductForm({...productForm, countInStock: parseInt(e.target.value)})}
                      className="border p-2 rounded"
                    />
                    <select
                      value={productForm.gender}
                      onChange={(e) => setProductForm({...productForm, gender: e.target.value})}
                      className="border p-2 rounded"
                    >
                      <option value="both">Both/Unisex</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                    <textarea
                      placeholder="Description"
                      value={productForm.description}
                      onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                      className="border p-2 rounded col-span-2"
                      rows="3"
                    />
                    <input
                      type="text"
                      placeholder="Available Sizes (comma-separated)"
                      value={productForm.available_sizes}
                      onChange={(e) => setProductForm({...productForm, available_sizes: e.target.value})}
                      className="border p-2 rounded col-span-2"
                    />
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={handleUpdateProduct}
                      className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                    >
                      Update Product
                    </button>
                    <button
                      onClick={() => {
                        setEditingProduct(null);
                        setProductForm({
                          name: '',
                          price: 0,
                          category: '',
                          brand: '',
                          description: '',
                          countInStock: 0,
                          gender: 'both',
                          available_sizes: ''
                        });
                      }}
                      className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Products List */}
              <div className="grid grid-cols-3 gap-6">
                {products.map(product => (
                  <div key={product._id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition">
                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                      {product.image ? (
                        <img
                          src={`http://localhost:8000${product.image}`}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package size={48} className="text-gray-400" />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-800 mb-2">{product.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                      <p className="text-xl font-bold text-blue-600 mb-3">Rs.{product.price}</p>
                      <p className="text-sm text-gray-600 mb-3">Stock: {product.countInStock}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingProduct(product);
                            setProductForm({
                              name: product.name,
                              price: product.price,
                              category: product.category,
                              brand: product.brand,
                              description: product.description,
                              countInStock: product.countInStock,
                              gender: product.gender,
                              available_sizes: product.available_sizes || ''
                            });
                          }}
                          className="flex-1 bg-blue-600 text-white py-1 px-2 rounded text-sm hover:bg-blue-700 flex items-center justify-center gap-1"
                        >
                          <Edit2 size={16} /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="flex-1 bg-red-600 text-white py-1 px-2 rounded text-sm hover:bg-red-700 flex items-center justify-center gap-1"
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="p-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-8">My Orders</h1>

              {/* Filter */}
              <div className="mb-6 flex gap-2">
                {['all', 'pending', 'paid', 'delivered'].map(filter => (
                  <button
                    key={filter}
                    onClick={() => setOrderFilter(filter)}
                    className={`px-4 py-2 rounded capitalize ${
                      orderFilter === filter
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">Order ID</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">Customer</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">Items</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">Amount</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">Payment</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">Status</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">Date</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-semibold">#{order._id}</td>
                        <td className="py-3 px-4">{order.user}</td>
                        <td className="py-3 px-4">{order.items.length} item(s)</td>
                        <td className="py-3 px-4 font-semibold">Rs.{order.vendorSubtotal.toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            order.ispaid
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {order.ispaid ? 'Paid' : 'Pending'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            order.isDelivered
                              ? 'bg-green-100 text-green-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {order.isDelivered ? 'Delivered' : 'Processing'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="py-3 px-4">
                          {!order.isDelivered && (
                            <button
                              onClick={() => handleUpdateOrderStatus(order._id)}
                              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                            >
                              Mark Delivered
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Earnings Tab */}
          {activeTab === 'earnings' && (
            <div className="p-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-8">Earnings</h1>

              {/* Earnings Cards */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                  <p className="text-gray-600 text-sm font-semibold">Total Earnings</p>
                  <p className="text-4xl font-bold text-blue-600 mt-2">Rs.{earnings.totalEarnings.toFixed(0)}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <p className="text-gray-600 text-sm font-semibold">This Month</p>
                  <p className="text-4xl font-bold text-green-600 mt-2">Rs.{earnings.monthEarnings.toFixed(0)}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <p className="text-gray-600 text-sm font-semibold">This Week</p>
                  <p className="text-4xl font-bold text-purple-600 mt-2">Rs.{earnings.weekEarnings.toFixed(0)}</p>
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-bold text-gray-800">Recent Transactions</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="py-3 px-4 text-left font-semibold text-gray-700">Order ID</th>
                        <th className="py-3 px-4 text-left font-semibold text-gray-700">Customer</th>
                        <th className="py-3 px-4 text-left font-semibold text-gray-700">Items</th>
                        <th className="py-3 px-4 text-left font-semibold text-gray-700">Amount</th>
                        <th className="py-3 px-4 text-left font-semibold text-gray-700">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {earnings.recentTransactions?.map(trans => (
                        <tr key={trans._id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-semibold">#{trans._id}</td>
                          <td className="py-3 px-4">{trans.user}</td>
                          <td className="py-3 px-4">{trans.items} item(s)</td>
                          <td className="py-3 px-4 font-bold text-green-600">Rs.{trans.amount.toFixed(2)}</td>
                          <td className="py-3 px-4 text-sm">{new Date(trans.date).toLocaleDateString()}</td>
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
            <div className="p-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-8">Inventory Management</h1>

              {/* Inventory Stats */}
              <div className="grid grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                  <p className="text-gray-600 text-sm font-semibold">Total Products</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">{inventory.totalProducts}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <p className="text-gray-600 text-sm font-semibold">Total Stock</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">{inventory.totalStock}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <p className="text-gray-600 text-sm font-semibold">Low Stock</p>
                  <p className="text-3xl font-bold text-orange-600 mt-2">{inventory.lowStock}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <p className="text-gray-600 text-sm font-semibold">Out of Stock</p>
                  <p className="text-3xl font-bold text-red-600 mt-2">{inventory.outOfStock}</p>
                </div>
              </div>

              {/* Inventory Table */}
              <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">Product</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">Category</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">Price</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">Stock</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.inventory?.map(item => (
                      <tr key={item._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-semibold">{item.name}</td>
                        <td className="py-3 px-4">{item.category}</td>
                        <td className="py-3 px-4">Rs.{item.price.toFixed(2)}</td>
                        <td className="py-3 px-4">{item.stock}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            item.status === 'in_stock'
                              ? 'bg-green-100 text-green-700'
                              : item.status === 'low_stock'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {item.status === 'in_stock' ? 'In Stock' : item.status === 'low_stock' ? 'Low Stock' : 'Out of Stock'}
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
            <div className="p-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-8">Profile & Settings</h1>

              {/* Profile Form */}
              <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Update Profile</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">First Name</label>
                    <input
                      type="text"
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})}
                      placeholder="First Name"
                      className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Last Name</label>
                    <input
                      type="text"
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})}
                      placeholder="Last Name"
                      className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                      placeholder="Email"
                      className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <hr className="my-6" />

                  <h3 className="text-lg font-bold text-gray-800">Change Password</h3>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">New Password</label>
                    <input
                      type="password"
                      value={profileForm.newPassword}
                      onChange={(e) => setProfileForm({...profileForm, newPassword: e.target.value})}
                      placeholder="New Password"
                      className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Confirm Password</label>
                    <input
                      type="password"
                      value={profileForm.confirmPassword}
                      onChange={(e) => setProfileForm({...profileForm, confirmPassword: e.target.value})}
                      placeholder="Confirm Password"
                      className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <button
                    onClick={handleUpdateProfile}
                    className="mt-6 bg-blue-600 text-white px-8 py-2 rounded hover:bg-blue-700 font-semibold"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorPanelNew;
