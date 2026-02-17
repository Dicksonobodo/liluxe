import React from 'react';
import { Link } from 'react-router-dom';
import ProductGrid from '../components/product/ProductGrid';
import { useProducts } from '../hooks/useProducts';
import { Button } from '../components/ui';

const Home = () => {
  const { products, loading } = useProducts({ sortBy: 'newest' });
  const featuredProducts = products.slice(0, 4); // Show only 4 products

  // Category background images from Firebase Storage
  const categoryImages = {
    clothes: "https://firebasestorage.googleapis.com/v0/b/liluxe-9c1b0.firebasestorage.app/o/categories%2Fnewcloth.webp?alt=media&token=7684a1f2-aba1-460b-96c2-4cfb009d6f52",
    bags: "https://firebasestorage.googleapis.com/v0/b/liluxe-9c1b0.firebasestorage.app/o/categories%2Fnewbag.jpg?alt=media&token=16f4d971-d3b3-43a9-9cd8-c4be7e33c79a",
    shoes: "https://firebasestorage.googleapis.com/v0/b/liluxe-9c1b0.firebasestorage.app/o/categories%2Fnewshoes.webp?alt=media&token=3f966e65-5bab-4ed1-b495-81794aaa86f7"
  };

  // Category background images from Firebase Storage
  // Replace these URLs with your actual Firebase Storage URLs
  

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[80vh] bg-stone-100 flex items-center">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 w-full">
          <div className="max-w-2xl">
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-semibold mb-6 leading-tight">
              Luxury Fashion,<br />Redefined
            </h1>
            <p className="text-lg md:text-xl text-stone-600 mb-8 leading-relaxed">
              Discover timeless pieces crafted with precision and elegance for the modern individual.
            </p>
            <Link to="/shop">
              <Button variant="primary" size="lg">
                Shop Collection
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-screen-xl mx-auto px-4 md:px-6 py-16 md:py-24">
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
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/40 to-transparent" />
            
            {/* Text */}
            <div className="absolute inset-0 flex items-end p-8">
              <div>
                <h3 className="font-serif text-3xl md:text-4xl font-semibold text-white mb-2">
                  Clothes
                </h3>
                <p className="text-white/90 text-sm uppercase tracking-wider">
                  Explore Collection Here →
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
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                  Explore Collection Here →
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
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                  Explore Collection Here →
                </p>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="bg-stone-50 py-16 md:py-24">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between mb-8 md:mb-12">
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
          </div>

          <ProductGrid products={featuredProducts} loading={loading} />
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-screen-xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-5xl font-semibold mb-6">
            About LILUXE
          </h2>
          <p className="text-lg text-stone-600 leading-relaxed mb-8">
            We believe in quality over quantity. Each piece in our collection is carefully curated to bring you timeless elegance and unmatched craftsmanship. From premium fabrics to meticulous attention to detail, LILUXE represents the pinnacle of modern luxury.
          </p>
          <Link to="/shop">
            <Button variant="secondary">
              Explore Our Story
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;