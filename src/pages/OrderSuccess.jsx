import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Button } from '../components/ui';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderDoc = await getDoc(doc(db, 'orders', orderId));
        if (orderDoc.exists()) {
          setOrder({ id: orderDoc.id, ...orderDoc.data() });
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-900 mx-auto mb-4"></div>
          <p className="text-stone-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 md:py-24 text-center">
      {/* Success Icon */}
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      {/* Success Message */}
      <h1 className="font-serif text-3xl md:text-5xl font-semibold mb-4">
        Order Confirmed!
      </h1>
      
      <p className="text-lg text-stone-600 mb-8">
        Thank you for your order. We've received your request and will contact you shortly.
      </p>

      {/* Order Details */}
      {order && (
        <div className="bg-stone-50 border border-stone-200 p-6 md:p-8 mb-8 text-left">
          <h2 className="text-xl font-serif font-semibold mb-4 text-center">
            Order Details
          </h2>

          <div className="space-y-3">
            <div className="flex justify-between pb-3 border-b border-stone-200">
              <span className="text-stone-600">Order ID</span>
              <span className="font-mono text-sm">{order.id.substring(0, 8).toUpperCase()}</span>
            </div>

            <div className="flex justify-between pb-3 border-b border-stone-200">
              <span className="text-stone-600">Customer Name</span>
              <span className="font-medium">{order.customerName}</span>
            </div>

            <div className="flex justify-between pb-3 border-b border-stone-200">
              <span className="text-stone-600">Phone Number</span>
              <span className="font-medium">{order.customerPhone}</span>
            </div>

            <div className="flex justify-between pb-3 border-b border-stone-200">
              <span className="text-stone-600">Total Amount</span>
              <span className="font-semibold">
                ₦{order.totalPrice.toLocaleString('en-NG')}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-stone-600">Status</span>
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium uppercase tracking-wider bg-green-100 text-green-800 border border-green-200">
                {order.status}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Next Steps */}
      <div className="bg-blue-50 border border-blue-200 p-6 mb-8 text-left">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          What happens next?
        </h3>
        <ul className="space-y-2 text-sm text-stone-700">
          <li className="flex items-start gap-2">
            <span className="font-bold">1.</span>
            <span>Our team will contact you via WhatsApp to confirm your order details</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">2.</span>
            <span>We'll arrange delivery and discuss payment options</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">3.</span>
            <span>You'll receive updates on your order status</span>
          </li>
        </ul>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/shop">
          <Button variant="primary">
            Continue Shopping
          </Button>
        </Link>
        
        <Link to="/track-order">
          <Button variant="secondary">
            Track My Order
          </Button>
        </Link>
      </div>

      {/* Support */}
      <p className="mt-8 text-sm text-stone-600">
        Questions about your order?{' '}
        <a href="https://wa.me/2348052465801" target="_blank" rel="noopener noreferrer" className="underline hover:text-stone-900">
          Contact us on WhatsApp
        </a>
      </p>
    </div>
  );
};

export default OrderSuccess;