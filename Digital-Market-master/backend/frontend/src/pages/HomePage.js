import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Truck, RotateCcw, Headphones } from 'lucide-react';
import { Navbar, ProductCard, CategoryCard, TestimonialCard, Button, Loading } from '../components';
import Footer from '../components/Footer';
import { productAPI } from '../api/api';

const CATEGORIES = [
  { title: 'Women', slug: 'women', icon: null },
  { title: 'Men', slug: 'men', icon: null },
  { title: 'Shoes', slug: 'shoes', icon: null },
  { title: 'Occasion', slug: 'occasion', icon: null },
];

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get all products
        const data = await productAPI.getProducts('', 1);
        const products = data.products || [];
        
        // Set featured products (first 6)
        setFeaturedProducts(products.slice(0, 6));
        setFilteredProducts(products);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message || 'Failed to load products');
        // Set empty arrays instead of failing
        setFeaturedProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleFilter = (filter) => {
    setActiveFilter(filter);
    if (filter === 'All') {
      setFilteredProducts(filteredProducts);
    } else {
      setFilteredProducts(
        filteredProducts.filter((p) => p.category && p.category.toLowerCase() === filter.toLowerCase())
      );
    }
  };

  return (
    <div className="min-h-screen bg-light flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-beige to-mint py-20 md:py-32">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Left Content */}
              <div className="animate-slideUp">
                <p className="text-accent uppercase tracking-widest font-bold text-sm mb-4">
                  New Arrival
                </p>
                <h1 className="font-serif text-4xl md:text-6xl font-bold text-primary mb-4 leading-tight">
                  Sustainably Stylish.
                  <br />
                  Naturally You
                </h1>
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                  Discover premium, eco-friendly fashion that doesn't compromise on style. Every piece
                  is carefully curated for the conscious consumer.
                </p>
                <Link to="/shop">
                  <button className="btn-primary flex items-center gap-2 group">
                    Explore Products
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </div>

              {/* Right Image */}
              <div className="relative animate-fadeIn">
                <div className="absolute inset-0 bg-gradient-to-br from-lavender to-mint rounded-3xl blur-2xl opacity-40"></div>
                <img
                  src="/images/watch.avif"
                  alt="Hero"
                  className="relative w-full h-auto rounded-3xl shadow-xl hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20">
          <div className="container-custom">
            <h2 className="font-serif text-4xl font-bold text-center mb-16">Shop by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {CATEGORIES.map((category) => (
                <CategoryCard key={category.slug} {...category} />
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-20 bg-gradient-to-b from-white to-beige">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl font-bold mb-4">Featured Collection</h2>
              <p className="text-gray-600 text-lg">Handpicked pieces for every occasion</p>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-16">
                <Loading />
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <p className="text-red-600">{error}</p>
              </div>
            ) : featuredProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {featuredProducts.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      badge={null}
                    />
                  ))}
                </div>
                <div className="text-center mt-16">
                  <Link to="/shop">
                    <Button variant="outline" size="lg">
                      View All Products
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-600">No products available at the moment</p>
              </div>
            )}
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Truck, title: 'Fast Shipping', description: 'Free shipping on orders over Rs. 5000' },
                { icon: RotateCcw, title: 'Easy Returns', description: '30-day return policy, no questions asked' },
                { icon: Headphones, title: '24/7 Support', description: 'Dedicated customer service team' },
              ].map(({ icon: Icon, title, description }, idx) => (
                <div key={idx} className="card-base p-8 text-center hover:shadow-xl transition-shadow">
                  <Icon size={48} className="text-accent mx-auto mb-4" />
                  <h3 className="font-bold text-xl mb-2">{title}</h3>
                  <p className="text-gray-600">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Favorites Picks with Filters */}
        {filteredProducts.length > 0 && (
          <section className="py-20 bg-gradient-to-b from-beige to-white">
            <div className="container-custom">
              <h2 className="font-serif text-4xl font-bold text-center mb-12">Your Favorite Picks</h2>

              {/* Filter Buttons */}
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                {['All', 'Women', 'Men', 'Shoes'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => handleFilter(filter)}
                    className={`px-6 py-2 rounded-full font-semibold transition-all ${
                      activeFilter === filter
                        ? 'bg-primary text-light shadow-lg'
                        : 'bg-white text-primary border-2 border-primary hover:bg-primary hover:text-light'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.slice(0, 8).map((product) => (
                  <ProductCard key={product._id} product={product} imageHeight="h-48" />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Testimonials */}
        <section className="py-20">
          <div className="container-custom">
            <h2 className="font-serif text-4xl font-bold text-center mb-4">What Our Customers Say</h2>
            <p className="text-center text-gray-600 mb-16 text-lg">
              Join thousands of satisfied customers who love our sustainable fashion
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: 'Sarah Quinn',
                  role: 'Fashion Blogger',
                  image: '/images/watch.avif',
                  quotes:
                    'The quality is exceptional and I love that the brand cares about sustainability. Definitely my go-to!',
                  rating: 5,
                },
                {
                  name: 'Michael Chen',
                  role: 'Business Professional',
                  image: '/images/watch.avif',
                  quotes:
                    'Perfect fit, great materials, and fast shipping. This is now my favorite online store.',
                  rating: 5,
                },
                {
                  name: 'Emma Rodriguez',
                  role: 'Student',
                  image: '/images/watch.avif',
                  quotes:
                    "Affordable luxury that doesn't feel guilty. I recommend MUSE to all my friends!",
                  rating: 4,
                },
              ].map((testimonial, idx) => (
                <TestimonialCard key={idx} {...testimonial} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-20 bg-gradient-to-r from-primary to-secondary text-light">
          <div className="container-custom text-center">
            <h2 className="font-serif text-4xl font-bold mb-4">Ready to Refresh Your Wardrobe?</h2>
            <p className="text-light/80 mb-8 text-lg">
              Subscribe to our newsletter and get 20% off your first purchase
            </p>
            <div className="flex gap-2 max-w-md mx-auto flex-col sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 rounded-lg text-primary focus:outline-none"
              />
              <button className="bg-accent text-primary px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
