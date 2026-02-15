import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useWishlist } from '../hooks/useWishlist';
import { Button } from '../components/ui';
import { ProductGridSkeleton } from '../components/ui/Skeleton';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      if (wishlist.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const productPromises = wishlist.map(async (productId) => {
          const productDoc = await getDoc(doc(db, 'products', productId));
          if (productDoc.exists()) {
            return { id: productDoc.id, ...productDoc.data() };
          }
          return null;
        });

        const fetchedProducts = await Promise.all(productPromises);
        setProducts(fetchedProducts.filter(p => p !== null));
      } catch (error) {
        console.error('Error fetching wishlist products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistProducts();
  }, [wishlist]);

  if (loading) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <h1 className="font-serif text-3xl md:text-4xl font-semibold mb-8">Saved Items</h1>
        <ProductGridSkeleton count={4} />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-16 text-center">
        <svg
          className="w-20 h-20 mx-auto text-stone-300 mb-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-4">
          No saved items yet
        </h2>
        <p className="text-stone-600 mb-8">
          Start saving products you love to view them here
        </p>
        <Link to="/shop">
          <Button variant="primary" size="lg">
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="font-serif text-3xl md:text-4xl font-semibold mb-2">
          Saved Items
        </h1>
        <p className="text-stone-600">
          {products.length} item{products.length !== 1 ? 's' : ''} saved
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <div key={product.id} className="group">
            <Link to={`/product/${product.id}`} className="block mb-3">
              <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden mb-4">
                <img
                  src={product.images?.[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <h3 className="font-medium text-base md:text-lg mb-2 line-clamp-2">
                {product.name}
              </h3>

              {product.averageRating > 0 && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.averageRating) ? 'text-yellow-500' : 'text-stone-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs text-stone-500">({product.reviewCount})</span>
                </div>
              )}

              <p className="text-lg font-medium mb-3">
                ₦{product.price.toLocaleString('en-NG')}
              </p>
            </Link>

            <button
              onClick={() => removeFromWishlist(product.id)}
              className="text-sm text-red-600 hover:text-red-800 transition-colors"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;