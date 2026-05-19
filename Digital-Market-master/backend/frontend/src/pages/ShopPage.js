import React, { useState, useMemo, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Navbar, ProductCard, Loading } from '../components';
import Footer from '../components/Footer';
import { productAPI } from '../api/api';

const ShopPage = ({ location }) => {
  const searchParams = new URLSearchParams(location?.search);
  const initialCategory = searchParams.get('category') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [categories, setCategories] = useState(['All']);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productAPI.getProducts('', 1);
        const productList = data.products || [];
        setProducts(productList);

        // Extract unique categories
        const uniqueCategories = ['All', ...new Set(productList.map(p => p.category).filter(Boolean))];
        setCategories(uniqueCategories);

        // Update price range based on actual products
        if (productList.length > 0) {
          const prices = productList.map(p => parseFloat(p.price) || 0);
          const maxPrice = Math.max(...prices);
          setPriceRange([0, Math.ceil(maxPrice)]);
        }
      } catch (err) {
        setError(err.message || 'Failed to load products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Filter by price
    const minPrice = priceRange[0];
    const maxPrice = priceRange[1];
    filtered = filtered.filter((p) => {
      const price = parseFloat(p.price) || 0;
      return price >= minPrice && price <= maxPrice;
    });

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0));
        break;
      case 'rating':
        filtered.sort((a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0));
        break;
      case 'newest':
      default:
        // Keep original order
        break;
    }

    return filtered;
  }, [products, selectedCategory, sortBy, priceRange]);

  if (loading) {
    return (
      <div className="min-h-screen bg-light flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <Loading />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero */}
        <section className="bg-gradient-to-r from-beige to-mint py-12">
          <div className="container-custom">
            <h1 className="font-serif text-4xl font-bold text-primary">Shop</h1>
            <p className="text-gray-600 mt-2">
              Showing {filteredProducts.length} products
            </p>
          </div>
        </section>

        {/* Shop Content */}
        <section className="py-12">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Sidebar - Filters */}
              <aside className="md:col-span-1">
                <div className="card-base p-6">
                  {/* Category Filter */}
                  <div className="mb-8">
                    <h3 className="font-bold text-lg mb-4">Category</h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <label key={category} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="category"
                            value={category}
                            checked={selectedCategory === category || (selectedCategory === '' && category === 'All')}
                            onChange={(e) => setSelectedCategory(e.target.value === 'All' ? '' : e.target.value)}
                            className="w-4 h-4 text-accent"
                          />
                          <span className="text-primary hover:text-accent transition-colors">{category}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Range Filter */}
                  <div className="mb-8 pb-8 border-b border-gray-200">
                    <h3 className="font-bold text-lg mb-4">Price Range</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-600 block mb-2">Min: Rs. {priceRange[0]}</label>
                        <input
                          type="range"
                          min="0"
                          max={Math.ceil(Math.max(...products.map(p => parseFloat(p.price) || 0), 50000))}
                          value={priceRange[0]}
                          onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600 block mb-2">Max: Rs. {priceRange[1]}</label>
                        <input
                          type="range"
                          min="0"
                          max={Math.ceil(Math.max(...products.map(p => parseFloat(p.price) || 0), 50000))}
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </aside>

              {/* Main Content */}
              <div className="md:col-span-3">
                {error && (
                  <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
                    {error}
                  </div>
                )}

                {/* Sort Options */}
                <div className="mb-8 flex justify-between items-center">
                  <p className="text-gray-600">
                    Showing <span className="font-bold">{filteredProducts.length}</span> results
                  </p>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none bg-white border border-primary text-primary px-4 py-2 rounded-lg pr-8 focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      <option value="newest">Newest</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Top Rated</option>
                    </select>
                    <ChevronDown
                      size={18}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-primary"
                    />
                  </div>
                </div>

                {/* Products Grid */}
                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        badge={null}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <p className="text-gray-600 text-lg">No products found matching your criteria</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ShopPage;
