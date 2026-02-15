import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { id, name, price, images, category, averageRating, reviewCount } = product;
  
  // Get first image or placeholder
  const mainImage = images && images.length > 0 ? images[0] : '/placeholder.png';

  return (
    <Link to={`/product/${id}`} className="group block">
      {/* Image Container */}
      <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden mb-4">
        <img
          src={mainImage}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm px-3 py-1 text-xs uppercase tracking-wider font-medium">
            {category}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        {/* Name */}
        <h3 className="font-medium text-base md:text-lg group-hover:text-stone-600 transition-colors line-clamp-2">
          {name}
        </h3>

        {/* Rating */}
        {averageRating > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(averageRating) ? 'text-stone-900' : 'text-stone-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-stone-500">({reviewCount})</span>
          </div>
        )}

        {/* Price */}
        <p className="text-lg font-medium">
          ₦{price.toLocaleString('en-NG')}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;