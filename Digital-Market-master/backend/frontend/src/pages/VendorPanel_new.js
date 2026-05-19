import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components';
import Footer from '../components/Footer';
import { Package, ShoppingCart, TrendingUp, BarChart3, LogOut, Plus, Trash2, Edit2, Eye } from 'lucide-react';

const VendorPanel = ({ history }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0,
    pendingOrders: 0
  });
  const [products, setProducts] = useState([]);
  const [myOrders, setMyOrders] = useState([]);

  // Check vendor access and fetch data
  useEffect(() => {
    if (!isAuthenticated) {
      history.push('/login');
      return;
    }

    if (!user?.isVendor && !user?.isAdmin) {
      history.push('/');
      return;
    }

    fetchAllData();
  }, [isAuthenticated, user, history]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');

      // Fetch my products
      const productsRes = await fetch('http://localhost:8000/api/products/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const productsData = productsRes.ok ? await productsRes.json() : [];
      const myProductsList = Array.isArray(productsData) 
        ? productsData.filter(p => p.user === user?.id) 
        : [];
      setProducts(myProductsList);

      // Fetch my orders
      const ordersRes = await fetch('http://localhost:8000/api/orders/myorders/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const ordersData = ordersRes.ok ? await ordersRes.json() : [];
      setMyOrders(Array.isArray(ordersData) ? ordersData : []);

      // Calculate stats
      const totalSales = ordersData.reduce((sum, order) => {
        if (order.ispaid) return sum + (parseFloat(order.totalPrice) || 0);
        return sum;
      }, 0);
      
      const pendingCount = ordersData.filter(o => !o.ispaid).length;

      setStats({
        totalProducts: myProductsList.length,
        totalOrders: myOrdersData.length,
        totalSales: totalSales.toFixed(2),
        pendingOrders: pendingCount
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    history.push('/');
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
    <div className="min-h-screen bg-light flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <div className="grid grid-cols-4 bg-white border-b">
          {/* Sidebar */}
          <div className="col-span-1 bg-gradient-to-b from-blue-600 to-blue-800 text-white p-8 min-h-screen">
            <div className="mb-12 animate-fadeIn">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 text-2xl font-bold text-blue-600 shadow-lg">
                V
              </div>
              <h2 className="text-2xl font-bold mb-2">Vendor Panel</h2>
              <p className="text-blue-100">{user?.username || 'Vendor'}</p>
              <p className="text-xs text-blue-200 mt-2">ID: {user?.id}</p>
            </div>

            <nav className="space-y-3">
              {[
                { id: 'overview', label: 'Dashboard', icon: '📊' },
                { id: 'products', label: 'My Products', icon: '📦' },
                { id: 'orders', label: 'My Orders', icon: '🛒' },
                { id: 'analytics', label: 'Analytics', icon: '📈' },
                { id: 'settings', label: 'Settings', icon: '⚙️' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all transform ${
                    activeTab === tab.id
                      ? 'bg-white text-blue-600 shadow-lg scale-105'
                      : 'hover:bg-white hover:bg-opacity-10 text-white'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span> {tab.label}
                </button>
              ))}
              <hr className="my-4 border-blue-400" />
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
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="animate-fadeIn">
                <div className="flex justify-between items-center mb-8">
                  <h1 className="text-4xl font-bold text-primary">Vendor Dashboard</h1>
                  <button
                    onClick={() => setActiveTab('products')}
                    className="bg-gradient-to-r from-green-400 to-green-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all font-semibold"
                  >
                    <Plus size={18} className="inline mr-2" /> Add Product
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-6 mb-12">
                  <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500 hover:shadow-lg transform hover:scale-105 transition-all cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-semibold">My Products</p>
                        <p className="text-3xl font-bold text-primary mt-2">{stats.totalProducts}</p>
                      </div>
                      <Package size={40} className="text-blue-500 opacity-20" />
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

                  <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500 hover:shadow-lg transform hover:scale-105 transition-all cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-semibold">Total Sales</p>
                        <p className="text-3xl font-bold text-primary mt-2">Rs.{stats.totalSales}</p>
                      </div>
                      <TrendingUp size={40} className="text-purple-500 opacity-20" />
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-orange-500 hover:shadow-lg transform hover:scale-105 transition-all cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-semibold">Pending Orders</p>
                        <p className="text-3xl font-bold text-primary mt-2">{stats.pendingOrders}</p>
                      </div>
                      <BarChart3 size={40} className="text-orange-500 opacity-20" />
                    </div>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h2 className="text-xl font-bold text-primary mb-4">Recent Orders</h2>
                  <div className="space-y-3">
                    {myOrders.slice(0, 3).map((order) => (
                      <div key={order._id} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all">
                        <div>
                          <p className="font-semibold text-primary">Order #{order._id.slice(-6)}</p>
                          <p className="text-sm text-gray-600">Rs.{order.totalPrice}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          order.ispaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.ispaid ? 'PAID' : 'PENDING'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div className="animate-fadeIn">
                <h1 className="text-4xl font-bold text-primary mb-8">My Products ({products.length})</h1>
                <div className="grid grid-cols-4 gap-6">
                  {products.map((product) => (
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

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="animate-fadeIn">
                <h1 className="text-4xl font-bold text-primary mb-8">My Orders ({myOrders.length})</h1>
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
                      <tr>
                        <th className="px-6 py-3 text-left">Order ID</th>
                        <th className="px-6 py-3 text-left">Total</th>
                        <th className="px-6 py-3 text-left">Status</th>
                        <th className="px-6 py-3 text-left">Date</th>
                        <th className="px-6 py-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myOrders.map((order) => (
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
                          <td className="px-6 py-4 text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
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

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="animate-fadeIn">
                <h1 className="text-4xl font-bold text-primary mb-8">Analytics</h1>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-lg font-bold text-primary mb-4">Sales Over Time</h2>
                    <div className="h-64 bg-gradient-to-b from-gray-100 to-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                      Chart coming soon...
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-lg font-bold text-primary mb-4">Top Products</h2>
                    <div className="space-y-3">
                      {products.slice(0, 5).map((p, idx) => (
                        <div key={p._id} className="flex justify-between items-center p-2 border-b">
                          <span className="font-semibold text-gray-700">{idx + 1}. {p.name.slice(0, 20)}...</span>
                          <span className="text-blue-600 font-bold">Rs.{p.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="animate-fadeIn">
                <h1 className="text-4xl font-bold text-primary mb-8">Settings</h1>
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h2 className="text-lg font-bold text-primary mb-4">Store Settings</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Store Name</label>
                      <input
                        type="text"
                        defaultValue={user?.username}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Store Email</label>
                      <input
                        type="email"
                        defaultValue={user?.email}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all">
                      Save Changes
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

export default VendorPanel;
