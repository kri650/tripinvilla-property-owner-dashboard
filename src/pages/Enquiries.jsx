import React, { useState } from 'react';
import { Search, Filter as FilterIcon, Calendar, ChevronDown, MoreVertical } from 'lucide-react';

export default function Enquiries() {
  const [enquiriesList, setEnquiriesList] = useState([
    { id: '2020251', dates: '20 Feb - 12 PM to 3 Mar - 2 PM', name: 'Rohan Sharma', phone: '992388272', email: 'rohan@gmail.com', query: 'Want to know more about the cancellation policy and the refunds' },
    { id: '2020251', dates: '20 Feb - 12 PM to 3 Mar - 2 PM', name: 'Rohan Sharma', phone: '992388272', email: 'rohan@gmail.com', query: 'Want to know more about the cancellation policy and the refunds' },
    { id: '2020251', dates: '20 Feb - 12 PM to 3 Mar - 2 PM', name: 'Rohan Sharma', phone: '992388272', email: 'rohan@gmail.com', query: 'Want to know more about the cancellation policy and the refunds' },
    { id: '2020251', dates: '20 Feb - 12 PM to 3 Mar - 2 PM', name: 'Rohan Sharma', phone: '992388272', email: 'rohan@gmail.com', query: 'Want to know more about the cancellation policy and the refunds' },
    { id: '2020251', dates: '20 Feb - 12 PM to 3 Mar - 2 PM', name: 'Rohan Sharma', phone: '992388272', email: 'rohan@gmail.com', query: 'Want to know more about the cancellation policy and the refunds' },
  ]);

  return (
    <div className="fade-in">
      <div style={{ height: '16px' }} />

      {/* Breadcrumb */}
      <div className="props-breadcrumb" style={{ margin: '0 39px 12px' }}>
        User Access &gt; <span>Enquiries</span>
      </div>

      {/* ══ Section 1: Main Section with Enquiries table and filters ══ */}
      <div className="dash-section" style={{ marginBottom: 24, padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        
        {/* Card 1: Toolbar */}
        <div className="chart-card" style={{ padding: '16px 20px', borderRadius: 12, border: 'none', boxShadow: 'none' }}>
          <div className="props-table-toolbar" style={{ margin: 0, borderBottom: 'none' }}>
            <div className="props-table-title" style={{ fontSize: '15px', fontWeight: 700, color: '#111827', fontFamily: '"Outfit", sans-serif' }}>
              Enquiries
            </div>
            
            <div className="props-table-actions" style={{ gap: '10px', display: 'flex', flexWrap: 'wrap' }}>
              <div className="props-filter-select" style={{ cursor: 'pointer' }}>
                <Calendar size={13} style={{ color: '#6B7280' }} /> Date From <ChevronDown size={12} style={{ color: '#9CA3AF' }} />
              </div>
              <div className="props-filter-select" style={{ cursor: 'pointer' }}>
                <Calendar size={13} style={{ color: '#6B7280' }} /> Date To <ChevronDown size={12} style={{ color: '#9CA3AF' }} />
              </div>
              <div className="props-filter-select" style={{ cursor: 'pointer' }}>
                Property Type <ChevronDown size={12} style={{ color: '#9CA3AF' }} />
              </div>
              
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input 
                  type="text" 
                  placeholder="Location" 
                  style={{ 
                    padding: '6px 12px', 
                    fontSize: '12px', 
                    border: '1px solid #E5E7EB', 
                    borderRadius: '6px', 
                    width: '100px', 
                    background: '#ffffff',
                    outline: 'none'
                  }} 
                />
              </div>

              <button className="props-btn-filter" style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <FilterIcon size={13} style={{ color: '#58A429' }} /> Filter
              </button>
              
              <div className="props-search-wrap">
                <Search size={14} />
                <input type="text" placeholder="Search" style={{ outline: 'none' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Table */}
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
                {enquiriesList.map((e, i) => (
                  <tr key={i}>
                    <td style={{ color: '#58A429', fontWeight: 600, padding: '14px 16px' }}>{e.id}</td>
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
