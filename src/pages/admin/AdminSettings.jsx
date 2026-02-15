import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Button, Input } from '../../components/ui';
import { useToast } from '../../components/ui';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    whatsappNumber: '+2348052465801',
    whatsappEnabled: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const docRef = doc(db, 'settings', 'whatsapp');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setSettings({
          whatsappNumber: docSnap.data().phoneNumber || '+2348052465801',
          whatsappEnabled: docSnap.data().enabled !== false
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'whatsapp'), {
        phoneNumber: settings.whatsappNumber,
        enabled: settings.whatsappEnabled
      });
      
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
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
      <h1 className="font-serif text-3xl font-semibold mb-8">Settings</h1>

      <div className="max-w-2xl">
        {/* WhatsApp Settings */}
        <div className="bg-white border border-stone-200 p-6 mb-6">
          <h2 className="text-xl font-serif font-semibold mb-6">
            WhatsApp Notifications
          </h2>

          <div className="space-y-6">
            <Input
              label="WhatsApp Number"
              type="tel"
              value={settings.whatsappNumber}
              onChange={(e) => setSettings({...settings, whatsappNumber: e.target.value})}
              placeholder="+234 805 246 5801"
            />

            <div className="flex items-start gap-3 p-4 bg-stone-50 border border-stone-200">
              <input
                type="checkbox"
                id="whatsappEnabled"
                checked={settings.whatsappEnabled}
                onChange={(e) => setSettings({...settings, whatsappEnabled: e.target.checked})}
                className="mt-1 w-5 h-5 border-stone-300 focus:ring-stone-900"
              />
              <label htmlFor="whatsappEnabled" className="flex-1">
                <div className="font-medium mb-1">
                  Enable WhatsApp Notifications
                </div>
                <p className="text-sm text-stone-600">
                  When enabled, you'll receive a WhatsApp message for every new order placed on the store.
                </p>
              </label>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4">
              <div className="flex gap-3">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-blue-900">
                  <p className="font-medium mb-1">How it works:</p>
                  <ul className="space-y-1 text-blue-800">
                    <li>• When a customer places an order, their browser opens WhatsApp</li>
                    <li>• A pre-filled message with order details is sent to your number</li>
                    <li>• Make sure this number can receive WhatsApp messages</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button
              onClick={handleSave}
              variant="primary"
              loading={saving}
            >
              Save Settings
            </Button>
          </div>
        </div>

        {/* Store Information */}
        <div className="bg-white border border-stone-200 p-6">
          <h2 className="text-xl font-serif font-semibold mb-6">
            Store Information
          </h2>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between py-3 border-b border-stone-200">
              <span className="text-stone-600">Store Name</span>
              <span className="font-medium">LILUXE Store</span>
            </div>
            
            <div className="flex justify-between py-3 border-b border-stone-200">
              <span className="text-stone-600">Platform</span>
              <span className="font-medium">React + Firebase</span>
            </div>
            
            <div className="flex justify-between py-3">
              <span className="text-stone-600">Version</span>
              <span className="font-medium">1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;