import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Globe, Lock } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    citizenship: 'India',
    email: '',
    phone: '',
    residence: 'India',
    address: '',
    pincode: '',
    state: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const name = `${formData.firstName} ${formData.lastName}`.trim();
      
      // Step 1: Register User with Role 'owner'
      const registerRes = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email: formData.email,
          password: formData.password,
          role: 'owner'
        })
      });
      const registerData = await registerRes.json();
      if (!registerRes.ok) throw new Error(registerData.message || 'Registration failed');
      
      const token = registerData.token;
      localStorage.setItem('token', token);
      localStorage.setItem('owner_user', JSON.stringify(registerData.user));

      // Step 2: Update Profile details
      const profileRes = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          phone: formData.phone,
          address: formData.address,
          state: formData.state,
          pincode: formData.pincode,
          citizenship: formData.citizenship,
          residence: formData.residence
        })
      });
      const profileData = await profileRes.json();
      if (profileRes.ok) {
        localStorage.setItem('owner_user', JSON.stringify(profileData));
      }

      navigate('/owner/dashboard', { replace: true });
    } catch (err) {
      console.error('Owner registration failed:', err);
      alert(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      boxSizing: 'border-box',
      fontFamily: '"Outfit", sans-serif'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '900px',
        padding: '48px 40px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
        boxSizing: 'border-box'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#111827', margin: '0 0 8px 0' }}>
            Sign Up As <span style={{ color: '#2563EB' }}>Property Owner</span>
          </h2>
          <p style={{ color: '#6B7280', fontSize: '14.5px', margin: 0 }}>Join us to list and manage your premium properties</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Row 1: First Name, Last Name, Citizenship */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>First Name*</label>
              <input
                type="text"
                placeholder="Rohan"
                required
                value={formData.firstName}
                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                style={{ padding: '12px 14px', border: '1px solid #D1D5DB', borderRadius: '10px', fontSize: '14px', outline: 'none' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Last Name*</label>
              <input
                type="text"
                placeholder="Sharma"
                required
                value={formData.lastName}
                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                style={{ padding: '12px 14px', border: '1px solid #D1D5DB', borderRadius: '10px', fontSize: '14px', outline: 'none' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Country of Citizenship*</label>
              <input
                type="text"
                placeholder="India"
                required
                value={formData.citizenship}
                onChange={e => setFormData({ ...formData, citizenship: e.target.value })}
                style={{ padding: '12px 14px', border: '1px solid #D1D5DB', borderRadius: '10px', fontSize: '14px', outline: 'none' }}
              />
            </div>
          </div>

          {/* Row 2: Email, Phone, Residence */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Email Address*</label>
              <input
                type="email"
                placeholder="johndoe@gmail.com"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                style={{ padding: '12px 14px', border: '1px solid #D1D5DB', borderRadius: '10px', fontSize: '14px', outline: 'none' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Phone Number*</label>
              <input
                type="text"
                placeholder="+91 98765 43210"
                required
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                style={{ padding: '12px 14px', border: '1px solid #D1D5DB', borderRadius: '10px', fontSize: '14px', outline: 'none' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Country of Residence*</label>
              <input
                type="text"
                placeholder="India"
                required
                value={formData.residence}
                onChange={e => setFormData({ ...formData, residence: e.target.value })}
                style={{ padding: '12px 14px', border: '1px solid #D1D5DB', borderRadius: '10px', fontSize: '14px', outline: 'none' }}
              />
            </div>
          </div>

          {/* Row 3: Address, Pin Code, State */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Address*</label>
              <input
                type="text"
                placeholder="Flat No, 302, Green Apartments"
                required
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                style={{ padding: '12px 14px', border: '1px solid #D1D5DB', borderRadius: '10px', fontSize: '14px', outline: 'none' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Pin Code*</label>
              <input
                type="text"
                placeholder="560102"
                required
                value={formData.pincode}
                onChange={e => setFormData({ ...formData, pincode: e.target.value })}
                style={{ padding: '12px 14px', border: '1px solid #D1D5DB', borderRadius: '10px', fontSize: '14px', outline: 'none' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>State*</label>
              <input
                type="text"
                placeholder="Karnataka"
                required
                value={formData.state}
                onChange={e => setFormData({ ...formData, state: e.target.value })}
                style={{ padding: '12px 14px', border: '1px solid #D1D5DB', borderRadius: '10px', fontSize: '14px', outline: 'none' }}
              />
            </div>
          </div>

          {/* Row 4: Password field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Create Password*</label>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              style={{ padding: '12px 14px', border: '1px solid #D1D5DB', borderRadius: '10px', fontSize: '14px', outline: 'none' }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              background: '#58A429',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              padding: '14px 20px',
              fontSize: '16px',
              fontWeight: 700,
              cursor: 'pointer',
              marginTop: '10px',
              transition: 'background 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseOver={e => e.currentTarget.style.background = '#478320'}
            onMouseOut={e => e.currentTarget.style.background = '#58A429'}
          >
            {loading ? 'Registering...' : 'Continue'}
          </button>

          {/* Social Logins */}
          <div style={{ margin: '20px 0 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '10px' }}>
              <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }}></div>
              <span style={{ fontSize: '12px', color: '#9CA3AF' }}>Or Log In with</span>
              <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }}></div>
            </div>
            
            <div style={{ display: 'flex', gap: '16px' }}>
              <button type="button" style={{ width: '44px', height: '44px', borderRadius: '50%', border: '1px solid #E5E7EB', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.48 14.97 1 12 1 7.35 1 3.37 3.65 1.4 7.56l3.92 3.04C6.27 7.74 8.92 5.04 12 5.04z"/><path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.35H12v4.51h6.48c-.29 1.56-1.17 2.87-2.5 3.75v3.1h4.03c2.37-2.18 3.73-5.39 3.73-9.01z"/><path fill="#FBBC05" d="M5.32 14.6c-.23-.69-.36-1.43-.36-2.2s.13-1.51.36-2.2L1.4 7.16C.51 8.94 0 10.91 0 13s.51 4.06 1.4 5.84l3.92-3.24z"/><path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-4.03-3.1c-1.12.75-2.54 1.2-3.93 1.2-3.08 0-5.73-2.7-6.68-5.56L1.4 15.84C3.37 19.75 7.35 23 12 23z"/></svg>
              </button>
              <button type="button" style={{ width: '44px', height: '44px', borderRadius: '50%', border: '1px solid #E5E7EB', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'center', fontSize: '13.5px', color: '#6B7280' }}>
            Already have an account? <Link to="/owner/login" style={{ color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}>Log In</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
