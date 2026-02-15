import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Badge } from '../../components/ui';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { useToast } from '../../components/ui';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: null,
    orderId: null
  });
  const toast = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, 'orders'));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order status');
    }
  };

  const deleteOrder = async (orderId) => {
    setConfirmModal({
      isOpen: true,
      type: 'deleteOne',
      orderId: orderId
    });
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteDoc(doc(db, 'orders', confirmModal.orderId));
      toast.success('Order deleted');
      fetchOrders();
      setExpandedOrder(null);
      setConfirmModal({ isOpen: false, type: null, orderId: null });
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Failed to delete order');
    } finally {
      setDeleting(false);
    }
  };

  const clearAllOrders = async () => {
    setConfirmModal({
      isOpen: true,
      type: 'clearAll',
      orderId: null
    });
  };

  const handleConfirmClearAll = async () => {
    setDeleting(true);
    try {
      const ordersSnapshot = await getDocs(collection(db, 'orders'));
      
      // Delete all orders
      const deletePromises = ordersSnapshot.docs.map(doc => 
        deleteDoc(doc.ref)
      );
      
      await Promise.all(deletePromises);
      
      toast.success(`Deleted ${ordersSnapshot.size} orders`);
      fetchOrders();
      setConfirmModal({ isOpen: false, type: null, orderId: null });
    } catch (error) {
      console.error('Error clearing orders:', error);
      toast.error('Failed to clear orders');
    } finally {
      setDeleting(false);
    }
  };

  const handleConfirm = () => {
    if (confirmModal.type === 'deleteOne') {
      handleConfirmDelete();
    } else if (confirmModal.type === 'clearAll') {
      handleConfirmClearAll();
    }
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter);

  const statusCounts = {
    all: orders.length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-900"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="font-serif text-3xl font-semibold">Orders</h1>
        
        {orders.length > 0 && (
          <button
            onClick={clearAllOrders}
            disabled={deleting}
            className="px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {deleting ? 'Clearing...' : 'Clear All Orders'}
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 md:gap-4 mb-6 overflow-x-auto pb-2">
        {['all', 'confirmed', 'processing', 'shipped', 'delivered'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 text-sm whitespace-nowrap transition-colors ${
              filter === status
                ? 'bg-stone-900 text-white'
                : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-900'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            <span className="ml-2 text-xs opacity-75">
              ({statusCounts[status]})
            </span>
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white border border-stone-200 p-16 text-center">
          <p className="text-stone-600">No orders found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-stone-200 overflow-hidden"
            >
              {/* Order Header */}
              <div
                className="p-4 md:p-6 cursor-pointer hover:bg-stone-50"
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-sm font-medium">
                        #{order.id.substring(0, 8).toUpperCase()}
                      </span>
                      <Badge variant={order.status}>
                        {order.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-stone-600">
                      <p>{order.customerName}</p>
                      <p>{order.customerPhone}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4">
                    <div className="text-right">
                      <p className="text-sm text-stone-600 mb-1">
                        {new Date(order.createdAt).toLocaleDateString('en-NG')}
                      </p>
                      <p className="font-semibold">
                        ₦{order.totalPrice.toLocaleString('en-NG')}
                      </p>
                    </div>
                    <svg
                      className={`w-5 h-5 text-stone-400 transition-transform ${
                        expandedOrder === order.id ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedOrder === order.id && (
                <div className="border-t border-stone-200 p-4 md:p-6 bg-stone-50">
                  {/* Items */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wider mb-3">
                      Order Items
                    </h3>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-sm bg-white p-3"
                        >
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-stone-600">
                              Size: {item.size} | Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="font-medium">
                            ₦{(item.price * item.quantity).toLocaleString('en-NG')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Update Status */}
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider mb-3">
                      Update Status
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {['confirmed', 'processing', 'shipped', 'delivered'].map(status => (
                        <button
                          key={status}
                          onClick={() => updateOrderStatus(order.id, status)}
                          disabled={order.status === status}
                          className={`px-4 py-2 text-sm capitalize transition-colors ${
                            order.status === status
                              ? 'bg-stone-200 text-stone-500 cursor-not-allowed'
                              : 'bg-white border border-stone-300 text-stone-900 hover:border-stone-900'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Contact Customer */}
                  <div className="mt-6 pt-6 border-t border-stone-200 flex items-center justify-between">
                    <a
                      href={`https://wa.me/${order.customerPhone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-stone-900 hover:underline"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      Contact Customer on WhatsApp
                    </a>

                    <button
                      onClick={() => deleteOrder(order.id)}
                      className="text-sm text-red-600 hover:text-red-800 transition-colors"
                    >
                      Delete Order
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: null, orderId: null })}
        onConfirm={handleConfirm}
        title={confirmModal.type === 'clearAll' ? 'Clear All Orders?' : 'Delete Order?'}
        message={
          confirmModal.type === 'clearAll'
            ? `This will permanently delete ALL ${orders.length} orders in the system. This action cannot be undone!`
            : 'This will permanently delete this order. This action cannot be undone.'
        }
        confirmText={confirmModal.type === 'clearAll' ? 'Delete All' : 'Delete'}
        cancelText="Cancel"
        danger={true}
        loading={deleting}
      />
    </div>
  );
};

export default AdminOrders;