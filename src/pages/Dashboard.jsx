import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Home, 
  DollarSign, 
  MessageSquare, 
  ArrowUpRight, 
  ChevronRight,
  ClipboardList,
  Clock,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { dashboardService, bookingService } from '../services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [statsData, setStatsData] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, bookingsRes] = await Promise.all([
          dashboardService.getStats(),
          bookingService.getMine()
        ]);
        setStatsData(statsRes.data);
        setRecentBookings(bookingsRes.data.slice(0, 5));
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '50px', textAlign: 'center', color: '#6B7280', fontSize: '15px', fontFamily: '"Outfit", sans-serif' }}>
        Loading dashboard...
      </div>
    );
  }

  const ownerName = JSON.parse(localStorage.getItem('owner_user'))?.name?.split(' ')[0] || 'Owner';

  return (
    <div className="fade-in" style={{ paddingBottom: '32px' }}>
      
      {/* Breadcrumb */}
      <div className="props-breadcrumb" style={{ margin: '0 39px 16px' }}>
        Dashboard &gt; <span>Dashboard Analytics</span>
      </div>

      {/* Welcome Hero Banner */}
      <div className="dash-section" style={{ 
        minHeight: 'auto', 
        marginBottom: '20px', 
        background: 'linear-gradient(135deg, #58A429 0%, #3d751c 100%)',
        color: '#ffffff',
        padding: '32px 40px',
        borderRadius: '16px',
        boxShadow: '0 10px 25px -5px rgba(88, 164, 41, 0.25)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, fontFamily: '"Outfit", sans-serif', marginBottom: '8px', color: '#ffffff' }}>
            Welcome back, {ownerName}!
          </h2>
          <p style={{ opacity: 0.9, fontSize: '14px', maxWidth: '520px', lineHeight: 1.5, color: '#f3f4f6', margin: 0 }}>
            {recentBookings.length > 0 
              ? `Your properties are performing well. You have ${recentBookings.length} bookings listed in your portal.` 
              : "Welcome to your owner portal! Add your first property to start receiving bookings."}
          </p>
        </div>
        <button 
          onClick={() => navigate('/owner/properties')}
          style={{ 
            background: '#ffffff', 
            color: '#58A429', 
            padding: '12px 24px', 
            borderRadius: '10px', 
            fontWeight: 700,
            fontSize: '14px',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            transition: 'transform 0.2s'
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'translateY(-1px)'}
          onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          Manage Listings <ArrowUpRight size={16} />
        </button>
      </div>

      {/* Stats Cards Section */}
      <div className="dash-section" style={{ minHeight: 'auto', boxSizing: 'border-box', justifyContent: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          
          {/* Card 1: Total Bookings */}
          <div className="props-stat-card" style={{ margin: 0, borderRadius: '14px', height: '140px', padding: '0 24px', border: '1px solid #EAEAEA', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
              <div className="props-stat-icon-wrap blue" style={{ width: '48px', height: '48px', borderRadius: '12px' }}>
                <Calendar style={{ width: '22px', height: '22px' }} />
              </div>
              <div className="props-stat-content">
                <div className="props-stat-label" style={{ fontSize: '13px', color: '#6B7280', fontWeight: 500 }}>Total Bookings</div>
                <div className="props-stat-value" style={{ fontSize: '28px', fontWeight: 700, color: '#111827', marginTop: '2px' }}>
                  {statsData?.totalBookings || "0"}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginTop: '10px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', background: '#EFF6FF', color: '#3B82F6', padding: '3px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>
                <TrendingUp size={11} style={{ marginRight: '3px' }} /> {statsData?.compareYesterday?.enquiries || '+04.6%'}
              </span>
              <span style={{ color: '#9CA3AF', fontSize: '11px', marginLeft: '8px' }}>Compared to yesterday</span>
            </div>
          </div>

          {/* Card 2: Active Properties */}
          <div className="props-stat-card" style={{ margin: 0, borderRadius: '14px', height: '140px', padding: '0 24px', border: '1px solid #EAEAEA', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
              <div className="props-stat-icon-wrap green" style={{ width: '48px', height: '48px', borderRadius: '12px' }}>
                <Home style={{ width: '22px', height: '22px' }} />
              </div>
              <div className="props-stat-content">
                <div className="props-stat-label" style={{ fontSize: '13px', color: '#6B7280', fontWeight: 500 }}>Active Properties</div>
                <div className="props-stat-value" style={{ fontSize: '28px', fontWeight: 700, color: '#111827', marginTop: '2px' }}>
                  {statsData?.activeProperties || "0"}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginTop: '10px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', background: '#FEE2E2', color: '#EF4444', padding: '3px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>
                <TrendingDown size={11} style={{ marginRight: '3px' }} /> -16.6%
              </span>
              <span style={{ color: '#9CA3AF', fontSize: '11px', marginLeft: '8px' }}>Compared to yesterday</span>
            </div>
          </div>

          {/* Card 3: Occupancy Rate */}
          <div className="props-stat-card" style={{ margin: 0, borderRadius: '14px', height: '140px', padding: '0 24px', border: '1px solid #EAEAEA', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
              <div className="props-stat-icon-wrap blue" style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#F5F3FF', color: '#8B5CF6' }}>
                <Clock style={{ width: '22px', height: '22px' }} />
              </div>
              <div className="props-stat-content">
                <div className="props-stat-label" style={{ fontSize: '13px', color: '#6B7280', fontWeight: 500 }}>Occupancy Rate</div>
                <div className="props-stat-value" style={{ fontSize: '28px', fontWeight: 700, color: '#111827', marginTop: '2px' }}>
                  {statsData?.occupancyRate || 0}%
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginTop: '10px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', background: '#F5F3FF', color: '#8B5CF6', padding: '3px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>
                <TrendingUp size={11} style={{ marginRight: '3px' }} /> {statsData?.compareYesterday?.occupancy || '+16.6%'}
              </span>
              <span style={{ color: '#9CA3AF', fontSize: '11px', marginLeft: '8px' }}>Compared to yesterday</span>
            </div>
          </div>

          {/* Card 4: Total Revenue */}
          <div className="props-stat-card" style={{ margin: 0, borderRadius: '14px', height: '140px', padding: '0 24px', border: '1px solid #EAEAEA', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
              <div className="props-stat-icon-wrap blue" style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#FEF3C7', color: '#D97706' }}>
                <DollarSign style={{ width: '22px', height: '22px' }} />
              </div>
              <div className="props-stat-content">
                <div className="props-stat-label" style={{ fontSize: '13px', color: '#6B7280', fontWeight: 500 }}>Total Earnings</div>
                <div className="props-stat-value" style={{ fontSize: '24px', fontWeight: 700, color: '#111827', marginTop: '2px' }}>
                  ₹{statsData?.totalRevenue?.toLocaleString() || "0"}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginTop: '10px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', background: '#FEF3C7', color: '#D97706', padding: '3px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>
                <TrendingUp size={11} style={{ marginRight: '3px' }} /> {statsData?.compareYesterday?.revenue || '+12.4%'}
              </span>
              <span style={{ color: '#9CA3AF', fontSize: '11px', marginLeft: '8px' }}>Compared to yesterday</span>
            </div>
          </div>

        </div>
      </div>

      {/* Main Content Grid: Recent Bookings Table & Performance Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr', gap: '20px', margin: '0 39px' }}>
        
        {/* Recent Bookings Card */}
        <div className="chart-card" style={{ padding: '24px', borderRadius: '16px', minHeight: '380px', justifyContent: 'flex-start' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', margin: 0 }}>Recent Bookings</h3>
            <button 
              onClick={() => navigate('/owner/bookings')} 
              style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#58A429', fontSize: '13px', fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer' }}
            >
              View All <ChevronRight size={16} />
            </button>
          </div>

          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr>
                  <th style={{ color: '#9CA3AF', fontWeight: 500, fontSize: '12px', padding: '12px 14px' }}>Booking ID</th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500, fontSize: '12px', padding: '12px 14px' }}>Property</th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500, fontSize: '12px', padding: '12px 14px' }}>Guest</th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500, fontSize: '12px', padding: '12px 14px' }}>Dates</th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500, fontSize: '12px', padding: '12px 14px' }}>Payout</th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500, fontSize: '12px', padding: '12px 14px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.length > 0 ? (
                  recentBookings.map((b, i) => {
                    const checkInStr = new Date(b.checkIn).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
                    const checkOutStr = new Date(b.checkOut).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
                    return (
                      <tr key={b._id || i} style={{ borderBottom: '1px solid #F3F4F6' }}>
                        <td style={{ fontWeight: 600, color: '#58A429', padding: '14px' }}>
                          {b.razorpayOrderId || b._id.substring(0, 8)}
                        </td>
                        <td style={{ fontWeight: 500, color: '#111827', padding: '14px' }}>
                          {b.property?.propertyName || b.property?.name || 'Unnamed Property'}
                        </td>
                        <td style={{ padding: '14px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 500, color: '#374151' }}>{b.user?.name || 'Guest'}</span>
                            <span style={{ fontSize: '11px', color: '#9CA3AF' }}>{b.user?.email}</span>
                          </div>
                        </td>
                        <td style={{ color: '#6B7280', padding: '14px' }}>
                          {checkInStr} - {checkOutStr}
                        </td>
                        <td style={{ fontWeight: 600, color: '#111827', padding: '14px' }}>
                          ₹{b.totalPrice?.toLocaleString()}
                        </td>
                        <td style={{ padding: '14px' }}>
                          {b.status === 'Paid' || b.status === 'Confirmed' ? (
                            <span className="status-pill active"><CheckCircle2 size={11} style={{ marginRight: '3px' }} /> {b.status}</span>
                          ) : b.status === 'Cancelled' ? (
                            <span className="status-pill inactive"><XCircle size={11} style={{ marginRight: '3px' }} /> {b.status}</span>
                          ) : (
                            <span className="status-pill pending"><Clock size={11} style={{ marginRight: '3px' }} /> {b.status}</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px 0', color: '#9CA3AF', fontSize: '13px' }}>
                      No recent bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance Overview Card */}
        <div className="chart-card" style={{ padding: '24px', borderRadius: '16px', justifyContent: 'space-between', minHeight: '380px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '24px', marginTop: 0 }}>
              Performance Summary
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', fontWeight: 500 }}>
                  <span style={{ color: '#4B5563' }}>Occupancy Rate</span>
                  <span style={{ color: '#111827', fontWeight: 600 }}>{statsData?.occupancyRate || 0}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#F3F4F6', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ width: `${statsData?.occupancyRate || 0}%`, height: '100%', background: '#58A429', borderRadius: '10px' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', fontWeight: 500 }}>
                  <span style={{ color: '#4B5563' }}>Guest Satisfaction</span>
                  <span style={{ color: '#111827', fontWeight: 600 }}>{statsData?.totalBookings > 0 ? '4.8 / 5.0' : '0.0 / 5.0'}</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#F3F4F6', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ width: `${statsData?.totalBookings > 0 ? 96 : 0}%`, height: '100%', background: '#3B82F6', borderRadius: '10px' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', fontWeight: 500 }}>
                  <span style={{ color: '#4B5563' }}>Response Rate</span>
                  <span style={{ color: '#111827', fontWeight: 600 }}>{statsData?.totalEnquiries > 0 ? '95%' : '0%'}</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#F3F4F6', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ width: `${statsData?.totalEnquiries > 0 ? 95 : 0}%`, height: '100%', background: '#8B5CF6', borderRadius: '10px' }} />
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: '#F9FAFB', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'flex-start', gap: '12px', border: '1px solid #F3F4F6', marginTop: '20px' }}>
            <span style={{ fontSize: '20px', lineHeight: 1 }}>💡</span>
            <p style={{ fontSize: '12px', color: '#4B5563', lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
              <strong>Pro-tip:</strong> Updating your availability calendars weekly can boost listing views by up to 20%!
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
