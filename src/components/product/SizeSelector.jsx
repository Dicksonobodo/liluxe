import React from 'react';

const SizeSelector = ({ sizes, selectedSize, onSelectSize, error }) => {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-stone-600 mb-3 font-medium">
        Select Size
      </label>
      
      <div className="grid grid-cols-5 md:grid-cols-8 gap-1">
        {sizes.map(({ size, stock }) => {
          const isOutOfStock = stock === 0;
          const isSelected = selectedSize === size;
          
          return (
            <button
              key={size}
              onClick={() => !isOutOfStock && onSelectSize(size)}
              disabled={isOutOfStock}
              className={`
                  w-8 h-8 border text-sm font-medium transition-all rounded flex items-center justify-center

                ${isSelected 
                  ? 'border-stone-900 bg-stone-900 text-white' 
                  : 'border-stone-300 hover:border-stone-900'
                }
                ${isOutOfStock 
                  ? 'opacity-30 cursor-not-allowed line-through' 
                  : 'cursor-pointer'
                }
              `}
            >
              {size}
            </button>
          );
        })}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
      
      {selectedSize && (
        <p className="mt-3 text-sm text-stone-600">
          {sizes.find(s => s.size === selectedSize)?.stock} in stock
        </p>
      )}
    </div>
  );
};

export default SizeSelector;