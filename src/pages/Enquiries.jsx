import React, { useEffect, useState } from 'react';
import { Search, Filter as FilterIcon, Calendar, ChevronDown, MoreVertical } from 'lucide-react';
import { enquiryService } from '../services/api';

export default function Enquiries() {
  const [enquiriesList, setEnquiriesList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [propertyType, setPropertyType] = useState('All');
  const [location, setLocation] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchEnquiries = async (isPolling = false) => {
    try {
      if (!isPolling) setLoading(true);
      const params = {};
      if (dateFrom) params.date_from = dateFrom;
      if (dateTo) params.date_to = dateTo;
      if (propertyType && propertyType !== 'All') params.property_type = propertyType;
      if (location) params.location = location;
      if (searchTerm) params.search = searchTerm;

      const res = await enquiryService.getFiltered(params);
      const rows = (res.data || []).map((e) => {
        const d = new Date(e.createdAt || Date.now());
        return {
          id: e._id || 'N/A',
          enquiryNo: e.enquiryNo || String(e._id || '').substring(0, 8),
          dates: d.toLocaleString(),
          name: e.user_name || e.name || 'Guest',
          phone: e.phone || 'N/A',
          email: e.email || 'N/A',
          query: e.query || e.message || 'Enquiry'
        };
      });
      setEnquiriesList(rows);
    } catch (err) {
      console.error('Error fetching enquiries:', err);
    } finally {
      if (!isPolling) setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();

    // Poll every 10 seconds for real-time updates
    const interval = setInterval(() => {
      fetchEnquiries(true);
    }, 10000);

    return () => clearInterval(interval);
  }, [dateFrom, dateTo, propertyType, location, searchTerm]);

  return (
    <div className="fade-in">
      <div style={{ height: '16px' }} />

      {/* Breadcrumb */}
      <div className="props-breadcrumb" style={{ margin: '0 39px 12px' }}>
        Enquiries &gt; <span>Inbox</span>
      </div>

      {/* ══ Main Section ══ */}
      <div className="dash-section" style={{ marginBottom: 24, padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        
        {/* Card 1: Toolbar Filters */}
        <div className="chart-card" style={{ padding: '16px 20px', borderRadius: 12, border: 'none', boxShadow: 'none' }}>
          <div className="props-table-toolbar" style={{ margin: 0, borderBottom: 'none' }}>
            <div className="props-table-title" style={{ fontSize: '15px', fontWeight: 700, color: '#111827', fontFamily: '"Outfit", sans-serif' }}>
              Enquiries Inbox
            </div>
            
            <div className="props-table-actions" style={{ gap: '10px', display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
              {/* Date From */}
              <div className="props-filter-select" style={{ padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: 500 }}>From:</span>
                <input 
                  type="date" 
                  value={dateFrom} 
                  onChange={(e) => setDateFrom(e.target.value)} 
                  style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '11.5px', color: '#374151' }} 
                />
              </div>

              {/* Date To */}
              <div className="props-filter-select" style={{ padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: 500 }}>To:</span>
                <input 
                  type="date" 
                  value={dateTo} 
                  onChange={(e) => setDateTo(e.target.value)} 
                  style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '11.5px', color: '#374151' }} 
                />
              </div>

              {/* Property Type Dropdown */}
              <select 
                value={propertyType} 
                onChange={(e) => setPropertyType(e.target.value)} 
                className="props-filter-select"
                style={{ border: '1px solid #E5E7EB', outline: 'none', fontSize: '12px', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', background: '#ffffff' }}
              >
                <option value="All">All Categories</option>
                <option value="Homestay">Homestay</option>
                <option value="Hotel">Hotel</option>
                <option value="Villa">Villa</option>
                <option value="Apartment">Apartment</option>
                <option value="Cottage">Cottage</option>
              </select>
              
              {/* Location Input */}
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input 
                  type="text" 
                  placeholder="Location" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={{ 
                    padding: '6px 12px', 
                    fontSize: '12px', 
                    border: '1px solid #E5E7EB', 
                    borderRadius: '6px', 
                    width: '110px', 
                    background: '#ffffff',
                    outline: 'none'
                  }} 
                />
              </div>

              {/* Filter Button */}
              <button 
                onClick={() => fetchEnquiries()}
                className="props-btn-filter" 
                style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
              >
                <FilterIcon size={13} style={{ color: '#58A429' }} /> Filter
              </button>
              
              {/* Search Bar */}
              <div className="props-search-wrap">
                <Search size={14} />
                <input
                  type="text"
                  placeholder="Search name/email/query..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ outline: 'none' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Table List */}
        <div className="chart-card" style={{ padding: 0, overflow: 'hidden', borderRadius: 12, border: 'none', boxShadow: 'none' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ whiteSpace: 'nowrap' }}>
              <thead>
                <tr>
                  {['Enquiry No.', 'Dates & Time', 'User Name', 'Phone No.', 'Email Address', 'Query', ''].map((h, i) => (
                    <th key={i} style={{ color: '#9CA3AF', fontWeight: 500, padding: '14px 16px' }}>
                      <span className="th-inner">
                        {h}
                        {h && <ChevronDown size={10} style={{ color: '#CBD5E1', marginLeft: 4 }} />}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" style={{ padding: '14px 16px', color: '#6B7280' }}>Loading enquiries...</td></tr>
                ) : enquiriesList.length === 0 ? (
                  <tr><td colSpan="7" style={{ padding: '14px 16px', color: '#6B7280' }}>No guest enquiries found in inbox.</td></tr>
                ) : enquiriesList.map((e) => (
                  <tr key={e.id}>
                    <td style={{ color: '#58A429', fontWeight: 600, padding: '14px 16px' }}>{e.enquiryNo}</td>
                    <td style={{ color: '#6B7280', padding: '14px 16px' }}>{e.dates}</td>
                    <td style={{ color: '#111827', fontWeight: 500, padding: '14px 16px' }}>{e.name}</td>
                    <td style={{ color: '#4B5563', padding: '14px 16px' }}>{e.phone}</td>
                    <td style={{ color: '#4B5563', padding: '14px 16px' }}>{e.email}</td>
                    <td style={{ color: '#6B7280', padding: '14px 16px', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: '320px' }}>{e.query}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <button className="action-dots">
                        <MoreVertical size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
