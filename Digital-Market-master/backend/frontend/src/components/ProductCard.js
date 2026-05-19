import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import Badge from './Badge';
import { useCart } from '../context/CartContext';
import { apiUtils } from '../api/api';

const ProductCard = ({ product, badge = null, imageHeight = 'h-60' }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, 1);
  };

  return (
    <Link to={`/product/${product._id}`}>
      <div className="product-card bg-white rounded-2xl overflow-hidden shadow-base hover:shadow-lg transition-all duration-300 group">
        {/* Image Container */}
        <div className={`relative ${imageHeight} bg-beige overflow-hidden`}>
          <img
            src={apiUtils.getImageUrl(product.image)}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Badge */}
          {badge && (
            <div className="absolute top-4 left-4">
              <Badge variant={badge.variant}>{badge.text}</Badge>
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsWishlisted(!isWishlisted);
            }}
            className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all"
          >
            <Heart
              size={20}
              className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-primary'}
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category/Brand */}
          {product.category && (
            <p className="text-xs text-taupe uppercase tracking-wide font-semibold mb-2">
              {product.category}
            </p>
          )}

          {/* Product Name */}
          <h3 className="font-serif text-lg text-primary font-bold mb-2 line-clamp-2 group-hover:text-accent transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-2 mb-3">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}>
                    ★
                  </span>
                ))}
              </div>
              <span className="text-xs text-taupe">({product.numReviews || 0})</span>
            </div>
          )}

          {/* Stock Status */}
          <p className={`text-xs font-semibold mb-3 ${product.countInStock > 0 ? 'text-sage' : 'text-red-500'}`}>
            {product.countInStock > 0 ? `${product.countInStock} in stock` : 'Out of stock'}
          </p>

          {/* Price */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-primary">Rs. {product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-taupe line-through">Rs. {product.originalPrice}</span>
              )}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.countInStock === 0}
            className="w-full bg-accent text-primary py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            <ShoppingCart size={18} />
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
