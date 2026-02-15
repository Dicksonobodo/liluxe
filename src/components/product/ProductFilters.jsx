import React, { useState } from 'react';
import { Button } from '../ui';

const ProductFilters = ({ onFilterChange, currentFilters = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: currentFilters.category || '',
    priceRange: currentFilters.priceRange || '',
    size: currentFilters.size || '',
    rating: currentFilters.rating || '',
    sortBy: currentFilters.sortBy || 'newest'
  });

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'clothes', label: 'Clothes' },
    { value: 'bags', label: 'Bags' },
    { value: 'shoes', label: 'Shoes' }
  ];

  const priceRanges = [
    { value: '', label: 'Any Price' },
    { value: '0-10000', label: '₦0 - ₦10,000' },
    { value: '10000-25000', label: '₦10,000 - ₦25,000' },
    { value: '25000-50000', label: '₦25,000 - ₦50,000' },
    { value: '50000+', label: '₦50,000+' }
  ];

  const sizes = [
    { value: '', label: 'All Sizes' },
    { value: 'S', label: 'Small' },
    { value: 'M', label: 'Medium' },
    { value: 'L', label: 'Large' },
    { value: 'XL', label: 'X-Large' }
  ];

  const ratings = [
    { value: '', label: 'Any Rating' },
    { value: '4', label: '4+ Stars' },
    { value: '3', label: '3+ Stars' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      category: '',
      priceRange: '',
      size: '',
      rating: '',
      sortBy: 'newest'
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const activeFilterCount = Object.values(filters).filter(v => v && v !== 'newest').length;

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="md:hidden mb-6">
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-2 bg-stone-900 text-white text-xs rounded-full px-2 py-0.5">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>

      {/* Filters Panel */}
      <div className={`${
        isOpen ? 'block' : 'hidden'
      } md:block bg-white border border-stone-200 p-4 md:p-6 mb-6 md:mb-8`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xs uppercase tracking-wider font-semibold">Filters</h3>
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-xs text-stone-600 hover:text-stone-900 underline"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Filter Groups */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Category */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-600 mb-2 font-medium">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:border-stone-900 text-sm"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-600 mb-2 font-medium">
              Price
            </label>
            <select
              value={filters.priceRange}
              onChange={(e) => handleFilterChange('priceRange', e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:border-stone-900 text-sm"
            >
              {priceRanges.map(range => (
                <option key={range.value} value={range.value}>{range.label}</option>
              ))}
            </select>
          </div>

          {/* Size */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-600 mb-2 font-medium">
              Size
            </label>
            <select
              value={filters.size}
              onChange={(e) => handleFilterChange('size', e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:border-stone-900 text-sm"
            >
              {sizes.map(size => (
                <option key={size.value} value={size.value}>{size.label}</option>
              ))}
            </select>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-600 mb-2 font-medium">
              Rating
            </label>
            <select
              value={filters.rating}
              onChange={(e) => handleFilterChange('rating', e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:border-stone-900 text-sm"
            >
              {ratings.map(rating => (
                <option key={rating.value} value={rating.value}>{rating.label}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-600 mb-2 font-medium">
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:border-stone-900 text-sm"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Mobile Close Button */}
        <div className="md:hidden mt-4">
          <Button
            variant="primary"
            className="w-full"
            onClick={() => setIsOpen(false)}
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </>
  );
};

export default ProductFilters;