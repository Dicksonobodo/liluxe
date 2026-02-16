import React from 'react';
import { Link } from 'react-router-dom';

const CartItem = ({ item, onUpdateQuantity, onRemove, compact = false }) => {
  const { id, name, price, image, selectedSize, selectedColor, quantity, maxStock } = item;

  return (
    <div className={`flex gap-4 ${!compact && 'pb-6 border-b border-stone-200'}`}>
      {/* Image */}
      <Link to={`/product/${id}`} className="flex-shrink-0">
        <div className={`${compact ? 'w-20 h-20' : 'w-24 h-24 md:w-32 md:h-32'} bg-stone-100`}>
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link to={`/product/${id}`}>
          <h3 className={`font-medium ${compact ? 'text-sm' : 'text-base'} mb-1 hover:text-stone-600 transition-colors line-clamp-2`}>
            {name}
          </h3>
        </Link>
        
        <p className="text-sm text-stone-600">
          Size: {selectedSize}
          {selectedColor && ` • Color: ${selectedColor}`}
        </p>
        
        <p className={`font-medium ${compact ? 'text-sm' : 'text-base'}`}>
          ₦{price.toLocaleString('en-NG')}
        </p>

        {!compact && (
          <div className="flex items-center gap-3 mt-3">
            {/* Quantity Controls */}
            <div className="flex items-center border border-stone-300">
              <button
                onClick={() => onUpdateQuantity(id, selectedSize, quantity - 1, selectedColor)}
                className="px-3 py-1 hover:bg-stone-100 transition-colors"
              >
                -
              </button>
              <span className="px-4 py-1 border-x border-stone-300 min-w-[3rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => onUpdateQuantity(id, selectedSize, quantity + 1, selectedColor)}
                disabled={quantity >= maxStock}
                className="px-3 py-1 hover:bg-stone-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>

            {/* Remove Button */}
            <button
              onClick={() => onRemove(id, selectedSize, selectedColor)}
              className="text-sm text-stone-600 hover:text-red-600 transition-colors"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      {/* Price (compact view) or Quantity (desktop) */}
      {compact ? (
        <div className="text-right">
          <p className="text-sm font-medium mb-1">×{quantity}</p>
          <p className="text-sm text-stone-600">
            ₦{(price * quantity).toLocaleString('en-NG')}
          </p>
        </div>
      ) : (
        <div className="text-right hidden md:block">
          <p className="font-medium">
            ₦{(price * quantity).toLocaleString('en-NG')}
          </p>
        </div>
      )}
    </div>
  );
};

export default CartItem;