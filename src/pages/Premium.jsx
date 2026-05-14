import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function Premium() {
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
                  color: '#10B981', 
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
                Activated
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
            border: '2px solid #58A429', 
            borderRadius: '24px', 
            padding: '36px 32px', 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            boxShadow: '0 10px 30px rgba(88, 164, 41, 0.08)',
            position: 'relative'
          }}>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#58A429', marginBottom: '8px' }}>Premium</span>
              
              <div style={{ display: 'flex', alignItems: 'baseline', fontFamily: '"Outfit", sans-serif', margin: '16px 0' }}>
                <span style={{ fontSize: '36px', fontWeight: 800, color: '#111827' }}>₹2,999</span>
                <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: 500 }}>/mo</span>
              </div>
              
              <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 28px 0', textAlign: 'center' }}>Ideal for normal homestays</p>

              {/* Action Button */}
              <button 
                style={{ 
                  background: '#58A429', 
                  color: '#ffffff', 
                  border: 'none', 
                  borderRadius: '12px', 
                  padding: '12px 0', 
                  width: '100%', 
                  fontWeight: 600, 
                  fontSize: '12.5px',
                  marginBottom: '32px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(88, 164, 41, 0.2)'
                }}
                onClick={() => alert('Proceeding to premium subscription...')}
              >
                Try It
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
