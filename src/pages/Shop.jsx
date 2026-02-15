import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductGrid from '../components/product/ProductGrid';
import ProductFilters from '../components/product/ProductFilters';
import { useProducts } from '../hooks/useProducts';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    priceRange: '',
    size: '',
    rating: '',
    sortBy: 'newest'
  });

  const { products, loading } = useProducts(filters);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    
    // Update URL params
    if (newFilters.category) {
      setSearchParams({ category: newFilters.category });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-8 md:py-12">
      {/* Page Header */}
      <div className="mb-8 md:mb-12">
        <h1 className="font-serif text-3xl md:text-5xl font-semibold mb-2">
          {filters.category 
            ? filters.category.charAt(0).toUpperCase() + filters.category.slice(1)
            : 'All Products'
          }
        </h1>
        <p className="text-stone-600">
          {loading ? 'Loading...' : `${products.length} product${products.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Filters */}
      <ProductFilters 
        onFilterChange={handleFilterChange}
        currentFilters={filters}
      />

      {/* Products Grid */}
      <ProductGrid products={products} loading={loading} />
    </div>
  );
};

export default Shop;