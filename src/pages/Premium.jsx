import React, { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { userService, bookingService } from '../services/api';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function Premium() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchProfile = async () => {
    try {
      const res = await userService.getProfile();
      setProfile(res.data);
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpgrade = async () => {
    setError('');
    setSuccessMsg('');
    setPaymentLoading(true);

    try {
      // 1. Load Razorpay SDK Script
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
      }

      // 2. Fetch Razorpay Public Key from Backend
      const keyRes = await bookingService.getRazorpayKey();
      const razorpayKey = keyRes.data.key;

      // 3. Create Razorpay Order on Backend
      const orderRes = await bookingService.createPremiumOrder();
      const order = orderRes.data;

      // 4. Configure Razorpay Options
      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency || 'INR',
        name: 'Tripinstays Premium',
        description: 'Monthly Host Premium Subscription',
        order_id: order.id,
        handler: async function (response) {
          try {
            setPaymentLoading(true);
            // 5. Verify Signature on Backend
            await bookingService.verifyPremium({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            setSuccessMsg('Congratulations! Your Premium subscription has been activated successfully.');
            // Refresh profile to reflect premium state
            await fetchProfile();
          } catch (verifyErr) {
            setError(verifyErr.response?.data?.message || 'Payment verification failed. Please contact support.');
          } finally {
            setPaymentLoading(false);
          }
        },
        prefill: {
          name: profile?.name || '',
          email: profile?.email || '',
          contact: profile?.phone || '',
        },
        theme: {
          color: '#58A429',
        },
        modal: {
          ondismiss: function () {
            setPaymentLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Something went wrong while initiating payment.');
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>Loading user details...</div>;
  }

  const isPremium = profile?.isPremium === true;

  return (
    <div className="fade-in">
      <div style={{ height: '16px' }} />

      {/* Breadcrumb */}
      <div className="props-breadcrumb" style={{ margin: '0 39px 12px' }}>
        User Access &gt; <span>Upgrade to Premium</span>
      </div>

      {/* Main Container */}
      <div className="dash-section" style={{ padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px', minHeight: '520px' }}>
        
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', fontFamily: '"Outfit", sans-serif', margin: 0 }}>
          Upgrade to Premium
        </h2>

        {error && (
          <div style={{ color: '#EF4444', backgroundColor: '#FEE2E2', padding: '12px 24px', borderRadius: '12px', fontSize: '13px', fontWeight: 600 }}>
            {error}
          </div>
        )}

        {successMsg && (
          <div style={{ color: '#10B981', backgroundColor: '#D1FAE5', padding: '12px 24px', borderRadius: '12px', fontSize: '13px', fontWeight: 600 }}>
            {successMsg}
          </div>
        )}

        {/* Pricing Cards Row */}
        <div style={{ display: 'flex', gap: '32px', width: '100%', maxWidth: '780px', justifyContent: 'center', alignItems: 'stretch' }}>
          
          {/* Card 1: Normal */}
          <div style={{ 
            background: '#ffffff', 
            border: '1px solid #E5E7EB', 
            borderRadius: '24px', 
            padding: '36px 32px', 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)'
          }}>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '15px', fontWeight: 600, color: '#4B5563', marginBottom: '8px' }}>Normal</span>
              
              <div style={{ display: 'flex', alignItems: 'baseline', fontFamily: '"Outfit", sans-serif', margin: '16px 0' }}>
                <span style={{ fontSize: '36px', fontWeight: 800, color: '#111827' }}>₹0</span>
                <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: 500 }}>/mo</span>
              </div>
              
              <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 28px 0', textAlign: 'center' }}>Ideal for normal homestays</p>

              {/* Status Button */}
              <button 
                disabled
                style={{ 
                  background: '#F3F4F6', 
                  color: isPremium ? '#9CA3AF' : '#10B981', 
                  border: 'none', 
                  borderRadius: '12px', 
                  padding: '12px 0', 
                  width: '100%', 
                  fontWeight: 600, 
                  fontSize: '12.5px',
                  marginBottom: '32px',
                  cursor: 'not-allowed'
                }}
              >
                {isPremium ? 'Downgrade Available' : 'Activated'}
              </button>

              {/* Bullet List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', alignSelf: 'start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#4B5563' }}>
                  <CheckCircle2 size={14} style={{ color: '#58A429' }} />
                  <span>Curated & Verified Customers</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#4B5563' }}>
                  <CheckCircle2 size={14} style={{ color: '#58A429' }} />
                  <span>Normal Listings</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#4B5563' }}>
                  <CheckCircle2 size={14} style={{ color: '#58A429' }} />
                  <span>Property Reports per month</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Premium */}
          <div style={{ 
            background: '#ffffff', 
            border: isPremium ? '2px solid #10B981' : '2px solid #58A429', 
            borderRadius: '24px', 
            padding: '36px 32px', 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            boxShadow: isPremium ? '0 10px 30px rgba(16, 185, 129, 0.08)' : '0 10px 30px rgba(88, 164, 41, 0.08)',
            position: 'relative'
          }}>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '15px', fontWeight: 700, color: isPremium ? '#10B981' : '#58A429', marginBottom: '8px' }}>Premium</span>
              
              <div style={{ display: 'flex', alignItems: 'baseline', fontFamily: '"Outfit", sans-serif', margin: '16px 0' }}>
                <span style={{ fontSize: '36px', fontWeight: 800, color: '#111827' }}>₹2,999</span>
                <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: 500 }}>/mo</span>
              </div>
              
              <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 28px 0', textAlign: 'center' }}>Ideal for premium homestays</p>

              {/* Action Button */}
              <button 
                disabled={isPremium || paymentLoading}
                style={{ 
                  background: isPremium ? '#D1FAE5' : '#58A429', 
                  color: isPremium ? '#065F46' : '#ffffff', 
                  border: 'none', 
                  borderRadius: '12px', 
                  padding: '12px 0', 
                  width: '100%', 
                  fontWeight: 600, 
                  fontSize: '12.5px',
                  marginBottom: '32px',
                  cursor: (isPremium || paymentLoading) ? 'not-allowed' : 'pointer',
                  boxShadow: isPremium ? 'none' : '0 4px 12px rgba(88, 164, 41, 0.2)'
                }}
                onClick={handleUpgrade}
              >
                {isPremium ? 'Activated' : paymentLoading ? 'Processing...' : 'Try It'}
              </button>

              {/* Bullet List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', alignSelf: 'start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#4B5563' }}>
                  <CheckCircle2 size={14} style={{ color: '#58A429' }} />
                  <span>Higher Search Ranking</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#4B5563' }}>
                  <CheckCircle2 size={14} style={{ color: '#58A429' }} />
                  <span>Increased Booking Visibility</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#4B5563' }}>
                  <CheckCircle2 size={14} style={{ color: '#58A429' }} />
                  <span>Featured Property Placement</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#4B5563' }}>
                  <CheckCircle2 size={14} style={{ color: '#58A429' }} />
                  <span>Advanced Analytics</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#4B5563' }}>
                  <CheckCircle2 size={14} style={{ color: '#58A429' }} />
                  <span>Priority Support</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#4B5563' }}>
                  <CheckCircle2 size={14} style={{ color: '#58A429' }} />
                  <span>More Photos & Videos</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#4B5563' }}>
                  <CheckCircle2 size={14} style={{ color: '#58A429' }} />
                  <span>Early Access to New Features</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
