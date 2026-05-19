import React, { useState, useEffect } from 'react';
import { ChevronDown, Edit2, Trash2, Clock, Info, ShieldAlert } from 'lucide-react';
import { propertyService, propertyRequestService } from '../services/api';

export default function PropertyRequests() {
  const [properties, setProperties] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    property_id: '',
    room_type: '',
    bed_type: 'King Size',
    price_per_room: '',
    checkin_time: '09:00 AM',
    checkout_time: '12:00 PM',
    offer_percent: '20% Off',
    rules: "Must Read Rules...\n• Primary Guest should be atleast 18 years of age.\n• Passport, Aadhaar, Driving License and Govt. ID are accepted as ID proof(s)"
  });

  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const availableAmenities = ['Barbeque', 'Pub', 'Pool', 'WiFi', 'Gym', 'AC', 'Kitchen', 'Parking'];

  // Fetch properties and requests
  const fetchData = async () => {
    try {
      const propsRes = await propertyService.getMine();
      setProperties(propsRes.data);
      
      // Select first property by default if available
      if (propsRes.data.length > 0) {
        const firstProp = propsRes.data[0];
        setFormData(prev => ({
          ...prev,
          property_id: firstProp._id,
          price_per_room: firstProp.price_per_night !== undefined ? firstProp.price_per_night : firstProp.price
        }));
      }

      const reqsRes = await propertyRequestService.getMine();
      setRequests(reqsRes.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle property dropdown change to auto-fill category and price
  const handlePropertyChange = (e) => {
    const propId = e.target.value;
    const selectedProp = properties.find(p => p._id === propId);
    
    setFormData(prev => ({
      ...prev,
      property_id: propId,
      price_per_room: selectedProp ? (selectedProp.price_per_night !== undefined ? selectedProp.price_per_night : selectedProp.price) : ''
    }));
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleAmenity = (amenity) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.property_id) {
      alert('Please select a property first.');
      return;
    }
    setLoading(true);

    try {
      const payload = {
        ...formData,
        price_per_room: Number(formData.price_per_room),
        amenities_types: selectedAmenities
      };

      await propertyRequestService.add(payload);
      alert('Property request submitted successfully for Admin approval!');
      
      // Reset only specific fields
      setFormData(prev => ({
        ...prev,
        room_type: '',
        rules: "Must Read Rules...\n• Primary Guest should be atleast 18 years of age.\n• Passport, Aadhaar, Driving License and Govt. ID are accepted as ID proof(s)"
      }));
      setSelectedAmenities([]);
      
      fetchData();
    } catch (err) {
      alert('Error submitting request: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property request?')) return;
    try {
      await propertyRequestService.delete(id);
      fetchData();
    } catch (err) {
      alert('Error deleting request');
    }
  };

  // Find active property details for category display
  const selectedProperty = properties.find(p => p._id === formData.property_id);
  const categoryValue = selectedProperty ? selectedProperty.type : 'N/A';

  return (
    <div className="fade-in">
      <div style={{ height: '16px' }} />
      <div className="props-breadcrumb" style={{ margin: '0 39px 12px' }}>
        Property Management &gt; <span>Property Requests</span>
      </div>

      {properties.length === 0 ? (
        <div style={{ margin: '20px 39px', padding: '32px', background: '#FFFBEB', border: '1px solid #F59E0B', borderRadius: '12px', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <ShieldAlert size={28} color="#D97706" />
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#92400E', margin: '0 0 4px 0' }}>No Properties Listed Yet</h4>
            <p style={{ fontSize: '13px', color: '#B45309', margin: 0 }}>You must list at least one property under "My Properties" before configuring room-level pricing and submitting requests for admin approval.</p>
          </div>
        </div>
      ) : (
        <>
          {/* Form Section */}
          <div className="dash-section" style={{ marginBottom: 16, padding: '24px' }}>
            <form onSubmit={handleSubmit} className="master-form-card" style={{ margin: 0, padding: 0, boxShadow: 'none', background: 'transparent' }}>
              <div className="master-form-header" style={{ marginBottom: '24px' }}>
                <h3 className="master-form-title" style={{ fontSize: '15px', fontWeight: 700, color: '#111827', fontFamily: '"Outfit", sans-serif' }}>
                  Configure Room Pricing & Rules (Property Request)
                </h3>
                <button 
                  type="submit" 
                  className="btn-solid-green" 
                  disabled={loading}
                  style={{ cursor: 'pointer', padding: '8px 24px', fontSize: '12.5px', background: '#58A429', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 600 }}
                >
                  {loading ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>

              {/* Row 1 */}
              <div className="form-grid-3">
                <div className="form-group">
                  <label className="form-label">Property Name*</label>
                  <select 
                    className="form-select" 
                    name="property_id" 
                    value={formData.property_id} 
                    onChange={handlePropertyChange}
                    required
                  >
                    {properties.map(p => (
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Category (Auto-filled)*</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={categoryValue} 
                    disabled 
                    style={{ background: '#F3F4F6', color: '#4B5563', cursor: 'not-allowed' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Room Type*</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    name="room_type" 
                    value={formData.room_type} 
                    onChange={handleInputChange} 
                    placeholder="e.g. Deluxe Room 1, Semi Deluxe 2" 
                    required 
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="form-grid-3">
                <div className="form-group">
                  <label className="form-label">Bed Type*</label>
                  <select 
                    className="form-select" 
                    name="bed_type" 
                    value={formData.bed_type} 
                    onChange={handleInputChange}
                    required
                  >
                    <option value="King Size">King Size</option>
                    <option value="Queen Size">Queen Size</option>
                    <option value="Single">Single</option>
                    <option value="Double">Double</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Price for Room (₹ per night)*</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    name="price_per_room" 
                    value={formData.price_per_room} 
                    onChange={handleInputChange} 
                    placeholder="₹ Amount" 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Offer*</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    name="offer_percent" 
                    value={formData.offer_percent} 
                    onChange={handleInputChange} 
                    placeholder="e.g. 20% Off" 
                    required 
                  />
                </div>
              </div>

              {/* Row 3 */}
              <div className="form-grid-3">
                <div className="form-group">
                  <label className="form-label">Check-in Time*</label>
                  <select 
                    className="form-select" 
                    name="checkin_time" 
                    value={formData.checkin_time} 
                    onChange={handleInputChange}
                    required
                  >
                    <option value="9:00 AM">9:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="01:00 PM">01:00 PM</option>
                    <option value="02:00 PM">02:00 PM</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Check-out Time*</label>
                  <select 
                    className="form-select" 
                    name="checkout_time" 
                    value={formData.checkout_time} 
                    onChange={handleInputChange}
                    required
                  >
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="01:00 PM">01:00 PM</option>
                    <option value="02:00 PM">02:00 PM</option>
                  </select>
                </div>
              </div>

              {/* Amenities Selector */}
              <div style={{ marginTop: '16px', marginBottom: '16px' }}>
                <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>Amenities Types*</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {availableAmenities.map(amenity => {
                    const isChecked = selectedAmenities.includes(amenity);
                    return (
                      <button
                        type="button"
                        key={amenity}
                        onClick={() => toggleAmenity(amenity)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '20px',
                          border: isChecked ? '1px solid #58A429' : '1px solid #D1D5DB',
                          background: isChecked ? '#ECFDF5' : '#FFFFFF',
                          color: isChecked ? '#58A429' : '#374151',
                          fontSize: '12px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {amenity}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Rules and Regulations */}
              <div className="form-grid-1" style={{ margin: 0 }}>
                <div className="form-group">
                  <label className="form-label">Rules & Regulations*</label>
                  <textarea 
                    className="form-textarea" 
                    name="rules"
                    rows={3} 
                    value={formData.rules} 
                    onChange={handleInputChange}
                    placeholder="Must Read Rules..."
                    required
                  />
                </div>
              </div>
            </form>
          </div>
        </>
      )}

      {/* Table Section */}
      <div className="dash-section" style={{ marginBottom: 24, padding: '24px' }}>
        <div className="chart-card" style={{ padding: 0, overflow: 'hidden', borderRadius: 12, border: 'none', boxShadow: 'none' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ whiteSpace: 'nowrap' }}>
              <thead>
                <tr>
                  {['Property Name', 'Category', 'Room Type', 'Bed Type', 'Amenities', 'Price', 'Rules', 'Check-in & Check-Out', 'Offer', 'Status', 'Actions'].map((h, i) => (
                    <th key={i} style={{ color: '#374151', fontWeight: 600, padding: '14px 16px', textAlign: 'left' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {requests.length > 0 ? requests.map((r, i) => {
                  const statusLabel = r.admin_status || 'pending';
                  let statusBg = '#FEF3C7';
                  let statusColor = '#D97706';

                  if (statusLabel === 'approved') {
                    statusBg = '#DCFCE7';
                    statusColor = '#58A429';
                  } else if (statusLabel === 'rejected') {
                    statusBg = '#FEE2E2';
                    statusColor = '#EF4444';
                  }

                  return (
                    <tr key={i}>
                      <td style={{ color: '#111827', fontWeight: 500, padding: '14px 16px' }}>{r.propertyName}</td>
                      <td style={{ color: '#6B7280', padding: '14px 16px' }}>{r.category}</td>
                      <td style={{ color: '#6B7280', padding: '14px 16px' }}>{r.room_type}</td>
                      <td style={{ color: '#6B7280', padding: '14px 16px' }}>{r.bed_type}</td>
                      <td style={{ color: '#6B7280', padding: '14px 16px' }}>
                        {r.amenities_types && r.amenities_types.length > 0 ? r.amenities_types.join(', ') : 'None'}
                      </td>
                      <td style={{ color: '#111827', fontWeight: 600, padding: '14px 16px' }}>₹{r.price_per_room}</td>
                      <td style={{ color: '#6B7280', padding: '14px 16px', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: '200px' }}>
                        {r.rules && r.rules.length > 35 ? `${r.rules.substring(0, 35)}...` : r.rules}
                      </td>
                      <td style={{ color: '#6B7280', padding: '14px 16px' }}>{r.checkin_time} - {r.checkout_time}</td>
                      <td style={{ color: '#111827', fontWeight: 600, padding: '14px 16px' }}>{r.offer_percent}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span className="status-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: statusBg, color: statusColor }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor }}></span> {statusLabel.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <button 
                          type="button" 
                          onClick={() => handleDelete(r._id)} 
                          style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan="11" style={{ textAlign: 'center', padding: '20px', color: '#6B7280' }}>No property requests submitted yet.</td>
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
