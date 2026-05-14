import React, { useState } from 'react';
import { User, Mail, Phone, Home, Shield, CheckCircle2 } from 'lucide-react';

export default function Profile() {
  const [formData, setFormData] = useState({
    name: 'Navin Kumar',
    email: 'navin@gmail.com',
    phone: '+91 99887 76543',
    company: 'NK Premium Rentals Ltd',
    pan: 'ABCDE1234F',
    bank: 'HDFC Bank Ltd',
    accountNum: '501002938475',
    ifsc: 'HDFC0000124',
    address: 'Flat 402, Green Meadows Apartment, Phase 2',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560037'
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="dashboard-container fade-in">
      {/* Title */}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, fontFamily: '"Outfit", sans-serif', color: '#111827' }}>My Account</h2>
          <p style={{ color: '#6b7280', fontSize: 13, marginTop: 4 }}>Manage your personal details, payout bank accounts, and contact preferences</p>
        </div>
        
        {saved && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: '#10b981',
            background: '#dcfce7',
            padding: '8px 16px',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 13,
            boxShadow: '0 2px 4px rgba(16, 185, 129, 0.1)'
          }}>
            <CheckCircle2 size={16} /> Profile Saved Successfully!
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: 24, alignItems: 'start' }}>
        
        {/* Left Side: Forms */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Section 1: Basic Details */}
          <div className="dashboard-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, borderBottom: '1px solid #f1f5f9', paddingBottom: 12 }}>
              <User size={18} style={{ color: '#1d9e75' }} />
              <h3 style={{ fontSize: 15, fontWeight: 700, fontFamily: '"Outfit", sans-serif', color: '#111827', margin: 0 }}>Basic Profile Information</h3>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#4b5563' }}>Owner Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name} 
                  onChange={handleChange}
                  style={{ padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13.5, outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#4b5563' }}>Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email} 
                  onChange={handleChange}
                  style={{ padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13.5, outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#4b5563' }}>Contact Phone</label>
                <input 
                  type="text" 
                  name="phone"
                  value={formData.phone} 
                  onChange={handleChange}
                  style={{ padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13.5, outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#4b5563' }}>Company Name (Optional)</label>
                <input 
                  type="text" 
                  name="company"
                  value={formData.company} 
                  onChange={handleChange}
                  style={{ padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13.5, outline: 'none' }}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Bank Account / Payouts */}
          <div className="dashboard-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, borderBottom: '1px solid #f1f5f9', paddingBottom: 12 }}>
              <Shield size={18} style={{ color: '#1d9e75' }} />
              <h3 style={{ fontSize: 15, fontWeight: 700, fontFamily: '"Outfit", sans-serif', color: '#111827', margin: 0 }}>Payout Details & Bank Accounts</h3>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#4b5563' }}>Bank Name</label>
                <input 
                  type="text" 
                  name="bank"
                  value={formData.bank} 
                  onChange={handleChange}
                  style={{ padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13.5, outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#4b5563' }}>Account Number</label>
                <input 
                  type="text" 
                  name="accountNum"
                  value={formData.accountNum} 
                  onChange={handleChange}
                  style={{ padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13.5, outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#4b5563' }}>IFSC / SWIFT Code</label>
                <input 
                  type="text" 
                  name="ifsc"
                  value={formData.ifsc} 
                  onChange={handleChange}
                  style={{ padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13.5, outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#4b5563' }}>PAN Card / Tax Number</label>
                <input 
                  type="text" 
                  name="pan"
                  value={formData.pan} 
                  onChange={handleChange}
                  style={{ padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13.5, outline: 'none' }}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Billing Address */}
          <div className="dashboard-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, borderBottom: '1px solid #f1f5f9', paddingBottom: 12 }}>
              <Home size={18} style={{ color: '#1d9e75' }} />
              <h3 style={{ fontSize: 15, fontWeight: 700, fontFamily: '"Outfit", sans-serif', color: '#111827', margin: 0 }}>Registered Billing Address</h3>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20, marginBottom: 20 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#4b5563' }}>Street Address</label>
                <input 
                  type="text" 
                  name="address"
                  value={formData.address} 
                  onChange={handleChange}
                  style={{ padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13.5, outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#4b5563' }}>City</label>
                <input 
                  type="text" 
                  name="city"
                  value={formData.city} 
                  onChange={handleChange}
                  style={{ padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13.5, outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#4b5563' }}>State</label>
                <input 
                  type="text" 
                  name="state"
                  value={formData.state} 
                  onChange={handleChange}
                  style={{ padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13.5, outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#4b5563' }}>Pincode / ZIP</label>
                <input 
                  type="text" 
                  name="pincode"
                  value={formData.pincode} 
                  onChange={handleChange}
                  style={{ padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13.5, outline: 'none' }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" className="btn btn-primary" style={{ padding: '12px 28px', borderRadius: 8, fontSize: 13.5 }}>
              Save Account Profile
            </button>
            <button type="button" className="btn btn-secondary" style={{ padding: '12px 24px', borderRadius: 8, fontSize: 13.5 }}>
              Discard Changes
            </button>
          </div>

        </div>

        {/* Right Side: Quick summary or widgets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="dashboard-card" style={{ alignItems: 'center', textAlign: 'center', padding: '32px 20px' }}>
            <div style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1d9e75, #157a5a)',
              color: '#ffffff',
              fontSize: 28,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
              boxShadow: '0 8px 16px -4px rgba(29, 158, 117, 0.4)'
            }}>
              NK
            </div>
            
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0, fontFamily: '"Outfit", sans-serif' }}>Navin Kumar</h3>
            <span style={{ fontSize: 11.5, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', marginTop: 4 }}>Premium Host</span>
            
            <div style={{ width: '100%', height: 1, background: '#f1f5f9', margin: '16px 0' }} />
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: '#6b7280' }}>Host Since</span>
                <span style={{ fontWeight: 600, color: '#334155' }}>June 2024</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: '#6b7280' }}>Verified Status</span>
                <span style={{ fontWeight: 600, color: '#10b981' }}>Verified ✅</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: '#6b7280' }}>Response Rate</span>
                <span style={{ fontWeight: 600, color: '#1d9e75' }}>98%</span>
              </div>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}
