import React from 'react';

const Skeleton = ({ className = '', variant = 'rectangular' }) => {
  const baseStyles = 'animate-pulse bg-stone-200';
  
  const variants = {
    rectangular: 'rounded-none',
    text: 'h-4 rounded',
    circular: 'rounded-full',
  };

  return <div className={`${baseStyles} ${variants[variant]} ${className}`} />;
};

// Product Card Skeleton
export const ProductCardSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="w-full aspect-[3/4]" />
    <div className="space-y-2">
      <Skeleton variant="text" className="w-3/4" />
      <Skeleton variant="text" className="w-1/2" />
    </div>
  </div>
);

// Product Grid Skeleton
export const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

export default Skeleton;