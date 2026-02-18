import React from 'react';

const PageLoader = () => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="text-center">
        {/* Logo or Brand Name */}
        <h1 className="font-serif text-4xl font-semibold mb-8 text-stone-900">
          LILUXE
        </h1>
        
        {/* Spinner */}
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 border-4 border-stone-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-stone-900 rounded-full border-t-transparent animate-spin"></div>
        </div>
        
        <p className="text-sm text-stone-600 uppercase tracking-wider">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default PageLoader;