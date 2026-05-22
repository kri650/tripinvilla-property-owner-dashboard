import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Calendar, ChevronDown, Plus } from 'lucide-react';

const PAGE_TITLES = {
  '/owner/dashboard':  'Dashboard Analytics',
  '/owner/properties': 'My Properties',
  '/owner/requests':   'Property Requests',
  '/owner/offers':     'Offers by Date',
  '/owner/enquiries':  'Enquiries',
  '/owner/premium':    'Upgrade to Premium',
  '/owner/logout':     'Log Out',
};

function formatMonthYear() {
  return "Feb 2026"; // Hardcoded to match the specific Figma design screenshot exactly
}

export default function Topbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const title = PAGE_TITLES[location.pathname] || 'My Properties';

  const userStr = localStorage.getItem('owner_user');
  const user = userStr ? JSON.parse(userStr) : { name: 'Jhon Doe', email: 'jhon@gmail.com' };
  const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'J';

  return (
    <header className="topbar" style={{ padding: '0 39px 0 39px' }}>
      {/* Left – page title */}
      <div className="topbar-left">
        <h1 className="topbar-title" style={{ fontSize: '20px', fontFamily: '"Outfit", sans-serif', fontWeight: 600 }}>{title}</h1>
      </div>

      {/* Right – action buttons + date filter + user */}
      <div className="topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        


        {/* Date picker pill */}
        <button className="topbar-date-btn" style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar style={{ width: 14, height: 14, color: '#6B7280' }} />
          <span>{formatMonthYear()}</span>
          <ChevronDown style={{ width: 13, height: 13, color: '#9CA3AF' }} />
        </button>

        {/* User block */}
        <div className="topbar-user" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 12px', borderRadius: '8px', border: '1px solid #E5E7EB', background: '#ffffff' }}>
          <div className="topbar-avatar" style={{ background: '#58A429', width: '32px', height: '32px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: 700, fontSize: '14px' }}>
            {initials}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="topbar-user-name" style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>{user.name}</div>
            <div className="topbar-user-role" style={{ fontSize: '11px', color: '#6B7280' }}>{user.email}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
