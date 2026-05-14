import React, { useState } from 'react';
import { ChevronDown, MoreVertical, Edit2, Trash2 } from 'lucide-react';

export default function PropertyRequests() {
  // Form State
  const [propertyName, setPropertyName] = useState('Aparthotel Store Miasto, Deluxe');
  const [category, setCategory] = useState('Homestay');
  const [roomType, setRoomType] = useState('Deluxe Room 1, Semi Deluxe 2');
  const [bedType, setBedType] = useState('King Size 1');
  const [amenities, setAmenities] = useState('Barbeque, Pub & 2 others');
  const [price, setPrice] = useState('₹1,233 per night');
  const [checkIn, setCheckIn] = useState('9:00 AM');
  const [checkOut, setCheckOut] = useState('12:00 PM');
  const [offer, setOffer] = useState('20% Off');
  const [rules, setRules] = useState(
    "Must Read Rules...\n• Primary Guest should be atleast 18 years of age.\n• Passport, Aadhaar, Driving License and Govt. ID are accepted as ID proof(s)"
  );

  // Table State
  const [pricingRules, setPricingRules] = useState([
    { name: 'Aparthotel Stare Miasto, Deluxe', category: 'Home Stay', room: 'Deluxe Room 1', bed: 'King Size 1', amenities: 'Barbeque, Pub & 2 others', price: '₹1,233 per night', rules: 'Must Read Rules... Primary Guest should be atleast 18 years of age...', times: '12:00 PM - 12:00 PM', offer: '20% Off', status: 'Active' },
    { name: 'Aparthotel Stare Miasto, Deluxe', category: 'Home Stay', room: 'Deluxe Room 1', bed: 'King Size 1', amenities: 'Barbeque, Pub & 2 others', price: '₹1,233 per night', rules: 'Must Read Rules... Primary Guest should be atleast 18 years of age...', times: '12:00 PM - 12:00 PM', offer: '20% Off', status: 'Active' },
    { name: 'Aparthotel Stare Miasto, Deluxe', category: 'Home Stay', room: 'Deluxe Room 1', bed: 'King Size 1', amenities: 'Barbeque, Pub & 2 others', price: '₹1,233 per night', rules: 'Must Read Rules... Primary Guest should be atleast 18 years of age...', times: '12:00 PM - 12:00 PM', offer: '20% Off', status: 'Active' },
    { name: 'Aparthotel Stare Miasto, Deluxe', category: 'Home Stay', room: 'Deluxe Room 1', bed: 'King Size 1', amenities: 'Barbeque, Pub & 2 others', price: '₹1,233 per night', rules: 'Must Read Rules... Primary Guest should be atleast 18 years of age...', times: '12:00 PM - 12:00 PM', offer: '20% Off', status: 'Active' },
  ]);

  const handleAddRule = (e) => {
    e.preventDefault();
    const newRule = {
      name: propertyName,
      category: category,
      room: roomType.split(',')[0],
      bed: bedType,
      amenities: amenities,
      price: price,
      rules: rules.substring(0, 50) + '...',
      times: `${checkIn} - ${checkOut}`,
      offer: offer,
      status: 'Active'
    };
    setPricingRules([newRule, ...pricingRules]);
    alert('Pricing and rules configuration added!');
  };

  return (
    <div className="fade-in">

      <div style={{ height: '16px' }} />

      {/* Breadcrumb path */}
      <div className="props-breadcrumb" style={{ margin: '0 39px 12px' }}>
        Masters &gt; <span>Pricing & Rules Masters</span>
      </div>

      {/* ══ Section 1: Form Card inside light green container ══ */}
      <div className="dash-section" style={{ marginBottom: 16, padding: '24px' }}>
        <form onSubmit={handleAddRule} className="master-form-card" style={{ margin: 0, padding: 0, boxShadow: 'none', background: 'transparent' }}>
          
          {/* Form Header */}
          <div className="master-form-header" style={{ marginBottom: '24px' }}>
            <h3 className="master-form-title" style={{ fontSize: '15px', fontWeight: 700, color: '#111827', fontFamily: '"Outfit", sans-serif' }}>
              Add Pricing & Rules
            </h3>
            <button 
              type="submit" 
              className="btn-solid-green" 
              style={{ cursor: 'pointer', padding: '8px 24px', fontSize: '12.5px', background: '#58A429', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 600 }}
            >
              Add
            </button>
          </div>

          {/* Form Fields Grid - Row 1 */}
          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">Property Name*</label>
              <input 
                type="text" 
                className="form-input" 
                value={propertyName} 
                onChange={(e) => setPropertyName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category*</label>
              <input 
                type="text" 
                className="form-input" 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Room Type*</label>
              <select className="form-select" value={roomType} onChange={(e) => setRoomType(e.target.value)}>
                <option value="Deluxe Room 1, Semi Deluxe 2">Deluxe Room 1, Semi Deluxe 2</option>
                <option value="Standard Room">Standard Room</option>
              </select>
            </div>
          </div>

          {/* Form Fields Grid - Row 2 */}
          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">Bed Type*</label>
              <select className="form-select" value={bedType} onChange={(e) => setBedType(e.target.value)}>
                <option value="King Size 1">King Size 1</option>
                <option value="Queen Size 2">Queen Size 2</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Amenities Types*</label>
              <input 
                type="text" 
                className="form-input" 
                value={amenities} 
                onChange={(e) => setAmenities(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Price for Room*</label>
              <input 
                type="text" 
                className="form-input" 
                value={price} 
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          {/* Form Fields Grid - Row 3 */}
          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">Check-in*</label>
              <select className="form-select" value={checkIn} onChange={(e) => setCheckIn(e.target.value)}>
                <option value="9:00 AM">9:00 AM</option>
                <option value="12:00 PM">12:00 PM</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Check-Out*</label>
              <select className="form-select" value={checkOut} onChange={(e) => setCheckOut(e.target.value)}>
                <option value="12:00 PM">12:00 PM</option>
                <option value="11:00 AM">11:00 AM</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Offer*</label>
              <input 
                type="text" 
                className="form-input" 
                value={offer} 
                onChange={(e) => setOffer(e.target.value)}
              />
            </div>
          </div>

          {/* Rules and Regulations */}
          <div className="form-grid-1" style={{ margin: 0 }}>
            <div className="form-group">
              <label className="form-label">Rules & Regulations*</label>
              <textarea 
                className="form-textarea" 
                rows={4} 
                value={rules} 
                onChange={(e) => setRules(e.target.value)}
              />
            </div>
          </div>

        </form>
      </div>

      {/* ══ Section 2: Table Card inside light green container ══ */}
      <div className="dash-section" style={{ marginBottom: 24, padding: '24px' }}>
        <div className="chart-card" style={{ padding: 0, overflow: 'hidden', borderRadius: 12, border: 'none', boxShadow: 'none' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ whiteSpace: 'nowrap' }}>
              <thead>
                <tr>
                  {['Property Name', 'Category', 'Room Type', 'Bed Type', 'Amenities Types', 'Price for Room', 'Rules', 'Check-in & Check-Out', 'Offer', 'Status', ''].map((h, i) => (
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
                {pricingRules.map((p, i) => (
                  <tr key={i}>
                    <td style={{ color: '#111827', fontWeight: 500, padding: '14px 16px' }}>{p.name}</td>
                    <td style={{ color: '#6B7280', padding: '14px 16px' }}>{p.category}</td>
                    <td style={{ color: '#6B7280', padding: '14px 16px' }}>{p.room}</td>
                    <td style={{ color: '#6B7280', padding: '14px 16px' }}>{p.bed}</td>
                    <td style={{ color: '#6B7280', padding: '14px 16px' }}>{p.amenities}</td>
                    <td style={{ color: '#111827', fontWeight: 600, padding: '14px 16px' }}>{p.price}</td>
                    <td style={{ color: '#6B7280', padding: '14px 16px', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: '200px' }}>{p.rules}</td>
                    <td style={{ color: '#6B7280', padding: '14px 16px' }}>{p.times}</td>
                    <td style={{ color: '#111827', fontWeight: 600, padding: '14px 16px' }}>{p.offer}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className="status-pill active" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: '#DCFCE7', color: '#58A429' }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#58A429' }}></span> {p.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button style={{ color: '#58A429', background: 'none', border: 'none', cursor: 'pointer' }}><Edit2 size={14} /></button>
                        <button style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={14} /></button>
                        <button className="action-dots"><MoreVertical size={14} /></button>
                      </div>
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
