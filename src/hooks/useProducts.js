import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const useProducts = (filters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        let q = query(collection(db, 'products'));

        // Apply category filter
        if (filters.category) {
          q = query(q, where('category', '==', filters.category));
        }

        // Apply rating filter
        if (filters.rating) {
          const minRating = parseInt(filters.rating);
          q = query(q, where('averageRating', '>=', minRating));
        }

        // Apply sorting
        if (filters.sortBy === 'price-low') {
          q = query(q, orderBy('price', 'asc'));
        } else if (filters.sortBy === 'price-high') {
          q = query(q, orderBy('price', 'desc'));
        } else if (filters.sortBy === 'popular') {
          q = query(q, orderBy('reviewCount', 'desc'));
        } else {
          // Default: newest first
          q = query(q, orderBy('createdAt', 'desc'));
        }

        const querySnapshot = await getDocs(q);
        let fetchedProducts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Client-side filtering for price range
        if (filters.priceRange) {
          if (filters.priceRange === '50000+') {
            fetchedProducts = fetchedProducts.filter(p => p.price >= 50000);
          } else {
            const [min, max] = filters.priceRange.split('-').map(Number);
            fetchedProducts = fetchedProducts.filter(p => p.price >= min && p.price <= max);
          }
        }

        // Client-side filtering for size availability
        if (filters.size) {
          fetchedProducts = fetchedProducts.filter(p => 
            p.sizes?.some(s => s.size === filters.size && s.stock > 0)
          );
        }

        setProducts(fetchedProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters.category, filters.priceRange, filters.size, filters.rating, filters.sortBy]);

  return { products, loading, error };
};

export const useProduct = (productId) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      setLoading(true);
      setError(null);

      try {
        const docRef = doc(db, 'products', productId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return { product, loading, error };
};