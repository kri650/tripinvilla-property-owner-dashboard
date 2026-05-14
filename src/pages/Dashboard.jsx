import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Home, 
  DollarSign, 
  MessageSquare, 
  ArrowUpRight, 
  ChevronRight 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  // Mock stats
  const stats = [
    {
      title: "Total Bookings",
      value: "48",
      icon: <Calendar size={20} />,
      iconClass: "primary",
      trend: "+12.5%",
      trendUp: true,
      desc: "from last month"
    },
    {
      title: "My Properties",
      value: "3",
      icon: <Home size={20} />,
      iconClass: "success",
      trend: "Active",
      trendUp: true,
      desc: "Listings online"
    },
    {
      title: "Total Earnings",
      value: "$14,850",
      icon: <DollarSign size={20} />,
      iconClass: "warning",
      trend: "+18.2%",
      trendUp: true,
      desc: "payouts cleared"
    },
    {
      title: "Pending Enquiries",
      value: "5",
      icon: <MessageSquare size={20} />,
      iconClass: "info",
      trend: "-2.4%",
      trendUp: false,
      desc: "needs response"
    }
  ];

  // Mock recent bookings
  const recentBookings = [
    {
      id: "BK-8842",
      property: "Bodhi Homestay",
      guest: "Rohan Sharma",
      dates: "May 15 - May 18, 2026",
      amount: "$420",
      status: "Confirmed"
    },
    {
      id: "BK-8841",
      property: "Whispering Palms Villa",
      guest: "Elena Rostova",
      dates: "May 20 - May 25, 2026",
      amount: "$1,250",
      status: "Confirmed"
    },
    {
      id: "BK-8840",
      property: "Bodhi Homestay",
      guest: "Amit Patel",
      dates: "Jun 02 - Jun 05, 2026",
      amount: "$390",
      status: "Pending"
    },
    {
      id: "BK-8839",
      property: "Serenity Hills Estate",
      guest: "David Miller",
      dates: "Jun 10 - Jun 17, 2026",
      amount: "$2,800",
      status: "Confirmed"
    }
  ];

  return (
    <div className="dashboard-container fade-in">
      
      {/* Welcome Hero Card */}
      <div style={{
        background: 'linear-gradient(135deg, #1d9e75 0%, #11684c 100%)',
        borderRadius: 16,
        padding: '32px 40px',
        color: '#ffffff',
        marginBottom: 32,
        boxShadow: '0 10px 30px -10px rgba(29, 158, 117, 0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 20
      }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, fontFamily: '"Outfit", sans-serif', marginBottom: 8 }}>
            Welcome back, Navin!
          </h2>
          <p style={{ opacity: 0.9, fontSize: 13.5, maxWidth: 500, lineHeight: 1.5 }}>
            Your properties are performing exceptionally well this month. You have 3 new bookings starting in the next 7 days!
          </p>
        </div>
        <button 
          onClick={() => navigate('/owner/properties')}
          className="btn" 
          style={{ background: '#ffffff', color: '#1d9e75', padding: '12px 24px', borderRadius: 10, fontWeight: 700 }}
        >
          Manage Listings <ArrowUpRight size={16} />
        </button>
      </div>

      {/* Stats Cards Grid */}
      <div className="dashboard-stats-grid">
        {stats.map((item, index) => (
          <div key={index} className="stat-card">
            <div className="stat-card-header">
              <span className="stat-card-title">{item.title}</span>
              <div className={`stat-card-icon-wrap ${item.iconClass}`}>
                {item.icon}
              </div>
            </div>
            <div className="stat-card-value">{item.value}</div>
            <div className="stat-card-footer">
              <span className={`stat-trend ${item.trendUp ? 'up' : 'down'}`}>
                {item.trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {item.trend}
              </span>
              <span className="stat-desc">{item.desc}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Dashboard Content Row */}
      <div className="dashboard-row">
        
        {/* Left Card: Recent Bookings */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Recent Bookings</h3>
            <button onClick={() => navigate('/owner/bookings')} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }}>
              View All <ChevronRight size={14} />
            </button>
          </div>
          
          <div className="table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Property</th>
                  <th>Guest</th>
                  <th>Dates</th>
                  <th>Payout</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600, color: '#1d9e75' }}>{b.id}</td>
                    <td style={{ fontWeight: 500 }}>{b.property}</td>
                    <td>{b.guest}</td>
                    <td>{b.dates}</td>
                    <td style={{ fontWeight: 600 }}>{b.amount}</td>
                    <td>
                      <span className={`badge ${b.status.toLowerCase()}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Card: Quick Performance Overview */}
        <div className="dashboard-card" style={{ justifyContent: 'space-between' }}>
          <div>
            <div className="dashboard-card-header" style={{ marginBottom: 16 }}>
              <h3 className="dashboard-card-title">Performance Summary</h3>
            </div>
            
            <div style={{ padding: '8px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                <span style={{ color: '#4b5563' }}>Occupancy Rate</span>
                <span style={{ fontWeight: 600 }}>82%</span>
              </div>
              <div style={{ width: '100%', height: 6, background: '#f1f5f9', borderRadius: 3, marginBottom: 20 }}>
                <div style={{ width: '82%', height: '100%', background: '#1d9e75', borderRadius: 3 }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                <span style={{ color: '#4b5563' }}>Guest Satisfaction</span>
                <span style={{ fontWeight: 600 }}>4.8 / 5.0</span>
              </div>
              <div style={{ width: '100%', height: 6, background: '#f1f5f9', borderRadius: 3, marginBottom: 20 }}>
                <div style={{ width: '96%', height: '100%', background: '#10b981', borderRadius: 3 }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                <span style={{ color: '#4b5563' }}>Response Rate</span>
                <span style={{ fontWeight: 600 }}>95%</span>
              </div>
              <div style={{ width: '100%', height: 6, background: '#f1f5f9', borderRadius: 3 }}>
                <div style={{ width: '95%', height: '100%', background: '#3b82f6', borderRadius: 3 }} />
              </div>
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: 16, borderRadius: 10, marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 24 }}>💡</div>
            <p style={{ fontSize: 12, color: '#4b5563', lineHeight: 1.5, margin: 0 }}>
              <strong>Pro-tip:</strong> Updating your availability calendars weekly can boost listing views by up to 20%!
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
