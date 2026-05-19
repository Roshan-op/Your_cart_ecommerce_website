import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components';
import Footer from '../components/Footer';
import { Users, ShoppingCart, TrendingUp, BarChart3, LogOut, Plus, Trash2, Edit2, Eye } from 'lucide-react';

const AdminPanel = ({ history }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalVendors: 0,
    totalRevenue: 0
  });
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);

  // Check admin access and fetch data
  useEffect(() => {
    if (!isAuthenticated) {
      history.push('/login');
      return;
    }

    if (!user?.isAdmin) {
      history.push('/');
      return;
    }

    fetchAllData();
  }, [isAuthenticated, user, history]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');

      // Fetch users
      const usersRes = await fetch('http://localhost:8000/api/users/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const usersData = usersRes.ok ? await usersRes.json() : [];
      setUsers(Array.isArray(usersData) ? usersData : []);

      // Fetch orders
      const ordersRes = await fetch('http://localhost:8000/api/orders/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const ordersData = ordersRes.ok ? await ordersRes.json() : [];
      setOrders(Array.isArray(ordersData) ? ordersData : []);

      // Fetch products
      const productsRes = await fetch('http://localhost:8000/api/products/');
      const productsData = productsRes.ok ? await productsRes.json() : [];
      setProducts(Array.isArray(productsData) ? productsData : []);

      // Parse vendors
      const vendorsList = usersData.filter(u => u.is_staff);
      setVendors(vendorsList);

      // Calculate revenue
      const totalRevenue = ordersData.reduce((sum, order) => sum + (parseFloat(order.totalPrice) || 0), 0);

      setStats({
        totalUsers: usersData.length,
        totalOrders: ordersData.length,
        totalVendors: vendorsList.length,
        totalRevenue: totalRevenue.toFixed(2)
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(`http://localhost:8000/api/users/delete/${userId}/`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          setUsers(users.filter(u => u.id !== userId));
          alert('User deleted successfully');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user');
      }
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(`http://localhost:8000/api/products/delete/${productId}/`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          setProducts(products.filter(p => p._id !== productId));
          alert('Product deleted successfully');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product');
      }
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
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-primary font-semibold">Loading admin dashboard...</p>
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
          <div className="col-span-1 bg-gradient-to-b from-purple-600 to-purple-800 text-white p-8 min-h-screen">
            <div className="mb-12 animate-fadeIn">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 text-2xl font-bold text-purple-600 shadow-lg">
                A
              </div>
              <h2 className="text-2xl font-bold mb-2">Admin Panel</h2>
              <p className="text-purple-100">{user?.username || 'Administrator'}</p>
              <p className="text-xs text-purple-200 mt-2">ID: {user?.id}</p>
            </div>

            <nav className="space-y-3">
              {[
                { id: 'overview', label: 'Dashboard', icon: '📊' },
                { id: 'users', label: 'Users', icon: '👥' },
                { id: 'vendors', label: 'Vendors', icon: '🏪' },
                { id: 'orders', label: 'Orders', icon: '📦' },
                { id: 'products', label: 'Products', icon: '🛍️' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all transform ${
                    activeTab === tab.id
                      ? 'bg-white text-purple-600 shadow-lg scale-105'
                      : 'hover:bg-white hover:bg-opacity-10 text-white'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span> {tab.label}
                </button>
              ))}
              <hr className="my-4 border-purple-400" />
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
            {/* Stats Cards */}
            {activeTab === 'overview' && (
              <div className="animate-fadeIn">
                <h1 className="text-4xl font-bold text-primary mb-8">Admin Dashboard</h1>

                <div className="grid grid-cols-4 gap-6 mb-12">
                  <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500 hover:shadow-lg transform hover:scale-105 transition-all cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-semibold">Total Users</p>
                        <p className="text-3xl font-bold text-primary mt-2">{stats.totalUsers}</p>
                      </div>
                      <Users size={40} className="text-blue-500 opacity-20" />
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500 hover:shadow-lg transform hover:scale-105 transition-all cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-semibold">Total Orders</p>
                        <p className="text-3xl font-bold text-primary mt-2">{stats.totalOrders}</p>
                      </div>
                      <ShoppingCart size={40} className="text-green-500 opacity-20" />
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-orange-500 hover:shadow-lg transform hover:scale-105 transition-all cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-semibold">Active Vendors</p>
                        <p className="text-3xl font-bold text-primary mt-2">{stats.totalVendors}</p>
                      </div>
                      <TrendingUp size={40} className="text-orange-500 opacity-20" />
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500 hover:shadow-lg transform hover:scale-105 transition-all cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-semibold">Total Revenue</p>
                        <p className="text-3xl font-bold text-primary mt-2">Rs.{stats.totalRevenue}</p>
                      </div>
                      <BarChart3 size={40} className="text-purple-500 opacity-20" />
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white p-6 rounded-xl shadow-md mb-8">
                  <h2 className="text-xl font-bold text-primary mb-4">Quick Actions</h2>
                  <div className="flex gap-4 flex-wrap">
                    <button
                      onClick={() => setActiveTab('vendors')}
                      className="bg-gradient-to-r from-green-400 to-green-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all font-semibold"
                    >
                      <Plus size={18} className="inline mr-2" /> Add Vendor
                    </button>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all font-semibold"
                    >
                      <Eye size={18} className="inline mr-2" /> View All Orders
                    </button>
                    <button
                      onClick={() => setActiveTab('products')}
                      className="bg-gradient-to-r from-purple-400 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all font-semibold"
                    >
                      <Edit2 size={18} className="inline mr-2" /> Manage Products
                    </button>
                  </div>
                </div>

                {/* System Health */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h2 className="text-xl font-bold text-primary mb-6">System Health</h2>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700">Database</span>
                        <span className="text-sm font-bold text-green-600">Healthy</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700">API Server</span>
                        <span className="text-sm font-bold text-green-600">Healthy</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700">Storage</span>
                        <span className="text-sm font-bold text-green-600">Healthy</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="animate-fadeIn">
                <h1 className="text-4xl font-bold text-primary mb-8">Manage Users</h1>
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-purple-500 to-purple-700 text-white">
                      <tr>
                        <th className="px-6 py-3 text-left">ID</th>
                        <th className="px-6 py-3 text-left">Username</th>
                        <th className="px-6 py-3 text-left">Email</th>
                        <th className="px-6 py-3 text-left">Role</th>
                        <th className="px-6 py-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id} className="border-b hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">{u.id}</td>
                          <td className="px-6 py-4 font-semibold text-primary">{u.username}</td>
                          <td className="px-6 py-4">{u.email}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              u.is_superuser ? 'bg-red-100 text-red-700' : u.is_staff ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                            }`}>
                              {u.is_superuser ? 'ADMIN' : u.is_staff ? 'VENDOR' : 'CUSTOMER'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="text-red-600 hover:text-red-800 transform hover:scale-110 transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Vendors Tab */}
            {activeTab === 'vendors' && (
              <div className="animate-fadeIn">
                <h1 className="text-4xl font-bold text-primary mb-8">Manage Vendors</h1>
                <div className="grid grid-cols-3 gap-6">
                  {vendors.map((vendor) => (
                    <div key={vendor.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mb-4">
                        {vendor.username[0].toUpperCase()}
                      </div>
                      <h3 className="text-lg font-bold text-primary">{vendor.username}</h3>
                      <p className="text-sm text-gray-600 my-2">{vendor.email}</p>
                      <div className="flex gap-2">
                        <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-all transform hover:scale-105 flex-1">
                          <Eye size={14} className="inline mr-1" /> View
                        </button>
                        <button className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-all transform hover:scale-105 flex-1">
                          <Trash2 size={14} className="inline mr-1" /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="animate-fadeIn">
                <h1 className="text-4xl font-bold text-primary mb-8">Recent Orders ({orders.length})</h1>
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-green-500 to-green-700 text-white">
                      <tr>
                        <th className="px-6 py-3 text-left">Order ID</th>
                        <th className="px-6 py-3 text-left">Total</th>
                        <th className="px-6 py-3 text-left">Status</th>
                        <th className="px-6 py-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 10).map((order) => (
                        <tr key={order._id} className="border-b hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 font-mono text-sm">{order._id}</td>
                          <td className="px-6 py-4 font-bold">Rs.{order.totalPrice}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              order.ispaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {order.ispaid ? 'PAID' : 'PENDING'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button className="text-blue-600 hover:text-blue-800 transform hover:scale-110 transition-all">
                              <Eye size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div className="animate-fadeIn">
                <h1 className="text-4xl font-bold text-primary mb-8">Manage Products ({products.length})</h1>
                <div className="grid grid-cols-4 gap-6">
                  {products.slice(0, 8).map((product) => (
                    <div key={product._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transform hover:scale-105 transition-all">
                      <div className="h-40 bg-gray-200 flex items-center justify-center">
                        {product.image ? (
                          <img
                            src={`http://localhost:8000${product.image}`}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-400">No image</span>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-primary truncate">{product.name}</h3>
                        <p className="text-sm text-gray-600 my-1">Rs.{product.price}</p>
                        <div className="flex gap-2">
                          <button className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 transition-all flex-1 transform hover:scale-105">
                            <Edit2 size={12} className="inline mr-1" /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition-all flex-1 transform hover:scale-105"
                          >
                            <Trash2 size={12} className="inline mr-1" /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
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

export default AdminPanel;
