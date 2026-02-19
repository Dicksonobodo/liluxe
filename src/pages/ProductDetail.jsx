import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import SizeSelector from '../components/product/SizeSelector';
import ReviewForm from '../components/product/ReviewForm';
import ReviewList from '../components/product/ReviewList';
import { Button } from '../components/ui';
import { useToast } from '../components/ui';
import { ProductCardSkeleton } from '../components/ui/Skeleton';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { product, loading} = useProduct(id);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState('');
  const [reviewRefresh, setReviewRefresh] = useState(0);

  const isWishlisted = product ? isInWishlist(product.id) : false;

  if (loading) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <ProductCardSkeleton />
          <ProductCardSkeleton />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-16 text-center">
        <h2 className="font-serif text-3xl mb-4">Product not found</h2>
        <Button onClick={() => navigate('/shop')}>Back to Shop</Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError('Please select a size');
      return;
    }
    
    setSizeError('');
    
    addToCart(product, selectedSize, quantity, selectedColor);
    toast.success(`Added ${quantity} item(s) to cart!`);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      setSizeError('Please select a size');
      return;
    }
    
    setSizeError('');
    
    addToCart(product, selectedSize, quantity, selectedColor);
    navigate('/checkout');
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product.id);
    toast.success(isWishlisted ? 'Removed from saved' : 'Added to saved!');
  };

  const maxQuantity = product.sizes?.find(s => s.size === selectedSize)?.stock || 1;

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-8 md:py-12">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-stone-600 hover:text-stone-900 mb-6 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* Images Section */}
        <div>
          {/* Main Image */}
          <div className="aspect-[3/4] bg-stone-100 mb-4">
            <img
              src={product.images?.[selectedImage] || '/placeholder.png'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnail Images */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square border-2 overflow-hidden ${
                    selectedImage === index ? 'border-stone-900' : 'border-stone-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info Section */}
        <div className="md:sticky md:top-24 md:self-start">
          {/* Category Badge */}
          <div className="mb-4">
            <span className="inline-block bg-stone-100 px-3 py-1 text-xs uppercase tracking-wider font-medium">
              {product.category}
            </span>
          </div>

          {/* Product Name */}
          <h1 className="font-serif text-3xl md:text-4xl font-semibold mb-4">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(product.averageRating || 0) ? 'text-yellow-500' : 'text-stone-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            {product.reviewCount > 0 ? (
              <span className="text-sm text-stone-600">
                {product.averageRating.toFixed(1)} ({product.reviewCount} reviews)
              </span>
            ) : (
              <span className="text-sm text-stone-500">
                No reviews yet
              </span>
            )}
          </div>

          {/* Price */}
          <p className="text-3xl font-medium mb-8">
            ₦{product.price.toLocaleString('en-NG')}
          </p>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-xs uppercase tracking-wider font-semibold mb-3">Description</h3>
            <p className="text-stone-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Color Selector (if colors available) */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-8">
              <label className="block text-xs uppercase tracking-wider text-stone-600 mb-3 font-medium">
                Color
              </label>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(color.name)}
                    className={`relative flex items-center gap-2 px-4 py-2 border-2 transition-all ${
                      selectedColor === color.name
                        ? 'border-stone-900 bg-stone-50'
                        : 'border-stone-300 hover:border-stone-500'
                    }`}
                    title={color.name}
                  >
                    <div
                      className="w-6 h-6 rounded-full border border-stone-300"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="text-sm font-medium">{color.name}</span>
                    {selectedColor === color.name && (
                      <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          <div className="mb-8">
            <SizeSelector
              sizes={product.sizes || []}
              selectedSize={selectedSize}
              onSelectSize={(size) => {
                setSelectedSize(size);
                setSizeError('');
              }}
              error={sizeError}
            />
          </div>

          {/* Quantity Selector */}
          <div className="mb-8">
            <label className="block text-xs uppercase tracking-wider text-stone-600 mb-3 font-medium">
              Quantity
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 border border-stone-300 hover:border-stone-900 transition-colors flex items-center justify-center"
              >
                -
              </button>
              <span className="w-10 text-center font-medium text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                disabled={quantity >= maxQuantity}
                className="w-8 h-8 border border-stone-300 hover:border-stone-900 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                +
              </button>
              <span className="text-xs text-stone-500 ml-2">
                {maxQuantity} available
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="primary"
                className="col-span-2"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
              
              <Button
                variant="secondary"
                onClick={handleBuyNow}
              >
                Buy Now
              </Button>

              <button
                onClick={handleToggleWishlist}
                className={`flex items-center justify-center gap-2 px-6 py-3 border transition-colors ${
                  isWishlisted 
                    ? 'bg-red-50 border-red-500 text-red-600' 
                    : 'border-stone-300 text-stone-600 hover:border-stone-900'
                }`}
              >
                <svg 
                  className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`}
                  fill={isWishlisted ? 'currentColor' : 'none'} 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                  />
                </svg>
                {isWishlisted ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-8 border-t border-stone-200 space-y-4 text-sm text-stone-600">
            <p className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              CREATE AN ACCOUNT WITH US SO YOU CAN TRACK YOUR ORDERS 
            </p>
            <p className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              DISCOUNTS WILL BE AVAILABLE FOR RESGISTERED CUSTOMERS
            </p>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-12 border-t border-stone-200">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Review Form */}
          <ReviewForm 
            productId={product.id} 
            onReviewSubmitted={() => {
              // Trigger review list refresh immediately
              setReviewRefresh(prev => prev + 1);
              // Reload page after a short delay to show new rating
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            }}
          />

          {/* Reviews List */}
          <div>
            <h3 className="text-xl font-serif font-semibold mb-6">
              Customer Reviews ({product.reviewCount})
            </h3>
            <ReviewList 
              productId={product.id} 
              refreshTrigger={reviewRefresh}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;