import React, { useState } from 'react';
import { collection, addDoc, doc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../hooks/useAuth';
import { Button, Input } from '../ui';
import { useToast } from '../ui';

const ReviewForm = ({ productId, onReviewSubmitted }) => {
  const { user } = useAuth();
  const toast = useToast();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please sign in to leave a review');
      return;
    }

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!comment.trim()) {
      toast.error('Please write a review');
      return;
    }

    setSubmitting(true);

    try {
      // Check if user already reviewed this product
      const existingReviewQuery = query(
        collection(db, 'reviews'),
        where('productId', '==', productId),
        where('userId', '==', user.uid)
      );
      const existingReviews = await getDocs(existingReviewQuery);

      if (!existingReviews.empty) {
        toast.error('You have already reviewed this product');
        setSubmitting(false);
        return;
      }

      // Add review
      await addDoc(collection(db, 'reviews'), {
        productId,
        userId: user.uid,
        userName: user.name || user.email,
        rating,
        comment: comment.trim(),
        createdAt: new Date().toISOString()
      });

      // Update product rating
      await updateProductRating(productId);

      toast.success('Review submitted successfully!');
      setRating(0);
      setComment('');
      
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const updateProductRating = async (productId) => {
    // Get all reviews for this product
    const reviewsQuery = query(
      collection(db, 'reviews'),
      where('productId', '==', productId)
    );
    const reviewsSnapshot = await getDocs(reviewsQuery);

    const reviews = reviewsSnapshot.docs.map(doc => doc.data());
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    // Update product
    await updateDoc(doc(db, 'products', productId), {
      averageRating: Number(averageRating.toFixed(1)),
      reviewCount: reviews.length
    });
  };

  return (
    <div className="border border-stone-200 p-6">
      <h3 className="text-xl font-serif font-semibold mb-6">Write a Review</h3>

      {!user ? (
        <div className="text-center py-8">
          <p className="text-stone-600 mb-4">Sign in to leave a review</p>
          <Button variant="secondary" onClick={() => window.location.href = '/auth'}>
            Sign In
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Star Rating */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Your Rating <span className="text-red-600">*</span>
            </label>
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setRating(star);
                    toast.success(`${star} star${star !== 1 ? 's' : ''} selected!`);
                  }}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 transition-all hover:scale-125 cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                  aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                >
                  <svg
                    className={`w-10 h-10 ${
                      star <= (hoveredRating || rating)
                        ? 'text-yellow-500'
                        : 'text-stone-300'
                    } pointer-events-none transition-colors`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
              <span className="ml-3 text-sm font-medium text-stone-900">
                {rating > 0 ? `${rating} star${rating !== 1 ? 's' : ''}` : ''}
              </span>
            </div>
            {rating === 0 && (
              <p className="text-xs text-stone-500 italic">
                Click on the stars above to rate this product
              </p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium mb-3">Your Review</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-stone-300 focus:outline-none focus:border-stone-900"
              placeholder="Share your experience with this product..."
              required
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            variant="primary"
            loading={submitting}
          >
            Submit Review
          </Button>
        </form>
      )}
    </div>
  );
};

export default ReviewForm;