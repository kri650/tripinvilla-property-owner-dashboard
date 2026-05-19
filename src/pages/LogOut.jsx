import React, { useEffect } from 'react';
import { LogOut as LogOutIcon, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LogOut() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('owner_user');
  }, []);

  return (
    <div className="fade-in">
      <div style={{ height: '32px' }} />

      <div className="dash-section" style={{ minHeight: 300, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="chart-card" style={{ padding: '40px', borderRadius: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: '420px', border: 'none', boxShadow: 'none' }}>
          
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#FEE2E2', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
            <LogOutIcon size={28} />
          </div>

          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', fontFamily: '"Outfit", sans-serif', marginBottom: '8px' }}>
            Logged Out Successfully
          </h2>
          
          <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.5, marginBottom: '28px' }}>
            Thank you for using the TripInVilla Property Owner Portal. You have been securely logged out of your host session.
          </p>

          <button 
            onClick={() => navigate('/owner/login')}
            style={{ 
              background: '#58A429', 
              color: '#ffffff', 
              border: 'none', 
              borderRadius: '8px', 
              padding: '12px 24px', 
              fontWeight: 600, 
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              width: '100%',
              justifyContent: 'center'
            }}
          >
            Go Back to Properties <ArrowRight size={14} />
          </button>

        </div>
      </div>
    </div>
  );
}
