import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Home,
  ClipboardList,
  Tag,
  MessageSquare,
  Sparkles,
  LogOut,
} from 'lucide-react';

/* ─── Navigation Config (matches Owner Figma Dashboard exactly) ─────────────── */
const NAV_SECTIONS = [
  {
    label: 'Dashboard',
    items: [
      { label: 'Dashboard Analytics', icon: LayoutDashboard, to: '/owner/dashboard' },
    ],
  },
  {
    label: 'Property Management',
    items: [
      { label: 'My Properties',      icon: Home,          to: '/owner/properties' },
      { label: 'Property Requests',   icon: ClipboardList, to: '/owner/requests' },
      { label: 'Offers by Date',      icon: Tag,           to: '/owner/offers' },
    ],
  },
  {
    label: 'Enquiries',
    items: [
      { label: 'Enquiries',           icon: MessageSquare, to: '/owner/enquiries' },
    ],
  },
  {
    label: 'User Access',
    items: [
      { label: 'Upgrade to Premium',  icon: Sparkles,      to: '/owner/premium' },
      { label: 'Log Out',             icon: LogOut,        to: '/owner/logout' },
    ],
  },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      {/* ── Logo Container ─────────── */}
      <div className="sidebar-logo">
        <img 
          src="/tripinvilla_logo.png" 
          alt="Tripinstays" 
          className="sidebar-logo-img" 
        />
      </div>

      {/* ── Divider under Logo ── */}
      <div className="sidebar-divider" />

      {/* ── Navigation List ─────────────────────────────────── */}
      <nav className="sidebar-nav">
        {NAV_SECTIONS.map((section, idx) => (
          <div key={section.label} className="sidebar-section-group">
            <div className="sidebar-section-label">{section.label}</div>

            <div className="sidebar-nav-items">
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `nav-item${isActive ? ' active' : ''}`
                  }
                >
                  <span className="nav-icon">
                    <item.icon />
                  </span>
                  <span className="nav-label">{item.label}</span>
                </NavLink>
              ))}
            </div>

            {/* Render divider between sections, except after the last section */}
            {idx < NAV_SECTIONS.length - 1 && <div className="sidebar-divider" />}
          </div>
        ))}
      </nav>
    </aside>
  );
}
