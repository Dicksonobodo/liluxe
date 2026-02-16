import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Button } from '../components/ui';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const whatsappURL = location.state?.whatsappURL;
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
        {whatsappURL && (
          <a href={whatsappURL} target="_blank" rel="noopener noreferrer">
            <Button variant="primary" className="w-full sm:w-auto">
              <svg className="w-5 h-5 mr-2 inline" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Send Order via WhatsApp
            </Button>
          </a>
        )}
        
        <Link to="/shop">
          <Button variant="secondary" className="w-full sm:w-auto">
            Continue Shopping
          </Button>
        </Link>
        
        <Link to="/track-order">
          <Button variant="ghost" className="w-full sm:w-auto">
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