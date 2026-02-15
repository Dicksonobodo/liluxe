import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/ui';
import { Button, Input } from '../components/ui';
import PhoneInput from '../components/PhoneInput';
import CartItem from '../components/cart/CartItem';
import { sendWhatsAppOrder, formatNigerianPhone, isValidNigerianPhone } from '../utils/whatsapp';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Redirect if cart is empty
  if (cart.length === 0) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-16 text-center">
        <h2 className="font-serif text-3xl mb-4">Your cart is empty</h2>
        <p className="text-stone-600 mb-8">Add some items before checking out</p>
        <Button onClick={() => navigate('/shop')}>Continue Shopping</Button>
      </div>
    );
  }

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!isValidNigerianPhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid Nigerian phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      // Format phone number
      const formattedPhone = formatNigerianPhone(formData.phone);

      // Prepare order data
      const orderData = {
        customerId: user?.uid || null,
        customerName: formData.name,
        customerPhone: formattedPhone,
        items: cart.map(item => ({
          productId: item.id,
          name: item.name,
          size: item.selectedSize,
          quantity: item.quantity,
          price: item.price
        })),
        totalPrice: cartTotal,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Save order to Firestore
      const docRef = await addDoc(collection(db, 'orders'), orderData);

      // Reduce stock for each item in the order
      for (const item of cart) {
        try {
          const productRef = doc(db, 'products', item.id);
          const productSnap = await getDoc(productRef);
          
          if (productSnap.exists()) {
            const product = productSnap.data();
            
            // Update stock for the specific size
            const updatedSizes = product.sizes.map(s => 
              s.size === item.selectedSize 
                ? { ...s, stock: Math.max(0, s.stock - item.quantity) }
                : s
            );
            
            await updateDoc(productRef, { sizes: updatedSizes });
          }
        } catch (stockError) {
          console.error('Error updating stock for product:', item.id, stockError);
          // Continue with other items even if one fails
        }
      }

      // Send WhatsApp notification
      sendWhatsAppOrder({
        orderId: docRef.id,
        customerName: formData.name,
        customerPhone: formattedPhone,
        items: cart.map(item => ({
          name: item.name,
          size: item.selectedSize,
          quantity: item.quantity,
          price: item.price
        })),
        totalPrice: cartTotal
      });

      // Clear cart
      clearCart();

      // Show success and redirect
      toast.success('Order placed successfully!');
      navigate(`/order-success/${docRef.id}`);
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl md:text-4xl font-semibold mb-2">
          Checkout
        </h1>
        <p className="text-stone-600">Complete your order</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Information */}
            <div className="border border-stone-200 p-6">
              <h2 className="text-xl font-serif font-semibold mb-6">
                Customer Information
              </h2>

              <div className="space-y-4">
                <Input
                  label="Full Name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  error={errors.name}
                  required
                />

                <PhoneInput
                  value={formData.phone}
                  onChange={(phone) => setFormData({ ...formData, phone })}
                  error={errors.phone}
                />
              </div>
            </div>

            {/* Order Review */}
            <div className="border border-stone-200 p-6">
              <h2 className="text-xl font-serif font-semibold mb-6">
                Order Review
              </h2>

              <div className="space-y-4">
                {cart.map((item) => (
                  <CartItem
                    key={`${item.id}-${item.selectedSize}`}
                    item={item}
                    compact
                  />
                ))}
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-stone-50 border border-stone-200 p-6">
              <h3 className="font-semibold mb-3">Important Information</h3>
              <ul className="space-y-2 text-sm text-stone-600">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-stone-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  After placing your order, our team will contact you via WhatsApp to confirm details and arrange delivery.
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-stone-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Payment will be collected upon delivery or can be arranged beforehand.
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-stone-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Make sure your phone number is correct to receive order updates.
                </li>
              </ul>
            </div>

            {/* Mobile Submit Button */}
            <div className="lg:hidden">
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                loading={loading}
              >
                Place Order
              </Button>
            </div>
          </form>
        </div>

        {/* Order Summary - Sticky on Desktop */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="border border-stone-200 p-6 space-y-4">
            <h3 className="text-xl font-serif font-semibold">
              Order Summary
            </h3>

            <div className="space-y-3 py-4 border-y border-stone-200">
              <div className="flex justify-between text-sm">
                <span className="text-stone-600">Items ({cart.length})</span>
                <span>₦{cartTotal.toLocaleString('en-NG')}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-stone-600">Shipping</span>
                <span className="text-stone-500">To be confirmed</span>
              </div>
            </div>

            <div className="flex justify-between text-lg pt-2">
              <span className="font-semibold">Total</span>
              <span className="font-semibold">
                ₦{cartTotal.toLocaleString('en-NG')}
              </span>
            </div>

            {/* Desktop Submit Button */}
            <div className="hidden lg:block">
              <Button
                onClick={handleSubmit}
                variant="primary"
                className="w-full"
                loading={loading}
              >
                Place Order
              </Button>
            </div>

            <div className="pt-4 space-y-2 text-xs text-stone-600">
              <p className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Secure checkout
              </p>
              <p className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                We'll contact you via WhatsApp
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;