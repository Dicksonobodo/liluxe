import React from 'react';
import { motion } from 'framer-motion';
import { ease } from './ui/motion';

const PageLoader = () => {
  return (
    <motion.div
      className="fixed inset-0 bg-white z-[60] flex items-center justify-center"
      exit={{ opacity: 0, transition: { duration: 0.5, ease } }}
    >
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12, transition: { duration: 0.4, ease } }}
        transition={{ duration: 0.6, ease }}
      >
        {/* Logo or Brand Name */}
        <motion.h1
          className="font-serif text-4xl font-semibold mb-8 text-stone-900"
          initial={{ letterSpacing: '0.3em', opacity: 0 }}
          animate={{ letterSpacing: '0.05em', opacity: 1 }}
          transition={{ duration: 1, ease }}
        >
          LILUXE
        </motion.h1>
        
        {/* Spinner */}
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 border-4 border-stone-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-stone-900 rounded-full border-t-transparent animate-spin"></div>
        </div>
        
        <p className="text-sm text-stone-600 uppercase tracking-wider">
          Loading...
        </p>
      </motion.div>
    </motion.div>
  );
};

export default PageLoader;