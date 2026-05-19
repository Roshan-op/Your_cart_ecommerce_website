import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BarChart3, Users, Package, ShoppingCart, Settings, LogOut, Trash2, Edit2,
  TrendingUp, DollarSign, AlertCircle, CheckCircle, Eye, Download, Calendar
} from 'lucide-react';

const AdminPanelEnhanced = () => {
  const history = useHistory();
  const { user, isAuthenticated, logout, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  
  // Dashboard data
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0, totalVendors: 0, totalProducts: 0, totalOrders: 0,
    totalSales: 0, monthSales: 0, weekSales: 0,
    pendingOrders: 0, paidOrders: 0, deliveredOrders: 0,
    recentOrders: [], topVendors: []
  });
  
  // Vendors data
  const [vendors, setVendors] = useState([]);
  
  // Products data
  const [products, setProducts] = useState([]);
  
  // Orders data
  const [orders, setOrders] = useState([]);
  const [orderFilter, setOrderFilter] = useState('all');
  
  // Users data
  const [users, setUsers] = useState([]);
  
  // Categories data
  const [categories, setCategories] = useState([]);
  
  // Settings data
  const [settings, setSettings] = useState({
    storeName: '', storeEmail: '', supportPhone: '',
    currency: 'USD', timezone: 'UTC', language: 'English',
    maintenanceMode: false, allowNewVendors: true, commissionRate: 10, taxRate: 5
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      history.push('/login');
      return;
    }
    if (isAuthenticated && !user?.isAdmin) {
      history.push('/vendor');
      return;
    }
    if (isAuthenticated && user?.isAdmin) {
      fetchAllData();
    }
  }, [isAuthenticated, authLoading, activeTab, orderFilter]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [dashRes, vendorsRes, productsRes, ordersRes, usersRes, categoriesRes, settingsRes] = await Promise.all([
        fetch('http://localhost:8000/api/admin/dashboard/', { headers }),
        fetch('http://localhost:8000/api/admin/vendors/', { headers }),
        fetch('http://localhost:8000/api/admin/products/', { headers }),
        fetch(`http://localhost:8000/api/admin/orders/?status=${orderFilter}`, { headers }),
        fetch('http://localhost:8000/api/admin/users/', { headers }),
        fetch('http://localhost:8000/api/admin/categories/', { headers }),
        fetch('http://localhost:8000/api/admin/settings/', { headers })
      ]);

      if (dashRes.ok) setDashboardStats(await dashRes.json());
      if (vendorsRes.ok) setVendors((await vendorsRes.json()).vendors || []);
      if (productsRes.ok) setProducts((await productsRes.json()).products || []);
      if (ordersRes.ok) setOrders((await ordersRes.json()).orders || []);
      if (usersRes.ok) setUsers((await usersRes.json()).users || []);
      if (categoriesRes.ok) setCategories((await categoriesRes.json()).categories || []);
      if (settingsRes.ok) setSettings(await settingsRes.json());
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:8000/api/admin/products/${productId}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        alert('Product deleted successfully');
        setProducts(products.filter(p => p.id !== productId));
      }
    } catch (error) {
      alert('Error deleting product');
    }
  };

  const handleUpdateOrderStatus = async (orderId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:8000/api/admin/orders/${orderId}/status/`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDelivered: true })
      });
      if (response.ok) {
        alert('Order marked as delivered');
        fetchAllData();
      }
    } catch (error) {
      alert('Error updating order');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:8000/api/admin/users/${userId}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        alert('User deleted successfully');
        setUsers(users.filter(u => u.id !== userId));
      }
    } catch (error) {
      alert('Error deleting user');
    }
  };

  const handleUpdateUserRole = async (userId, isAdmin) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:8000/api/admin/users/${userId}/role/`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAdmin })
      });
      if (response.ok) {
        alert('User role updated');
        fetchAllData();
      }
    } catch (error) {
      alert('Error updating user role');
    }
  };

  if (loading || authLoading) {
    return <div className="flex items-center justify-center h-screen text-xl">Loading admin dashboard...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-indigo-600 to-indigo-800 text-white shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold">Admin Hub</h2>
          <p className="text-indigo-200 text-sm">System Management</p>
        </div>
        <nav className="space-y-2 px-4 mt-8">
          {[
            { id: 'dashboard', label: '📊 Dashboard', icon: BarChart3 },
            { id: 'vendors', label: '🏪 Vendors', icon: Package },
            { id: 'products', label: '📦 Products', icon: Package },
            { id: 'orders', label: '🛒 Orders', icon: ShoppingCart },
            { id: 'users', label: '👥 Users', icon: Users },
            { id: 'categories', label: '🏷️ Categories', icon: Package },
            { id: 'settings', label: '⚙️ Settings', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-4 py-3 rounded-lg transition font-medium ${
                activeTab === tab.id
                  ? 'bg-white text-indigo-600 shadow-md'
                  : 'text-indigo-100 hover:bg-indigo-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
          <button
            onClick={() => {
              logout();
              history.push('/login');
            }}
            className="w-full text-left px-4 py-3 rounded-lg transition font-medium text-indigo-100 hover:bg-red-600 mt-8"
          >
            <LogOut className="inline mr-2" size={18} /> Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Dashboard</h1>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { label: 'Total Users', value: dashboardStats.totalUsers, color: 'blue', icon: Users },
                { label: 'Total Vendors', value: dashboardStats.totalVendors, color: 'green', icon: Package },
                { label: 'Total Products', value: dashboardStats.totalProducts, color: 'purple', icon: Package },
                { label: 'Total Orders', value: dashboardStats.totalOrders, color: 'orange', icon: ShoppingCart }
              ].map((stat, idx) => {
                const Icon = stat.icon;
                const colors = {
                  blue: 'bg-blue-50 border-blue-200 text-blue-600',
                  green: 'bg-green-50 border-green-200 text-green-600',
                  purple: 'bg-purple-50 border-purple-200 text-purple-600',
                  orange: 'bg-orange-50 border-orange-200 text-orange-600'
                };
                return (
                  <div key={idx} className={`${colors[stat.color]} p-6 rounded-xl border-2 shadow-sm`}>
                    <Icon size={32} className="mb-3" />
                    <p className="text-gray-600 text-sm font-semibold">{stat.label}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                );
              })}
            </div>

            {/* Sales Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                { label: 'Total Sales', value: `Rs.${dashboardStats.totalSales.toFixed(0)}`, icon: DollarSign, color: 'blue' },
                { label: 'This Month', value: `Rs.${dashboardStats.monthSales.toFixed(0)}`, icon: Calendar, color: 'green' },
                { label: 'This Week', value: `Rs.${dashboardStats.weekSales.toFixed(0)}`, icon: TrendingUp, color: 'purple' }
              ].map((stat, idx) => {
                const Icon = stat.icon;
                const colors = { blue: 'bg-blue-50 border-blue-200 text-blue-600', green: 'bg-green-50 border-green-200 text-green-600', purple: 'bg-purple-50 border-purple-200 text-purple-600' };
                return (
                  <div key={idx} className={`${colors[stat.color]} p-6 rounded-xl border-2 shadow-sm`}>
                    <p className="text-gray-600 text-sm font-semibold">{stat.label}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                );
              })}
            </div>

            {/* Orders Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                { label: 'Pending Orders', value: dashboardStats.pendingOrders, color: 'yellow' },
                { label: 'Paid Orders', value: dashboardStats.paidOrders, color: 'blue' },
                { label: 'Delivered Orders', value: dashboardStats.deliveredOrders, color: 'green' }
              ].map((stat, idx) => (
                <div key={idx} className={`bg-${stat.color}-50 border-2 border-${stat.color}-200 text-${stat.color}-600 p-6 rounded-xl shadow-sm`}>
                  <p className="text-gray-600 text-sm font-semibold">{stat.label}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Recent Orders */}
            {dashboardStats.recentOrders.length > 0 && (
              <div className="bg-white rounded-xl shadow-md border-2 border-gray-100 p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Orders</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b-2 border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-gray-900">Order ID</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-900">Customer</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-900">Amount</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-900">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardStats.recentOrders.map(order => (
                        <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-4 py-3 font-semibold">#{order.id}</td>
                          <td className="px-4 py-3">{order.customer}</td>
                          <td className="px-4 py-3 font-semibold">Rs.{order.amount.toFixed(2)}</td>
                          <td className="px-4 py-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                              order.status === 'Paid' ? 'bg-blue-100 text-blue-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Top Vendors */}
            {dashboardStats.topVendors.length > 0 && (
              <div className="bg-white rounded-xl shadow-md border-2 border-gray-100 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Vendors</h2>
                <div className="space-y-4">
                  {dashboardStats.topVendors.map(vendor => (
                    <div key={vendor.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div>
                        <p className="font-semibold text-gray-900">{vendor.name}</p>
                        <p className="text-sm text-gray-600">{vendor.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">Rs.{vendor.sales.toFixed(0)}</p>
                        <p className="text-sm text-gray-600">{vendor.products} products</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Vendors Tab */}
        {activeTab === 'vendors' && (
          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Vendors Management</h1>
            <div className="bg-white rounded-xl shadow-md border-2 border-gray-100 p-6">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Name</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Email</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Products</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Orders</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Sales</th>
                  </tr>
                </thead>
                <tbody>
                  {vendors.map(vendor => (
                    <tr key={vendor.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold">{vendor.name}</td>
                      <td className="px-4 py-3">{vendor.email}</td>
                      <td className="px-4 py-3">{vendor.products}</td>
                      <td className="px-4 py-3">{vendor.orders}</td>
                      <td className="px-4 py-3 font-semibold">Rs.{vendor.sales.toFixed(0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {vendors.length === 0 && <p className="text-center py-8 text-gray-500">No vendors found</p>}
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Products Management</h1>
            <div className="bg-white rounded-xl shadow-md border-2 border-gray-100 p-6">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Product</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Vendor</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Category</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Price</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Stock</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold">{product.name}</td>
                      <td className="px-4 py-3">{product.vendor}</td>
                      <td className="px-4 py-3">{product.category}</td>
                      <td className="px-4 py-3">Rs.{product.price.toFixed(2)}</td>
                      <td className="px-4 py-3">{product.stock}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-800 font-semibold"
                        >
                          <Trash2 size={18} className="inline" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {products.length === 0 && <p className="text-center py-8 text-gray-500">No products found</p>}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Orders Management</h1>
            
            {/* Filter Buttons */}
            <div className="flex gap-4 mb-6">
              {['all', 'pending', 'paid', 'delivered'].map(filter => (
                <button
                  key={filter}
                  onClick={() => setOrderFilter(filter)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    orderFilter === filter
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-indigo-400'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-md border-2 border-gray-100 p-6">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Order ID</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Customer</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Amount</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Items</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold">#{order.id}</td>
                      <td className="px-4 py-3">{order.customer}</td>
                      <td className="px-4 py-3 font-semibold">Rs.{order.amount.toFixed(2)}</td>
                      <td className="px-4 py-3">{order.itemsCount}</td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.isDelivered ? 'bg-green-100 text-green-700' :
                          order.isPaid ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.isDelivered ? 'Delivered' : order.isPaid ? 'Paid' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {!order.isDelivered && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id)}
                            className="text-green-600 hover:text-green-800 font-semibold text-sm"
                          >
                            Mark Delivered
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length === 0 && <p className="text-center py-8 text-gray-500">No orders found</p>}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Users Management</h1>
            <div className="bg-white rounded-xl shadow-md border-2 border-gray-100 p-6">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Name</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Email</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Type</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Orders</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold">{user.name}</td>
                      <td className="px-4 py-3">{user.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          user.isAdmin ? 'bg-red-100 text-red-700' :
                          user.isVendor ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {user.isAdmin ? 'Admin' : user.isVendor ? 'Vendor' : 'Customer'}
                        </span>
                      </td>
                      <td className="px-4 py-3">{user.orders}</td>
                      <td className="px-4 py-3 space-x-2">
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-800 font-semibold text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && <p className="text-center py-8 text-gray-500">No users found</p>}
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Categories Management</h1>
            <div className="bg-white rounded-xl shadow-md border-2 border-gray-100 p-6">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Category</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Products</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Sales</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold">{cat.name}</td>
                      <td className="px-4 py-3">{cat.products}</td>
                      <td className="px-4 py-3 font-semibold">Rs.{cat.sales.toFixed(0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {categories.length === 0 && <p className="text-center py-8 text-gray-500">No categories found</p>}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Settings</h1>
            <div className="bg-white rounded-xl shadow-md border-2 border-gray-100 p-8 max-w-2xl">
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Store Name</label>
                    <input
                      type="text"
                      defaultValue={settings.storeName}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Store Email</label>
                    <input
                      type="email"
                      defaultValue={settings.storeEmail}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-400 outline-none"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Currency</label>
                    <select defaultValue={settings.currency} className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-400 outline-none">
                      <option>USD</option>
                      <option>EUR</option>
                      <option>GBP</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Commission Rate (%)</label>
                    <input
                      type="number"
                      defaultValue={settings.commissionRate}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-400 outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                  <input
                    type="checkbox"
                    defaultChecked={settings.maintenanceMode}
                    className="w-5 h-5 rounded"
                  />
                  <label className="font-semibold text-gray-700">Maintenance Mode</label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition"
                >
                  Save Settings
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanelEnhanced;
