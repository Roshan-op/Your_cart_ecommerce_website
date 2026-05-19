import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ image, title, slug, icon: Icon }) => {
  return (
    <Link to={`/shop?category=${slug}`}>
      <div className="card-base p-8 text-center hover:scale-105 transition-transform cursor-pointer group">
        {Icon && (
          <div className="mb-4 flex justify-center">
            <Icon size={48} className="text-accent group-hover:text-secondary transition-colors" />
          </div>
        )}
        {image && (
          <img
            src={image}
            alt={title}
            className="w-24 h-24 object-cover rounded-full mx-auto mb-4 group-hover:scale-110 transition-transform"
          />
        )}
        <h3 className="font-serif text-lg font-bold text-primary group-hover:text-accent transition-colors">
          {title}
        </h3>
      </div>
    </Link>
  );
};

export default CategoryCard;
