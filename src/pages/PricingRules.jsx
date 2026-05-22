import React, { useState, useEffect } from 'react';
import { ChevronDown, Edit2, Trash2, MoreVertical, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PricingRules() {
  const navigate = useNavigate();
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: 'Aparthotel Stare Miasto, Deluxe',
    category: 'Homestay',
    roomType: 'Deluxe Room 1, Semi Deluxe 2',
    bedType: 'King Size 1',
    amenities: 'Barbeque, Pub & 2 others',
    price: '₹1,233 per night',
    checkIn: '9:00 AM',
    checkOut: '12:00 PM',
    offer: '20% Off',
    rules: "Must Read Rules\n• Primary Guest should be atleast 18 years of age.\n• Passport, Aadhaar, Driving License and Govt. ID are accepted as ID proof(s)",
    status: 'Active'
  });

  const fetchRules = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/pricing-rules', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setRules(data);
      }
    } catch (err) {
      console.error('Error fetching rules:', err);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editId 
        ? `http://localhost:5000/api/pricing-rules/${editId}` 
        : 'http://localhost:5000/api/pricing-rules';
      const method = editId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        alert(editId ? 'Rule updated successfully!' : 'Rule added successfully!');
        resetForm();
        fetchRules();
      } else {
        const errorData = await res.json();
        alert('Error: ' + errorData.message);
      }
    } catch (err) {
      alert('Error saving pricing rule: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (rule) => {
    setEditId(rule._id);
    setFormData({
      name: rule.name || '',
      category: rule.category || 'Homestay',
      roomType: rule.roomType || 'Deluxe Room 1, Semi Deluxe 2',
      bedType: rule.bedType || 'King Size 1',
      amenities: rule.amenities || '',
      price: rule.price || '',
      checkIn: rule.checkIn || '9:00 AM',
      checkOut: rule.checkOut || '12:00 PM',
      offer: rule.offer || '',
      rules: rule.rules || '',
      status: rule.status || 'Active'
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this pricing rule?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/pricing-rules/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        fetchRules();
      } else {
        alert('Error deleting pricing rule');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const resetForm = () => {
    setEditId(null);
    setFormData({
      name: 'Aparthotel Stare Miasto, Deluxe',
      category: 'Homestay',
      roomType: 'Deluxe Room 1, Semi Deluxe 2',
      bedType: 'King Size 1',
      amenities: 'Barbeque, Pub & 2 others',
      price: '₹1,233 per night',
      checkIn: '9:00 AM',
      checkOut: '12:00 PM',
      offer: '20% Off',
      rules: "Must Read Rules\n• Primary Guest should be atleast 18 years of age.\n• Passport, Aadhaar, Driving License and Govt. ID are accepted as ID proof(s)",
      status: 'Active'
    });
  };

  return (
    <div className="fade-in">
      {/* Breadcrumb with Back Link */}
      <div className="props-breadcrumb" style={{ margin: '0 39px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: '"Outfit", sans-serif' }}>
        <div>
          Masters &gt; <span style={{ color: '#111827', fontWeight: 600 }}>Pricing &amp; Rules Masters</span>
        </div>
        <button 
          onClick={() => navigate('/owner/properties')}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#58A429',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            fontWeight: 600
          }}
        >
          <ArrowLeft size={16} /> Back to My Properties
        </button>
      </div>

      {/* Form Section */}
      <div className="dash-section" style={{ 
        borderRadius: '18px', 
        border: '1px solid #EFF6E6',
        padding: '24px',
        boxSizing: 'border-box',
        marginTop: 0,
        marginBottom: '24px',
        background: '#FAFDF2'
      }}>
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '32px',
          border: '1px solid #EFF6E6',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.02)'
        }}>
          <form onSubmit={handleSubmit} className="master-form-card" style={{ margin: 0, padding: 0, boxShadow: 'none', background: 'transparent' }}>
            <div className="master-form-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="master-form-title" style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: 0, fontFamily: '"Outfit", sans-serif' }}>
                {editId ? 'Edit Pricing & Rules' : 'Add Pricing & Rules'}
              </h3>
              <div className="master-form-actions">
                {editId && (
                  <button type="button" onClick={resetForm} style={{ marginRight: '10px', padding: '8px 18px', fontSize: '13px', border: '1px solid #E5E7EB', borderRadius: '8px', cursor: 'pointer', background: '#fff', fontFamily: '"Outfit", sans-serif' }}>Cancel</button>
                )}
                <button 
                  type="submit" 
                  disabled={loading}
                  style={{ 
                    background: '#58A429', 
                    color: '#ffffff', 
                    borderRadius: '8px', 
                    padding: '10px 24px', 
                    fontWeight: 600, 
                    fontSize: '13px', 
                    border: 'none', 
                    cursor: 'pointer',
                    fontFamily: '"Outfit", sans-serif',
                    boxShadow: '0 2px 8px rgba(88, 164, 41, 0.2)'
                  }}
                >
                  {loading ? 'Saving...' : (editId ? 'Update' : 'Add')}
                </button>
              </div>
            </div>

            {/* Row 1: 3 cols */}
            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label" style={{ fontFamily: '"Outfit", sans-serif' }}>Property Name*</label>
                <input 
                  type="text" 
                  className="form-input" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Property Name"
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontFamily: '"Outfit", sans-serif' }}>Category*</label>
                <input 
                  type="text" 
                  className="form-input" 
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g. Homestay"
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontFamily: '"Outfit", sans-serif' }}>Room Type*</label>
                <div style={{ position: 'relative' }}>
                  <select 
                    className="form-select" 
                    name="roomType"
                    value={formData.roomType}
                    onChange={handleChange}
                    style={{ appearance: 'none', width: '100%' }}
                  >
                    <option value="Deluxe Room 1, Semi Deluxe 2">Deluxe Room 1, Semi Deluxe 2</option>
                    <option value="Suite Room">Suite Room</option>
                    <option value="Executive Room">Executive Room</option>
                    <option value="Normal Room">Normal Room</option>
                  </select>
                  <ChevronDown size={16} style={{ position: 'absolute', right: 16, top: 14, color: '#6B7280', pointerEvents: 'none' }} />
                </div>
              </div>
            </div>

            {/* Row 2: 3 cols */}
            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label" style={{ fontFamily: '"Outfit", sans-serif' }}>Bed Type*</label>
                <div style={{ position: 'relative' }}>
                  <select 
                    className="form-select" 
                    name="bedType"
                    value={formData.bedType}
                    onChange={handleChange}
                    style={{ appearance: 'none', width: '100%' }}
                  >
                    <option value="King Size 1">King Size 1</option>
                    <option value="Queen Size 2">Queen Size 2</option>
                    <option value="Double Bed">Double Bed</option>
                    <option value="Single Bed">Single Bed</option>
                  </select>
                  <ChevronDown size={16} style={{ position: 'absolute', right: 16, top: 14, color: '#6B7280', pointerEvents: 'none' }} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontFamily: '"Outfit", sans-serif' }}>Amenities Types*</label>
                <input 
                  type="text" 
                  className="form-input" 
                  name="amenities"
                  value={formData.amenities}
                  onChange={handleChange}
                  placeholder="Barbeque, Pub & 2 others"
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontFamily: '"Outfit", sans-serif' }}>Price for Room*</label>
                <input 
                  type="text" 
                  className="form-input" 
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="₹1,233 per night"
                  required 
                />
              </div>
            </div>

            {/* Row 3: 3 cols */}
            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label" style={{ fontFamily: '"Outfit", sans-serif' }}>Check-in*</label>
                <div style={{ position: 'relative' }}>
                  <select 
                    className="form-select" 
                    name="checkIn"
                    value={formData.checkIn}
                    onChange={handleChange}
                    style={{ appearance: 'none', width: '100%' }}
                  >
                    <option value="9:00 AM">9:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                  </select>
                  <ChevronDown size={16} style={{ position: 'absolute', right: 16, top: 14, color: '#6B7280', pointerEvents: 'none' }} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontFamily: '"Outfit", sans-serif' }}>Check Out*</label>
                <div style={{ position: 'relative' }}>
                  <select 
                    className="form-select" 
                    name="checkOut"
                    value={formData.checkOut}
                    onChange={handleChange}
                    style={{ appearance: 'none', width: '100%' }}
                  >
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="1:00 PM">1:00 PM</option>
                    <option value="2:00 PM">2:00 PM</option>
                  </select>
                  <ChevronDown size={16} style={{ position: 'absolute', right: 16, top: 14, color: '#6B7280', pointerEvents: 'none' }} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontFamily: '"Outfit", sans-serif' }}>Offer*</label>
                <input 
                  type="text" 
                  className="form-input" 
                  name="offer"
                  value={formData.offer}
                  onChange={handleChange}
                  placeholder="20% Off"
                  required 
                />
              </div>
            </div>

            {/* Row 4: Full width Textarea */}
            <div className="form-grid-1" style={{ marginBottom: 0 }}>
              <div className="form-group">
                <label className="form-label" style={{ fontFamily: '"Outfit", sans-serif' }}>Rules &amp; Regulations*</label>
                <textarea 
                  className="form-textarea" 
                  name="rules"
                  value={formData.rules}
                  onChange={handleChange}
                  style={{ minHeight: '120px', lineHeight: '1.6' }}
                  placeholder="Write rules..."
                  required
                />
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Table Section */}
      <div className="dash-section" style={{ 
        borderRadius: '18px', 
        border: '1px solid #EFF6E6',
        padding: '24px',
        boxSizing: 'border-box',
        marginTop: 0,
        marginBottom: '24px',
        background: '#FAFDF2'
      }}>
        <div style={{ 
          border: '1px solid #EFF6E6', 
          borderRadius: '16px', 
          padding: '32px',
          background: '#ffffff',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.02)'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '24px', fontFamily: '"Outfit", sans-serif' }}>Pricing &amp; Rules Masters</h3>
          
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', whiteSpace: 'nowrap' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <th style={{ color: '#9CA3AF', fontWeight: 500, fontSize: '12px', padding: '12px 14px' }}>Property Name</th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500, fontSize: '12px', padding: '12px 14px' }}>Category</th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500, fontSize: '12px', padding: '12px 14px' }}>Room Type</th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500, fontSize: '12px', padding: '12px 14px' }}>Bed Type</th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500, fontSize: '12px', padding: '12px 14px' }}>Amenities Types</th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500, fontSize: '12px', padding: '12px 14px' }}>Price for Room</th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500, fontSize: '12px', padding: '12px 14px' }}>Rules</th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500, fontSize: '12px', padding: '12px 14px' }}>Check-in &amp; Check Out</th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500, fontSize: '12px', padding: '12px 14px' }}>Offer</th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500, fontSize: '12px', padding: '12px 14px' }}>Status</th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500, fontSize: '12px', padding: '12px 14px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rules.length > 0 ? (
                  rules.map((p, i) => (
                    <tr key={p._id || i} style={{ borderBottom: '1px solid #F3F4F6' }}>
                      <td style={{ color: '#58A429', fontWeight: 600, padding: '14px' }}>{p.name}</td>
                      <td style={{ color: '#6B7280', padding: '14px' }}>{p.category}</td>
                      <td style={{ color: '#6B7280', padding: '14px' }}>{p.roomType}</td>
                      <td style={{ color: '#6B7280', padding: '14px' }}>{p.bedType}</td>
                      <td style={{ color: '#6B7280', padding: '14px', whiteSpace: 'pre-line', lineHeight: 1.4 }}>{p.amenities}</td>
                      <td style={{ color: '#6B7280', padding: '14px' }}>{p.price}</td>
                      <td style={{ color: '#9CA3AF', padding: '14px', whiteSpace: 'pre-line', lineHeight: 1.4, fontSize: '12px' }}>{p.rules}</td>
                      <td style={{ color: '#9CA3AF', padding: '14px', fontSize: '12px' }}>{p.checkIn} - {p.checkOut}</td>
                      <td style={{ color: '#6B7280', padding: '14px' }}>{p.offer}</td>
                      <td style={{ padding: '14px' }}>
                        <span className="status-pill active">{p.status || 'Active'}</span>
                      </td>
                      <td style={{ padding: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <button type="button" onClick={() => handleEdit(p)} style={{ color: '#58A429', background: 'none', border: 'none', cursor: 'pointer' }}><Edit2 size={14} /></button>
                          <button type="button" onClick={() => handleDelete(p._id)} style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" style={{ textAlign: 'center', padding: '40px 0', color: '#9CA3AF', fontSize: '13px' }}>
                      No pricing rules found. Configure one above!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
