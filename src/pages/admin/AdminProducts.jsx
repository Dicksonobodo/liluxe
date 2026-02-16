import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { deleteProductImage } from '../../utils/ImageUpload';
import { Button } from '../../components/ui';
import { useToast } from '../../components/ui';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, 'products'));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) {
      return;
    }

    try {
      // Delete images from Storage
      if (product.images && product.images.length > 0) {
        for (const imageUrl of product.images) {
          await deleteProductImage(imageUrl);
        }
      }

      // Delete from Firestore
      await deleteDoc(doc(db, 'products', product.id));

      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-900"></div>
      </div>
    );
  }

  // Filter products by search query
  const filteredProducts = searchQuery
    ? products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl font-semibold mb-2">Products</h1>
          <p className="text-stone-600">{filteredProducts.length} of {products.length} products</p>
        </div>
        <Button onClick={() => navigate('/admin/products/new')}>
          Add New Product
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search products by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-12 border border-stone-300 focus:outline-none focus:border-stone-900"
          />
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-900"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="bg-white border border-stone-200 p-16 text-center">
          <svg
            className="w-16 h-16 mx-auto text-stone-300 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <h3 className="font-serif text-2xl mb-2">No products yet</h3>
          <p className="text-stone-600 mb-6">Get started by adding your first product</p>
          <Button onClick={() => navigate('/admin/products/new')}>
            Add Product
          </Button>
        </div>
      ) : (
        <div className="bg-white border border-stone-200 overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-stone-500 font-medium">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-stone-500 font-medium">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-stone-500 font-medium">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-stone-500 font-medium">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-stone-500 font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {filteredProducts.map((product) => {
                  const totalStock = product.sizes?.reduce((sum, s) => sum + s.stock, 0) || 0;
                  
                  return (
                    <tr key={product.id} className="hover:bg-stone-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-stone-100 flex-shrink-0">
                            {product.images?.[0] && (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-stone-500">
                              {product.images?.length || 0} image(s)
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm capitalize">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        ₦{product.price.toLocaleString('en-NG')}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {totalStock} units
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                            className="text-sm text-stone-600 hover:text-stone-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product)}
                            className="text-sm text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-stone-200">
            {filteredProducts.map((product) => {
              const totalStock = product.sizes?.reduce((sum, s) => sum + s.stock, 0) || 0;
              
              return (
                <div key={product.id} className="p-4">
                  <div className="flex gap-4 mb-3">
                    <div className="w-20 h-20 bg-stone-100 flex-shrink-0">
                      {product.images?.[0] && (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium mb-1">{product.name}</h3>
                      <p className="text-sm text-stone-600 capitalize mb-1">
                        {product.category}
                      </p>
                      <p className="text-sm font-medium">
                        ₦{product.price.toLocaleString('en-NG')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-stone-600">{totalStock} units in stock</span>
                    <div className="flex gap-3">
                      <button
                        onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                        className="text-stone-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        className="text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;