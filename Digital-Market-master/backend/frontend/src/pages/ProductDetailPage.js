import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Star, Minus, Plus, Heart, Share2 } from 'lucide-react';
import { Navbar, Button, Loading } from '../components';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
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
  const { isInWishlist, toggleWishlist, wishlistItems } = useWishlist();
  const { isAuthenticated } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  // Review management states
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: '',
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  
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

  // Update wishlist state whenever wishlist context changes
  useEffect(() => {
    if (product) {
      setIsWishlisted(isInWishlist(product._id));
    }
  }, [wishlistItems, product, isInWishlist]);

  // Fetch product reviews
  const fetchReviews = async () => {
    try {
      setLoadingReviews(true);
      const response = await productAPI.getReviews(id);
      setReviews(response || []);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  };

  // Fetch reviews when product changes or tab becomes active
  useEffect(() => {
    if (product && activeTab === 'reviews') {
      fetchReviews();
    }
  }, [id, activeTab, product]);

  // Submit review handler
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('Please login to submit a review');
      return;
    }

    if (!reviewForm.comment.trim()) {
      setReviewError('Please write a comment');
      return;
    }

    try {
      setSubmittingReview(true);
      setReviewError(null);
      setReviewSuccess(false);

      await productAPI.createReview(id, reviewForm.rating, reviewForm.comment);

      // Reset form
      setReviewForm({ rating: 5, comment: '' });
      setReviewSuccess(true);

      // Refetch reviews
      await fetchReviews();

      // Clear success message after 3 seconds
      setTimeout(() => setReviewSuccess(false), 3000);
    } catch (err) {
      setReviewError(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const getAvailableSizes = () => {
    if (product && product.available_sizes) {
      return product.available_sizes.split(',').map(s => s.trim());
    }
    return [];
  };

  // Get color variants for specific products (mainly for shoes and apparel)
  const getColorVariants = () => {
    if (!product) return [];
    
    // Check if product name contains "Shoes" or "shoes"
    if (product.name && product.name.toLowerCase().includes('shoes')) {
      return [
        { name: 'Default', color: '#94A3B8', image: '/images/Nike_green.avif', available: true },
        { name: 'Red', color: '#EF4444', image: product.image, available: false },
        { name: 'Gray', color: '#6B7280', image: product.image, available: false },
        { name: 'White', color: '#FFFFFF', image: '/images/Nike_white.avif', available: true }
      ];
    }
    
    // Expand for other clothing items (shirts only)
    if (product.name && product.name.toLowerCase().includes('shirt')) {
      return [
        { name: 'Default', color: '#94A3B8', image: product.image, available: true },
        { name: 'Red', color: '#EF4444', image: product.image, available: false },
        { name: 'Gray', color: '#6B7280', image: product.image, available: false },
        { name: 'White', color: '#FFFFFF', image: product.image, available: false }
      ];
    }
    
    return [];
  };

  const getAdditionalImages = () => {
    let images = [];
    
    // Get additional images from product
    if (product && product.additional_images) {
      try {
        images = JSON.parse(product.additional_images);
      } catch {
        images = [];
      }
    }
    
    // Add color variant images for shoes
    if (product && product.name && product.name.toLowerCase().includes('shoes')) {
      const colorImages = getColorVariants()
        .filter(color => color.image && color.image !== product.image)
        .map(color => color.image);
      images = [...new Set([...images, ...colorImages])]; // Remove duplicates
    }
    
    return images;
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
                      ? 'text-primary'
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
                  <h3 className="font-bold text-2xl mb-8">Customer Reviews</h3>

                  {/* Success Message */}
                  {reviewSuccess && (
                    <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                      ✓ Review submitted successfully!
                    </div>
                  )}

                  {/* Error Message */}
                  {reviewError && (
                    <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                      ✗ {reviewError}
                    </div>
                  )}

                  {/* Add Review Form */}
                  <div className="mb-12 p-6 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-lg mb-4">Write a Review</h4>
                    {!isAuthenticated ? (
                      <p className="text-gray-600">
                        <Link to="/login" className="text-primary hover:underline">
                          Login
                        </Link>
                        {' '}to write a review
                      </p>
                    ) : (
                      <form onSubmit={handleSubmitReview} className="space-y-4">
                        {/* Rating */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rating
                          </label>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                className="focus:outline-none transition-transform hover:scale-110"
                              >
                                <Star
                                  size={32}
                                  className={
                                    star <= reviewForm.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Comment */}
                        <div>
                          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                            Your Comment
                          </label>
                          <textarea
                            id="comment"
                            value={reviewForm.comment}
                            onChange={(e) =>
                              setReviewForm({ ...reviewForm, comment: e.target.value })
                            }
                            placeholder="Share your experience with this product..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                            rows="4"
                          />
                        </div>

                        {/* Submit Button */}
                        <button
                          type="submit"
                          disabled={submittingReview}
                          className="w-full bg-primary text-white py-2 px-4 rounded-lg font-semibold hover:bg-primary-dark disabled:opacity-50 transition-colors"
                        >
                          {submittingReview ? 'Submitting...' : 'Submit Review'}
                        </button>
                      </form>
                    )}
                  </div>

                  {/* Reviews List */}
                  <div className="space-y-6">
                    <h4 className="font-semibold text-lg">
                      {reviews.length > 0
                        ? `${reviews.length} ${reviews.length === 1 ? 'Review' : 'Reviews'}`
                        : 'No reviews yet'}
                    </h4>

                    {loadingReviews ? (
                      <div className="flex justify-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    ) : reviews.length > 0 ? (
                      reviews.map((review) => (
                        <div
                          key={review._id}
                          className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h5 className="font-semibold text-gray-900">
                                {review.name || 'Anonymous'}
                              </h5>
                              <p className="text-sm text-gray-500">
                                {review.createdAt
                                  ? new Date(review.createdAt).toLocaleDateString()
                                  : 'Recently'}
                              </p>
                            </div>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={16}
                                  className={
                                    i < (review.rating || 0)
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600">
                        No reviews yet. Be the first to review this product!
                      </p>
                    )}
                  </div>
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
