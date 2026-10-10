import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductGrid from '../components/product/ProductGrid';
import { useProducts } from '../hooks/useProducts';
import { Button } from '../components/ui';
import Reveal from '../components/ui/Reveal';
import { fadeUp, stagger } from '../components/ui/motion';

const Home = () => {
  const { products, loading } = useProducts({ sortBy: 'newest' });
  const featuredProducts = products.slice(0, 4); // Show only 4 products

  // Category background images from Firebase Storage
  const categoryImages = {
    clothes: "https://firebasestorage.googleapis.com/v0/b/liluxe-9c1b0.firebasestorage.app/o/categories%2Fnewcloth.webp?alt=media&token=7684a1f2-aba1-460b-96c2-4cfb009d6f52",
    bags: "https://firebasestorage.googleapis.com/v0/b/liluxe-9c1b0.firebasestorage.app/o/categories%2Fnewnewbag.jpg?alt=media&token=044ae65d-16fd-41cc-928d-02ae0dd2416a",
    shoes: "https://firebasestorage.googleapis.com/v0/b/liluxe-9c1b0.firebasestorage.app/o/categories%2Fhershoe.jpg?alt=media&token=c7d490a4-a265-42af-be39-52a08d030d51"
  };

  // Category background images from Firebase Storage
  // Replace these URLs with your actual Firebase Storage URLs
  

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[80vh] bg-stone-100 flex items-center">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 w-full">
          <motion.div
            className="max-w-2xl"
            initial="hidden"
            animate="visible"
            variants={stagger(0.12, 0.15)}
          >
            <motion.h1 variants={fadeUp} className="font-serif text-4xl md:text-6xl lg:text-7xl font-semibold mb-6 leading-tight">
              Luxury Fashion,<br />Redefined
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg md:text-xl text-stone-600 mb-8 leading-relaxed">
              Discover timeless pieces crafted with precision and elegance for the modern individual.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link to="/shop">
                <Button variant="primary" size="lg">
                  Shop Collection
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-screen-xl mx-auto px-4 md:px-6 py-16 md:py-24">
        {/* Kept static: fading these in while their large images load left them blank on some phones */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Clothes */}
          <Link
            to="/shop?category=clothes"
            className="group relative h-96 overflow-hidden"
          >
            {/* Background Image */}
            <img 
              src={categoryImages.clothes}
              alt="Clothes"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1200ms] ease-out"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/40 to-transparent" />
            
            {/* Text */}
            <div className="absolute inset-0 flex items-end p-8">
              <div>
                <h3 className="font-serif text-3xl md:text-4xl font-semibold text-white mb-2">
                  Cloths
                </h3>
                <p className="text-white/90 text-sm uppercase tracking-wider">
                  Explore Collection Here{' '}
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                </p>
              </div>
            </div>
          </Link>

          {/* Bags */}
          <Link
            to="/shop?category=bags"
            className="group relative h-96 overflow-hidden"
          >
            {/* Background Image */}
            <img 
              src={categoryImages.bags}
              alt="Bags"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1200ms] ease-out"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/40 to-transparent" />
            
            {/* Text */}
            <div className="absolute inset-0 flex items-end p-8">
              <div>
                <h3 className="font-serif text-3xl md:text-4xl font-semibold text-white mb-2">
                  Bags
                </h3>
                <p className="text-white/90 text-sm uppercase tracking-wider">
                  Explore Collection Here{' '}
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                </p>
              </div>
            </div>
          </Link>

          {/* Shoes */}
          <Link
            to="/shop?category=shoes"
            className="group relative h-96 overflow-hidden"
          >
            {/* Background Image */}
            <img 
              src={categoryImages.shoes}
              alt="Shoes"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1200ms] ease-out"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/40 to-transparent" />
            
            {/* Text */}
            <div className="absolute inset-0 flex items-end p-8">
              <div>
                <h3 className="font-serif text-3xl md:text-4xl font-semibold text-white mb-2">
                  Shoes
                </h3>
                <p className="text-white/90 text-sm uppercase tracking-wider">
                  Explore Collection Here{' '}
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                </p>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="bg-stone-50 py-16 md:py-24">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6">
          <Reveal className="flex items-center justify-between mb-8 md:mb-12">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-2">
                New Arrivals
              </h2>
              <p className="text-stone-600">Fresh pieces, just landed</p>
            </div>
            <Link to="/shop">
              <Button variant="ghost">
                View All
              </Button>
            </Link>
          </Reveal>

          <ProductGrid products={featuredProducts} loading={loading} />
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-screen-xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <Reveal className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-5xl font-semibold mb-6">
            About LILUXE
          </h2>
          <p className="text-lg text-stone-600 leading-relaxed mb-8">
            We believe in empowering women through premium luxe fashion that embodies confidence, elegance, and soft-life sophistication. From premium fabrics to meticulous attention to detail, LILUXE represents the pinnacle of modern luxury.
          </p>
          <Link to="/shop">
            <Button variant="secondary">
              Explore Our Story
            </Button>
          </Link>
        </Reveal>
      </section>
    </div>
  );
};

export default Home;