import React from 'react';
import { Link } from 'react-router-dom';

// Soft gradients that match the site's earthy/parchment palette
const GRADIENTS = {
  Footwear:    'linear-gradient(135deg, #fdf6ec 0%, #e2b97a 100%)',
  Clothing:    'linear-gradient(135deg, #f0ebe4 0%, #c4a882 100%)',
  Watches:     'linear-gradient(135deg, #eaeef2 0%, #8fa3b8 100%)',
  Accessories: 'linear-gradient(135deg, #f5ede8 0%, #c97f6a 100%)',
};

const FALLBACK = 'linear-gradient(135deg, #F4EFE6 0%, #C59B4E 100%)';

const CategoryCard = ({ title, slug }) => {
  const gradient = GRADIENTS[title] || FALLBACK;

  return (
    <Link to={`/shop?category=${slug}`} className="block">
      <div
        className="relative h-52 rounded-xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-lg transition-shadow duration-300"
        style={{ background: gradient }}
      >
        {/* Hover shimmer overlay */}
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />

        {/* Decorative circle accent */}
        <div
          className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-300"
          style={{ background: 'rgba(197,155,78,0.5)' }}
        />
        <div
          className="absolute -top-6 -left-6 w-20 h-20 rounded-full opacity-10"
          style={{ background: 'rgba(18,22,26,0.3)' }}
        />

        {/* Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
          <h3
            className="font-serif text-2xl font-bold tracking-wide group-hover:scale-105 transition-transform duration-300"
            style={{ color: '#12161A', textShadow: '0 1px 3px rgba(255,255,255,0.4)' }}
          >
            {title}
          </h3>
          <p className="text-sm mt-2 font-medium opacity-60" style={{ color: '#12161A' }}>
            Shop now
          </p>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
