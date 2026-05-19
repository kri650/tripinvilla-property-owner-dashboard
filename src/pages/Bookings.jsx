import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, CheckSquare, Clock, UserX } from 'lucide-react';
import { bookingService } from '../services/api';

export default function Bookings() {
  const [searchTerm, setSearchTerm] = useState('');
  const [bookingsList, setBookingsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await bookingService.getMine();
        setBookingsList(res.data);
      } catch (err) {
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const bookingStats = [
    { label: "Total Bookings", value: bookingsList.length, icon: <CheckSquare size={18} />, color: "#10b981" },
    { label: "Active Stays", value: bookingsList.filter(b => b.status === 'Confirmed').length, icon: <Calendar size={18} />, color: "#3b82f6" },
    { label: "Total Revenue", value: `₹${bookingsList.reduce((sum, b) => sum + b.totalPrice, 0).toLocaleString()}`, icon: <Clock size={18} />, color: "#f59e0b" },
    { label: "Cancelled", value: bookingsList.filter(b => b.status === 'Cancelled').length, icon: <UserX size={18} />, color: "#ef4444" }
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
              {loading ? (
                <tr><td colSpan="9" style={{ textAlign: 'center', padding: '20px' }}>Loading bookings...</td></tr>
              ) : bookingsList.length === 0 ? (
                <tr><td colSpan="9" style={{ textAlign: 'center', padding: '20px' }}>No bookings found.</td></tr>
              ) : bookingsList
                .filter(b => (b.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || b._id.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((booking, index) => (
                  <tr key={index}>
                    <td style={{ fontWeight: 600, color: '#1d9e75' }}>{booking.razorpayOrderId || booking._id.substring(0, 8)}</td>
                    <td style={{ fontWeight: 500 }}>{booking.property?.propertyName || booking.property?.name}</td>
                    <td style={{ fontWeight: 500, color: '#111827' }}>{booking.user?.name || 'Guest'}</td>
                    <td>{booking.user?.phone || 'N/A'}</td>
                    <td>{new Date(booking.checkIn).toLocaleDateString()}</td>
                    <td>{new Date(booking.checkOut).toLocaleDateString()}</td>
                    <td>{Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24))}</td>
                    <td style={{ fontWeight: 600, color: '#111827' }}>₹{booking.totalPrice}</td>
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
