import React, { useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Button, Input, Badge } from '../components/ui';
import { useToast } from '../components/ui';
import { formatNigerianPhone } from '../utils/whatsapp';

const OrderTracking = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const toast = useToast();

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!phoneNumber.trim()) {
      toast.error('Please enter your phone number');
      return;
    }

    setLoading(true);
    setSearched(false);

    try {
      // Format phone number
      const formattedPhone = formatNigerianPhone(phoneNumber);

      // Query orders by phone number
      const q = query(
        collection(db, 'orders'),
        where('customerPhone', '==', formattedPhone)
      );

      const querySnapshot = await getDocs(q);
      const foundOrders = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Sort by date (newest first)
      foundOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setOrders(foundOrders);
      setSearched(true);

      if (foundOrders.length === 0) {
        toast.info('No orders found with this phone number');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: 'confirmed',
      processing: 'processing',
      shipped: 'shipped',
      delivered: 'delivered'
    };
    return colors[status] || 'default';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
      {/* Header */}
      <div className="text-center mb-8 md:mb-12">
        <h1 className="font-serif text-3xl md:text-5xl font-semibold mb-4">
          Track Your Order
        </h1>
        <p className="text-stone-600">
          Enter your phone number to view your order history
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="max-w-md mx-auto mb-12">
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              type="tel"
              placeholder="+234 801 234 5678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <Button type="submit" variant="primary" loading={loading}>
            Search
          </Button>
        </div>
      </form>

      {/* Results */}
      {searched && (
        <div>
          {orders.length === 0 ? (
            <div className="text-center py-16">
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="font-serif text-2xl mb-2">No orders found</h3>
              <p className="text-stone-600 mb-6">
                We couldn't find any orders with this phone number
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-xl font-serif font-semibold">
                Your Orders ({orders.length})
              </h2>

              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border border-stone-200 p-6 hover:border-stone-300 transition-colors"
                >
                  {/* Order Header */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 pb-4 border-b border-stone-200">
                    <div>
                      <p className="text-xs text-stone-500 mb-1">Order ID</p>
                      <p className="font-mono text-sm font-medium">
                        {order.id.substring(0, 8).toUpperCase()}
                      </p>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <Badge variant={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Order Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-stone-500 mb-1">Order Date</p>
                      <p className="text-sm">
                        {new Date(order.createdAt).toLocaleDateString('en-NG', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-stone-500 mb-1">Total Amount</p>
                      <p className="text-sm font-semibold">
                        ₦{order.totalPrice.toLocaleString('en-NG')}
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <p className="text-xs text-stone-500 mb-2">Items</p>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-stone-600">
                            {item.name} ({item.size}) × {item.quantity}
                          </span>
                          <span>
                            ₦{(item.price * item.quantity).toLocaleString('en-NG')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status Timeline (if delivered or shipped) */}
                  {(order.status === 'shipped' || order.status === 'delivered') && (
                    <div className="mt-6 pt-6 border-t border-stone-200">
                      <div className="flex items-center gap-2 text-sm text-stone-600">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {order.status === 'shipped' 
                          ? 'Your order is on its way!'
                          : 'Your order has been delivered'
                        }
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Help Section */}
      <div className="mt-12 pt-8 border-t border-stone-200 text-center">
        <p className="text-sm text-stone-600 mb-2">
          Need help with your order?
        </p>
        <a
          href="https://wa.me/2348052465801"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-stone-900 hover:underline"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          Contact us on WhatsApp
        </a>
      </div>
    </div>
  );
};

export default OrderTracking;