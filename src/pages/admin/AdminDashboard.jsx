import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    todayOrders: 0,
    totalRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch total products
        const productsSnapshot = await getDocs(collection(db, 'products'));
        const totalProducts = productsSnapshot.size;

        // Fetch all orders
        const ordersSnapshot = await getDocs(collection(db, 'orders'));
        const allOrders = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        const totalOrders = allOrders.length;
        const totalRevenue = allOrders.reduce((sum, order) => sum + order.totalPrice, 0);

        // Today's orders
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayOrders = allOrders.filter(order => 
          new Date(order.createdAt) >= today
        ).length;

        // Recent orders (last 5)
        const recentOrdersData = allOrders
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);

        setStats({
          totalProducts,
          totalOrders,
          todayOrders,
          totalRevenue
        });

        setRecentOrders(recentOrdersData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-900"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-serif text-3xl md:text-4xl font-semibold mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Products */}
        <div className="bg-white border border-stone-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider text-stone-500">
              Total Products
            </span>
            <svg className="w-5 h-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <p className="text-3xl font-semibold">{stats.totalProducts}</p>
        </div>

        {/* Total Orders */}
        <div className="bg-white border border-stone-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider text-stone-500">
              Total Orders
            </span>
            <svg className="w-5 h-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-3xl font-semibold">{stats.totalOrders}</p>
        </div>

        {/* Today's Orders */}
        <div className="bg-white border border-stone-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider text-stone-500">
              Today's Orders
            </span>
            <svg className="w-5 h-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-3xl font-semibold">{stats.todayOrders}</p>
        </div>

        {/* Total Revenue */}
        <div className="bg-white border border-stone-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider text-stone-500">
              Total Revenue
            </span>
            <svg className="w-5 h-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-3xl font-semibold">
            ₦{stats.totalRevenue.toLocaleString('en-NG')}
          </p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white border border-stone-200">
        <div className="px-6 py-4 border-b border-stone-200">
          <h2 className="text-lg font-serif font-semibold">Recent Orders</h2>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-8 text-center text-stone-500">
            No orders yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-stone-500 font-medium">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-stone-500 font-medium">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-stone-500 font-medium">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-stone-500 font-medium">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-stone-500 font-medium">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50">
                    <td className="px-6 py-4 text-sm font-mono">
                      {order.id.substring(0, 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div>{order.customerName}</div>
                      <div className="text-stone-500">{order.customerPhone}</div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      ₦{order.totalPrice.toLocaleString('en-NG')}
                    </td>
                    <td className="px-6 py-4 text-sm text-stone-500">
                      {new Date(order.createdAt).toLocaleDateString('en-NG')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;