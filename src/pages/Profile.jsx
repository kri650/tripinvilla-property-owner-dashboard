import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Home, Shield, CheckCircle2 } from 'lucide-react';
import { userService } from '../services/api';

export default function Profile() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    pan: '',
    bank: '',
    accountNum: '',
    ifsc: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await userService.getProfile();
        const data = res.data;
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          company: data.company || '',
          pan: data.pan || '',
          bank: data.bank || '',
          accountNum: data.accountNum || '',
          ifsc: data.ifsc || '',
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          pincode: data.pincode || ''
        });
        setIsPremium(data.isPremium === true);
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await userService.updateProfile(formData);
      setMessage('Profile Saved Successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error saving profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading profile...</div>;

  return (
    <div className="dashboard-container fade-in">
      {/* Title */}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, fontFamily: '"Outfit", sans-serif', color: '#111827' }}>My Account</h2>
          <p style={{ color: '#6b7280', fontSize: 13, marginTop: 4 }}>Manage your personal details, payout bank accounts, and contact preferences</p>
        </div>
        
        {message && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: message.includes('Error') ? '#ef4444' : '#10b981',
            background: message.includes('Error') ? '#fee2e2' : '#dcfce7',
            padding: '8px 16px',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 13,
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            {message.includes('Error') ? null : <CheckCircle2 size={16} />} {message}
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
            <button type="submit" disabled={saving} className="btn btn-primary" style={{ padding: '12px 28px', borderRadius: 8, fontSize: 13.5 }}>
              {saving ? 'Saving...' : 'Save Account Profile'}
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
              {formData.name?.split(' ').map(n => n[0]).join('') || 'U'}
            </div>
            
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0, fontFamily: '"Outfit", sans-serif' }}>{formData.name}</h3>
            <span style={{ fontSize: 11.5, color: isPremium ? '#1d9e75' : '#9ca3af', fontWeight: 600, textTransform: 'uppercase', marginTop: 4 }}>{isPremium ? 'Premium Host' : 'Normal Host'}</span>
          </div>
        </div>

      </form>
    </div>
  );
}
