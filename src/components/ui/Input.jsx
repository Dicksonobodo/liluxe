import React from 'react';

const Input = ({ 
  label, 
  error, 
  className = '', 
  type = 'text',
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs uppercase tracking-wider text-stone-600 mb-2 font-medium">
          {label}
        </label>
      )}
      <input
        type={type}
        className={`w-full px-4 py-3 border ${
          error ? 'border-red-500' : 'border-stone-300'
        } focus:outline-none focus:border-stone-900 transition-colors duration-200 bg-white ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;