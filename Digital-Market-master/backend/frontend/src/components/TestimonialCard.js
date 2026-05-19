import React from 'react';
import { Star } from 'lucide-react';

const TestimonialCard = ({ image, name, role, quotes, rating = 5 }) => {
  return (
    <div className="card-base p-8 text-center hover:shadow-xl transition-shadow">
      {/* Image */}
      <img
        src={image}
        alt={name}
        className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
      />

      {/* Stars */}
      <div className="flex justify-center gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>

      {/* Quote */}
      <p className="text-gray-600 italic mb-4 leading-relaxed">
        "{quotes}"
      </p>

      {/* Author */}
      <h4 className="font-bold text-primary mb-1">{name}</h4>
      <p className="text-sm text-taupe">{role}</p>
    </div>
  );
};

export default TestimonialCard;
