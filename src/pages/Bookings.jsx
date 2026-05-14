import React, { useState } from 'react';
import { Search, Filter, Calendar, CheckSquare, Clock, UserX } from 'lucide-react';

export default function Bookings() {
  const [searchTerm, setSearchTerm] = useState('');

  const bookingStats = [
    { label: "Active Stays", value: "3 Guests", icon: <CheckSquare size={18} />, color: "#10b981" },
    { label: "Upcoming Check-ins", value: "8 Bookings", icon: <Calendar size={18} />, color: "#3b82f6" },
    { label: "Pending Payouts", value: "$4,550", icon: <Clock size={18} />, color: "#f59e0b" },
    { label: "Cancelled This Month", value: "1 Booking", icon: <UserX size={18} />, color: "#ef4444" }
  ];

  const bookingsList = [
    {
      id: "BK-8842",
      property: "Bodhi Homestay",
      guest: "Rohan Sharma",
      contact: "+91 98765 43210",
      checkIn: "15 May 2026",
      checkOut: "18 May 2026",
      nights: 3,
      payout: "$420",
      status: "Confirmed"
    },
    {
      id: "BK-8841",
      property: "Whispering Palms Villa",
      guest: "Elena Rostova",
      contact: "+7 901 234-56-78",
      checkIn: "20 May 2026",
      checkOut: "25 May 2026",
      nights: 5,
      payout: "$1,250",
      status: "Confirmed"
    },
    {
      id: "BK-8840",
      property: "Bodhi Homestay",
      guest: "Amit Patel",
      contact: "+91 87654 32109",
      checkIn: "02 Jun 2026",
      checkOut: "05 Jun 2026",
      nights: 3,
      payout: "$390",
      status: "Pending"
    },
    {
      id: "BK-8839",
      property: "Serenity Hills Estate",
      guest: "David Miller",
      contact: "+1 (555) 019-2834",
      checkIn: "10 Jun 2026",
      checkOut: "17 Jun 2026",
      nights: 7,
      payout: "$2,800",
      status: "Confirmed"
    },
    {
      id: "BK-8838",
      property: "Whispering Palms Villa",
      guest: "Sarah Jenkins",
      contact: "+44 20 7946 0958",
      checkIn: "28 Jun 2026",
      checkOut: "02 Jul 2026",
      nights: 4,
      payout: "$1,100",
      status: "Confirmed"
    }
  ];

  return (
    <div className="dashboard-container fade-in">
      {/* Title */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, fontFamily: '"Outfit", sans-serif', color: '#111827' }}>Reservations</h2>
        <p style={{ color: '#6b7280', fontSize: 13, marginTop: 4 }}>Track all guest reservations, stay durations, and payouts</p>
      </div>

      {/* Booking Quick Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 16,
        marginBottom: 24
      }}>
        {bookingStats.map((stat, i) => (
          <div key={i} style={{
            background: '#ffffff',
            padding: 16,
            borderRadius: 12,
            border: '1px solid #f3f4f6',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: 16
          }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              background: `${stat.color}15`,
              color: stat.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase' }}>{stat.label}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginTop: 2 }}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Card Wrapper */}
      <div className="dashboard-card" style={{ padding: 24 }}>
        
        {/* Table Filters bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 10, flex: 1, minWidth: 260 }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input 
                type="text" 
                placeholder="Search Guest or ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 36px',
                  border: '1px solid #e5e7eb',
                  borderRadius: 8,
                  fontSize: 13,
                  outline: 'none'
                }}
              />
            </div>
            <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Filter size={14} /> Filter
            </button>
          </div>
          
          <div style={{ display: 'flex', gap: 10 }}>
            <select style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13, background: '#fff', color: '#4b5563' }}>
              <option>All Properties</option>
              <option>Bodhi Homestay</option>
              <option>Whispering Palms Villa</option>
              <option>Serenity Hills Estate</option>
            </select>
            <select style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13, background: '#fff', color: '#4b5563' }}>
              <option>Confirmed</option>
              <option>Pending</option>
              <option>Cancelled</option>
            </select>
          </div>
        </div>

        {/* Table wrapper */}
        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Property Name</th>
                <th>Guest</th>
                <th>Contact</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Nights</th>
                <th>Payout</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookingsList
                .filter(b => b.guest.toLowerCase().includes(searchTerm.toLowerCase()) || b.id.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((booking, index) => (
                  <tr key={index}>
                    <td style={{ fontWeight: 600, color: '#1d9e75' }}>{booking.id}</td>
                    <td style={{ fontWeight: 500 }}>{booking.property}</td>
                    <td style={{ fontWeight: 500, color: '#111827' }}>{booking.guest}</td>
                    <td>{booking.contact}</td>
                    <td>{booking.checkIn}</td>
                    <td>{booking.checkOut}</td>
                    <td>{booking.nights}</td>
                    <td style={{ fontWeight: 600, color: '#111827' }}>{booking.payout}</td>
                    <td>
                      <span className={`badge ${booking.status.toLowerCase()}`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
