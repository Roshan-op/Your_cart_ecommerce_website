import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Star, Minus, Plus, Heart, Share2 } from 'lucide-react';
import { Navbar, Button, Loading } from '../components';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { productAPI } from '../api/api';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  // New state for sizes, gender, images, and colors
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [colorUnavailableMessage, setColorUnavailableMessage] = useState("");

  // Fetch product details on component mount
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productAPI.getProduct(id);
        setProduct(data);
        setIsWishlisted(isInWishlist(id));
        setError(null);
        
        // Set main image
        setMainImage(data.image);
        
        // Set first available size as default
        if (data.available_sizes) {
          const sizes = data.available_sizes.split(',').map(s => s.trim());
          if (sizes.length > 0) {
            setSelectedSize(sizes[0]);
          }
        }
        
        // Set gender
        if (data.gender) {
          setSelectedGender(data.gender);
        }

        // Set default color if variants exist
        const colorVariants = data.name && data.name.toLowerCase().includes('shoes') 
          ? [
              { name: 'Default', color: '#94A3B8', image: data.image, available: true },
              { name: 'Red', color: '#EF4444', image: data.image, available: false },
              { name: 'Gray', color: '#6B7280', image: data.image, available: false },
              { name: 'White', color: '#FFFFFF', image: data.image, available: false }
            ]
          : [];
        
        if (colorVariants.length > 0) {
          setSelectedColor('Default');
          setColorUnavailableMessage('');
        }

        // Fetch recommendations
        try {
          setLoadingRecommendations(true);
          const recs = await productAPI.getRecommendations(id);
          console.log('Recommendations received:', recs);
          if (Array.isArray(recs)) {
            setRecommendations(recs);
          } else if (recs && recs.length > 0) {
            setRecommendations(recs);
          } else {
            setRecommendations([]);
          }
        } catch (recErr) {
          console.log('Recommendations not available:', recErr);
          setRecommendations([]);
        } finally {
          setLoadingRecommendations(false);
        }
      } catch (err) {
        setError(err.message || 'Failed to load product');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, isInWishlist]);

  const getAvailableSizes = () => {
    if (product && product.available_sizes) {
      return product.available_sizes.split(',').map(s => s.trim());
    }
    return [];
  };

  const getAdditionalImages = () => {
    if (product && product.additional_images) {
      try {
        return JSON.parse(product.additional_images);
      } catch {
        return [];
      }
    }
    return [];
  };

  // Get color variants for specific products (mainly for shoes and apparel)
  const getColorVariants = () => {
    if (!product) return [];
    
    // Check if product name contains "Shoes" or "shoes"
    if (product.name && product.name.toLowerCase().includes('shoes')) {
      return [
        { name: 'Default', color: '#94A3B8', image: product.image, available: true },
        { name: 'Red', color: '#EF4444', image: product.image, available: false },
        { name: 'Gray', color: '#6B7280', image: product.image, available: false },
        { name: 'White', color: '#FFFFFF', image: product.image, available: false }
      ];
    }
    
    // Expand for other clothing items
    if (product.name && (product.name.toLowerCase().includes('shirt') || product.name.toLowerCase().includes('jacket'))) {
      return [
        { name: 'Default', color: '#94A3B8', image: product.image, available: true },
        { name: 'Red', color: '#EF4444', image: product.image, available: false },
        { name: 'Gray', color: '#6B7280', image: product.image, available: false },
        { name: 'White', color: '#FFFFFF', image: product.image, available: false }
      ];
    }
    
    return [];
  };

  const genderDisplay = {
    'male': '👨 Male',
    'female': '👩 Female',
    'both': '👥 Unisex/Both'
  };

  const handleAddToCart = () => {
    if (product) {
      // Check if size is required
      if (getAvailableSizes().length > 0 && !selectedSize) {
        alert('⚠️ Please select a size');
        return;
      }
      // Check if color is required
      if (getColorVariants().length > 0 && !selectedColor) {
        alert('⚠️ Please select a color');
        return;
      }
      
      // Verify selected color is available
      const selectedColorOption = getColorVariants().find(c => c.name === selectedColor);
      if (selectedColorOption && !selectedColorOption.available) {
        alert(`⚠️ ${selectedColor} color is not available at the moment`);
        return;
      }
      
      addToCart(product, quantity, selectedSize, selectedGender, selectedColor);
      // Show confirmation
      alert(`✓ Added ${quantity} ${quantity > 1 ? 'items' : 'item'} (${selectedColor || 'default'}) to cart!`);
      // Reset quantity
      setQuantity(1);
    }
  };

  const handleWishlistToggle = () => {
    if (product) {
      toggleWishlist(product);
      setIsWishlisted(!isWishlisted);
    }
  };

  // Render loading state
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

  // Render error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-light flex flex-col">
        <Navbar />
        <main className="flex-grow py-12">
          <div className="container-custom">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-primary mb-4">Product Not Found</h1>
              <p className="text-gray-600 mb-8">{error || 'The product you are looking for does not exist.'}</p>
              <Link to="/shop" className="btn btn-primary">Back to Shop</Link>
            </div>
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
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8 text-sm text-gray-600">
            <Link to="/" className="hover:text-accent">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-accent">Shop</Link>
            <span>/</span>
            <span className="text-primary">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            {/* Image Section */}
            <div>
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-auto rounded-2xl shadow-lg"
              />
              <div className="flex gap-4 mt-4">
                <img
                  src={product.image}
                  alt="Main"
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer transition-all ${mainImage === product.image ? 'ring-2 ring-accent' : 'hover:ring-2 ring-accent'}`}
                  onClick={() => setMainImage(product.image)}
                />
                {getAdditionalImages().map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`View ${i + 1}`}
                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer transition-all ${mainImage === img ? 'ring-2 ring-accent' : 'hover:ring-2 ring-accent'}`}
                    onClick={() => setMainImage(img)}
                  />
                ))}
              </div>
            </div>

            {/* Details Section */}
            <div>
              {/* Category & Badge */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-accent uppercase tracking-widest font-bold text-sm">
                  {product.category || 'Uncategorized'}
                </p>
                {product.gender && (
                  <span className="text-lg font-semibold bg-beige px-3 py-1 rounded-lg">
                    {genderDisplay[product.gender] || genderDisplay['both']}
                  </span>
                )}
              </div>

              {/* Title & Rating */}
              <h1 className="font-serif text-4xl font-bold text-primary mb-4">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={i < Math.floor(product.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {product.rating || 0} ({product.numReviews || 0} reviews)
                </span>
              </div>

              {/* Pricing */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-bold text-primary">
                    Rs. {product.price || 0}
                  </span>
                </div>
                <p className="text-green-600 font-semibold mt-2">
                  In stock: {product.countInStock || 0} items
                </p>
              </div>

              {/* Stock Status */}
              <p className={`font-semibold mb-6 ${product.countInStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.countInStock > 0
                  ? `${product.countInStock} in stock`
                  : 'Out of stock'}
              </p>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-primary font-semibold">Quantity:</span>
                <div className="flex items-center border border-primary rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-beige transition-colors"
                  >
                    <Minus size={20} />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center border-0 focus:outline-none"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.countInStock || 1, quantity + 1))}
                    className="p-2 hover:bg-beige transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              {/* Size Selection */}
              {getAvailableSizes().length > 0 && (
                <div className="mb-6">
                  <span className="text-primary font-semibold block mb-3">Select Size:</span>
                  <div className="flex flex-wrap gap-2">
                    {getAvailableSizes().map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                          selectedSize === size
                            ? 'bg-accent text-white ring-2 ring-offset-2 ring-accent'
                            : 'border-2 border-primary text-primary hover:bg-beige'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {getColorVariants().length > 0 && (
                <div className="mb-6">
                  <span className="text-primary font-semibold block mb-3">Select Color:</span>
                  <div className="flex flex-wrap gap-3">
                    {getColorVariants().map((colorOption) => (
                      <button
                        key={colorOption.name}
                        onClick={() => {
                          if (colorOption.available) {
                            setSelectedColor(colorOption.name);
                            setMainImage(colorOption.image);
                            setColorUnavailableMessage('');
                          } else {
                            setColorUnavailableMessage(`${colorOption.name} is not available at the moment`);
                            setTimeout(() => setColorUnavailableMessage(''), 3000);
                          }
                        }}
                        disabled={!colorOption.available}
                        className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                          selectedColor === colorOption.name
                            ? 'bg-accent text-white ring-2 ring-offset-2 ring-accent'
                            : colorOption.available
                            ? 'border-2 border-primary text-primary hover:bg-beige'
                            : 'border-2 border-gray-300 text-gray-400 cursor-not-allowed opacity-60'
                        }`}
                      >
                        {/* Color Circle Indicator */}
                        <div
                          className={`w-6 h-6 rounded-full border-2 ${
                            !colorOption.available ? 'opacity-50' : ''
                          }`}
                          style={{
                            backgroundColor: colorOption.color,
                            borderColor: colorOption.color === '#FFFFFF' ? '#000' : colorOption.color,
                          }}
                        />
                        {colorOption.name}
                        {!colorOption.available && (
                          <span className="text-xs ml-1 opacity-75">N/A</span>
                        )}
                      </button>
                    ))}
                  </div>
                  {colorUnavailableMessage && (
                    <div className="mt-3 p-3 bg-orange-100 border border-orange-300 rounded-lg text-orange-700 text-sm font-semibold">
                      ⚠️ {colorUnavailableMessage}
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 mb-8">
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  disabled={product.countInStock === 0}
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
                <button
                  onClick={handleWishlistToggle}
                  className="p-4 border-2 border-primary rounded-lg hover:bg-primary hover:text-light transition-all"
                  title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart size={24} fill={isWishlisted ? 'currentColor' : 'none'} />
                </button>
                <button className="p-4 border-2 border-primary rounded-lg hover:bg-primary hover:text-light transition-all">
                  <Share2 size={24} />
                </button>
              </div>

              {/* Features */}
              <div className="bg-beige p-6 rounded-xl">
                <h3 className="font-bold mb-4">Brand: {product.brand || 'Not specified'}</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Product ID: {product._id}</li>
                  <li>✓ Category: {product.category}</li>
                  <li>✓ Authentic Product</li>
                  <li>✓ Secure Payment</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="mb-16">
            <div className="flex border-b border-gray-200 mb-8">
              {['description', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 font-semibold capitalize transition-colors ${
                    activeTab === tab
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-600 hover:text-primary'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div>
              {activeTab === 'description' && (
                <div className="prose max-w-none">
                  <h3 className="text-xl font-bold text-primary mb-4">About this product</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {product.description || 'No description available for this product.'}
                  </p>
                  <div className="mt-6 p-4 bg-beige rounded-lg">
                    <p className="text-gray-600 text-sm">
                      <strong>Product Details:</strong><br />
                      Brand: {product.brand || 'Not specified'}<br />
                      Category: {product.category || 'Not specified'}<br />
                      Stock Available: {product.countInStock} units
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <h3 className="font-bold text-xl mb-6">Customer Reviews</h3>
                  {product.numReviews > 0 ? (
                    <div className="bg-beige p-6 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={24}
                              className={i < Math.floor(product.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                        <div>
                          <p className="font-bold text-lg">{product.rating || 0} out of 5</p>
                          <p className="text-gray-600">Based on {product.numReviews} reviews</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Recommendations Section */}
          {recommendations.length > 0 && (
            <section className="mt-20 pt-12 border-t-2 border-gray-200">
              <h2 className="font-serif text-3xl font-bold text-primary mb-8">
                ✨ Recommended For You
              </h2>
              {loadingRecommendations ? (
                <div className="flex justify-center items-center py-12">
                  <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {recommendations.map((item) => (
                    <div
                      key={item._id}
                      className="card-base overflow-hidden hover:shadow-xl transition-all duration-300"
                    >
                      <Link to={`/product/${item._id}`} className="block overflow-hidden h-48 bg-gray-100">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        />
                      </Link>

                      <div className="p-4">
                        <Link to={`/product/${item._id}`} className="block">
                          <h3 className="font-semibold text-primary hover:text-accent line-clamp-2 mb-2 text-sm">
                            {item.name}
                          </h3>
                        </Link>

                        <div className="flex items-center justify-between mb-3">
                          <p className="text-lg font-bold text-accent">Rs. {item.price}</p>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={i < Math.floor(item.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                              />
                            ))}
                          </div>
                        </div>

                        <p className="text-xs text-gray-600 mb-3">
                          {item.category} • Stock: {item.countInStock}
                        </p>

                        <Link
                          to={`/product/${item._id}`}
                          className="block w-full bg-primary text-white px-3 py-2 rounded-lg hover:shadow-lg transition-all text-center text-sm font-semibold"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;
