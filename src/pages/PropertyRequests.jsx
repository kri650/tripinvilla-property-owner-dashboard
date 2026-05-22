import React, { useState, useEffect, useRef } from 'react';
import { Trash2, ShieldAlert, Plus, CheckCircle } from 'lucide-react';
import { propertyService, propertyRequestService } from '../services/api';

const API_BASE = 'http://localhost:5000/api';

const defaultRules = [{ title: 'Must Read Rules', text: '• Primary Guest should be atleast 18 years of age.\n• Passport, Aadhaar, Driving License and Govt. ID are accepted as ID proof(s)' }];

const emptyRoom = () => ({
  room_type: '',
  bed_type: 'King Size',
  original_price: '',
  price_per_room: '',
  checkin_time: '09:00 AM',
  checkout_time: '12:00 PM',
});

export default function PropertyRequests() {
  const [properties, setProperties] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [propertyId, setPropertyId] = useState('');
  const [formData, setFormData] = useState(emptyRoom());
  const [rulesSections, setRulesSections] = useState(defaultRules);
  const [currentOffer, setCurrentOffer] = useState('');
  const [offersList, setOffersList] = useState(['20% Off']);
  const [selectedRoomImage, setSelectedRoomImage] = useState(null);
  const [roomImagePreview, setRoomImagePreview] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [availableAmenities, setAvailableAmenities] = useState([]);
  const [amenitiesLoading, setAmenitiesLoading] = useState(false);
  // Multi-room queue
  const [roomQueue, setRoomQueue] = useState([]);
  const imageInputRef = useRef(null);

  const fetchAmenities = async (propertyType) => {
    setAmenitiesLoading(true);
    try {
      const scope = propertyType || 'All';
      const res = await fetch(`${API_BASE}/admin/amenities/active?scope=${scope}`);
      const data = await res.json();
      if (Array.isArray(data)) setAvailableAmenities(data.map(a => a.amenitiesName));
    } catch {
      setAvailableAmenities(['WiFi', 'Parking', 'Pool', 'AC', 'Kitchen', 'Barbeque', 'Gym', 'Breakfast']);
    } finally {
      setAmenitiesLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const propsRes = await propertyService.getMine();
      setProperties(propsRes.data);
      if (propsRes.data.length > 0) {
        const first = propsRes.data[0];
        setPropertyId(first._id);
        fetchAmenities(first.type);
      } else {
        fetchAmenities('All');
      }
      const reqsRes = await propertyRequestService.getMine();
      setRequests(reqsRes.data);
    } catch {
      fetchAmenities('All');
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handlePropertyChange = (e) => {
    const propId = e.target.value;
    const sel = properties.find(p => p._id === propId);
    setPropertyId(propId);
    if (sel) { setSelectedAmenities([]); fetchAmenities(sel.type); }
  };

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const toggleAmenity = (a) => setSelectedAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);

  const handleAddRuleSection = () => setRulesSections(prev => [...prev, { title: '', text: '' }]);
  const handleRemoveRuleSection = (idx) => setRulesSections(prev => prev.filter((_, i) => i !== idx));
  const handleRuleSectionChange = (idx, field, value) => setRulesSections(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert('Max 5MB'); return; }
    setSelectedRoomImage(file);
    setRoomImagePreview(URL.createObjectURL(file));
  };

  const resetRoomForm = () => {
    setFormData(emptyRoom());
    setRulesSections(defaultRules);
    setOffersList([]);
    setCurrentOffer('');
    setSelectedRoomImage(null);
    setRoomImagePreview('');
    setSelectedAmenities([]);
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  // Add current room config to queue (upload image immediately)
  const handleAddToQueue = async () => {
    if (!propertyId) { alert('Select a property first.'); return; }
    if (!formData.room_type.trim()) { alert('Room Type is required.'); return; }
    if (!formData.price_per_room) { alert('Price per room is required.'); return; }

    setLoading(true);
    try {
      let roomImageUrl = '';
      if (selectedRoomImage) {
        const fd = new FormData();
        fd.append('images', selectedRoomImage);
        const res = await propertyService.uploadImages(fd);
        if (res.data?.urls?.length > 0) roomImageUrl = res.data.urls[0];
      }

      const formattedRules = rulesSections.map(sec => ({
        title: sec.title,
        points: sec.text.split('\n').filter(p => p.trim()).map(p => p.replace(/^[•\-\*]\s*/, '').trim())
      }));

      const roomEntry = {
        property_id: propertyId,
        room_type: formData.room_type,
        bed_type: formData.bed_type,
        original_price: formData.original_price ? Number(formData.original_price) : undefined,
        price_per_room: Number(formData.price_per_room),
        checkin_time: formData.checkin_time,
        checkout_time: formData.checkout_time,
        room_image_url: roomImageUrl,
        amenities_types: [...selectedAmenities],
        offers: [...offersList],
        rules: formattedRules,
        _preview_img: roomImagePreview,
      };

      setRoomQueue(prev => [...prev, roomEntry]);
      resetRoomForm();
    } catch (err) {
      alert('Error preparing room: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromQueue = (idx) => setRoomQueue(prev => prev.filter((_, i) => i !== idx));

  // Submit all queued rooms
  const handleSubmitAll = async (e) => {
    e.preventDefault();
    if (roomQueue.length === 0) { alert('Add at least one room to the queue first.'); return; }
    setLoading(true);
    try {
      for (const room of roomQueue) {
        const { _preview_img, ...payload } = room;
        await propertyRequestService.add(payload);
      }
      alert(`${roomQueue.length} room(s) submitted successfully for Admin approval!`);
      setRoomQueue([]);
      fetchData();
    } catch (err) {
      alert('Error submitting: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this request?')) return;
    try { await propertyRequestService.delete(id); fetchData(); }
    catch { alert('Error deleting'); }
  };

  const selectedProperty = properties.find(p => p._id === propertyId);
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
            <p style={{ fontSize: '13px', color: '#B45309', margin: 0 }}>Add at least one property under "My Properties" before configuring room pricing.</p>
          </div>
        </div>
      ) : (
        <>
          {/* ─── ROOM FORM ─── */}
          <div className="dash-section" style={{ marginBottom: 16, padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', fontFamily: '"Outfit", sans-serif', margin: 0 }}>
                Configure Room Pricing &amp; Rules
              </h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={handleAddToQueue}
                  disabled={loading}
                  style={{ cursor: 'pointer', padding: '8px 20px', fontSize: '12.5px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Plus size={14} /> {loading ? 'Uploading...' : 'Add Room'}
                </button>
                {roomQueue.length > 0 && (
                  <button
                    type="button"
                    onClick={handleSubmitAll}
                    disabled={loading}
                    style={{ cursor: 'pointer', padding: '8px 20px', fontSize: '12.5px', background: '#58A429', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600 }}
                  >
                    {loading ? 'Submitting...' : `Submit All Rooms (${roomQueue.length})`}
                  </button>
                )}
              </div>
            </div>

            {/* Property selector */}
            <div className="form-grid-3" style={{ marginBottom: '16px' }}>
              <div className="form-group">
                <label className="form-label">Property Name*</label>
                <select className="form-select" value={propertyId} onChange={handlePropertyChange} required>
                  {properties.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Category (Auto-filled)*</label>
                <input type="text" className="form-input" value={categoryValue} disabled style={{ background: '#F3F4F6', color: '#4B5563', cursor: 'not-allowed' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Room Type*</label>
                <input type="text" className="form-input" name="room_type" value={formData.room_type} onChange={handleInputChange} placeholder="e.g. Deluxe Room 1, Semi Deluxe 2" required />
              </div>
            </div>

            {/* Image, Bed, Prices */}
            <div className="form-grid-3" style={{ marginBottom: '16px' }}>
              <div className="form-group">
                <label className="form-label">Upload Room Image (Max 5MB)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input ref={imageInputRef} type="file" accept=".jpg,.jpeg,.png" onChange={handleImageChange}
                    style={{ flex: 1, padding: '8px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '13px', background: '#fff' }} />
                  {roomImagePreview && (
                    <img src={roomImagePreview} alt="preview" style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #E5E7EB', flexShrink: 0 }} />
                  )}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Bed Type*</label>
                <select className="form-select" name="bed_type" value={formData.bed_type} onChange={handleInputChange} required>
                  <option value="King Size">King Size</option>
                  <option value="Queen Size">Queen Size</option>
                  <option value="Single">Single</option>
                  <option value="Double">Double</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Original Price (₹)</label>
                <input type="number" className="form-input" name="original_price" value={formData.original_price} onChange={handleInputChange} placeholder="e.g. 118350" />
              </div>
              <div className="form-group">
                <label className="form-label">Price per Room (₹/night)*</label>
                <input type="number" className="form-input" name="price_per_room" value={formData.price_per_room} onChange={handleInputChange} placeholder="₹ Amount" required />
              </div>
              <div className="form-group">
                <label className="form-label">Check-in Time*</label>
                <select className="form-select" name="checkin_time" value={formData.checkin_time} onChange={handleInputChange}>
                  {['09:00 AM','10:00 AM','11:00 AM','12:00 PM','01:00 PM','02:00 PM'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Check-out Time*</label>
                <select className="form-select" name="checkout_time" value={formData.checkout_time} onChange={handleInputChange}>
                  {['10:00 AM','11:00 AM','12:00 PM','01:00 PM','02:00 PM'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            {/* Offers */}
            <div style={{ marginBottom: '16px' }}>
              <label className="form-label">Multiple Offers/Discounts</label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                <input type="text" className="form-input" value={currentOffer} onChange={e => setCurrentOffer(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (currentOffer.trim()) { setOffersList(p => [...p, currentOffer.trim()]); setCurrentOffer(''); } } }}
                  placeholder="e.g. 20% Off flat, Breakfast Included" style={{ flex: 1 }} />
                <button type="button" onClick={() => { if (currentOffer.trim()) { setOffersList(p => [...p, currentOffer.trim()]); setCurrentOffer(''); } }}
                  style={{ padding: '8px 16px', background: '#58A429', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}>
                  Add Offer
                </button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {offersList.map((off, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#ECFDF5', color: '#065F46', padding: '4px 12px', borderRadius: '16px', fontSize: '13px', border: '1px solid #A7F3D0' }}>
                    <span>{off}</span>
                    <button type="button" onClick={() => setOffersList(p => p.filter((_, i) => i !== idx))} style={{ background: 'none', border: 'none', color: '#059669', cursor: 'pointer', padding: 0 }}>&times;</button>
                  </div>
                ))}
                {offersList.length === 0 && <span style={{ fontSize: '13px', color: '#6B7280' }}>No offers added.</span>}
              </div>
            </div>

            {/* Amenities */}
            <div style={{ marginBottom: '16px' }}>
              <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>
                Amenities Types
                {selectedProperty && <span style={{ marginLeft: 8, fontSize: 11, color: '#9CA3AF', fontWeight: 400 }}>Showing for: <strong style={{ color: '#58A429' }}>{selectedProperty.type}</strong></span>}
              </label>
              {amenitiesLoading ? <div style={{ color: '#9CA3AF', fontSize: 13 }}>Loading amenities...</div> : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {availableAmenities.map(a => (
                    <button type="button" key={a} onClick={() => toggleAmenity(a)}
                      style={{ padding: '5px 13px', borderRadius: '20px', border: selectedAmenities.includes(a) ? '1px solid #58A429' : '1px solid #D1D5DB', background: selectedAmenities.includes(a) ? '#ECFDF5' : '#fff', color: selectedAmenities.includes(a) ? '#58A429' : '#374151', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}>
                      {a}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dynamic Rules */}
            <div>
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span>Dynamic Rules Sections</span>
                <button type="button" onClick={handleAddRuleSection} style={{ padding: '4px 12px', background: '#F3F4F6', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '12px', fontWeight: 600, color: '#374151', cursor: 'pointer' }}>
                  + Add Section
                </button>
              </label>
              {rulesSections.map((sec, idx) => (
                <div key={idx} style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '14px', marginBottom: '12px', position: 'relative' }}>
                  {rulesSections.length > 1 && (
                    <button type="button" onClick={() => handleRemoveRuleSection(idx)} style={{ position: 'absolute', top: '10px', right: '10px', background: '#FEE2E2', color: '#EF4444', border: 'none', borderRadius: '4px', width: '22px', height: '22px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}>&times;</button>
                  )}
                  <input type="text" placeholder="Section Title (e.g. Must Read Rules)" className="form-input" value={sec.title}
                    onChange={e => handleRuleSectionChange(idx, 'title', e.target.value)} style={{ marginBottom: '8px', fontWeight: 600 }} />
                  <textarea className="form-textarea" rows={3} value={sec.text}
                    onChange={e => handleRuleSectionChange(idx, 'text', e.target.value)}
                    placeholder="Each new line becomes a bullet point..." />
                </div>
              ))}
            </div>
          </div>

          {/* ─── ROOM QUEUE PREVIEW ─── */}
          {roomQueue.length > 0 && (
            <div className="dash-section" style={{ marginBottom: 16, padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: 0 }}>
                  Rooms Ready to Submit ({roomQueue.length})
                </h3>
                <button type="button" onClick={handleSubmitAll} disabled={loading}
                  style={{ cursor: 'pointer', padding: '8px 24px', fontSize: '13px', background: '#58A429', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600 }}>
                  {loading ? 'Submitting...' : `Submit All ${roomQueue.length} Room(s)`}
                </button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {roomQueue.map((room, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '12px', padding: '10px 16px', minWidth: '220px' }}>
                    {room._preview_img ? (
                      <img src={room._preview_img} alt={room.room_type} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
                    ) : (
                      <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <CheckCircle size={22} color="#10B981" />
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: '#065F46', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{room.room_type}</div>
                      <div style={{ fontSize: '12px', color: '#6B7280' }}>{room.bed_type} · ₹{room.price_per_room}/night</div>
                    </div>
                    <button type="button" onClick={() => handleRemoveFromQueue(idx)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', flexShrink: 0 }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── SUBMITTED REQUESTS TABLE ─── */}
          <div className="dash-section" style={{ marginBottom: 24, padding: '24px' }}>
            <div className="chart-card" style={{ padding: 0, overflow: 'hidden', borderRadius: 12, border: 'none', boxShadow: 'none' }}>
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table" style={{ whiteSpace: 'nowrap' }}>
                  <thead>
                    <tr>
                      {['Property', 'Category', 'Room Type', 'Bed', 'Amenities', 'Price', 'Rules', 'Check-in / Out', 'Offers', 'Status', 'Actions'].map((h, i) => (
                        <th key={i} style={{ color: '#374151', fontWeight: 600, padding: '14px 16px', textAlign: 'left' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {requests.length > 0 ? requests.map((r, i) => {
                      const statusLabel = r.admin_status || 'pending';
                      const statusBg = statusLabel === 'approved' ? '#DCFCE7' : statusLabel === 'rejected' ? '#FEE2E2' : '#FEF3C7';
                      const statusColor = statusLabel === 'approved' ? '#58A429' : statusLabel === 'rejected' ? '#EF4444' : '#D97706';
                      return (
                        <tr key={i}>
                          <td style={{ color: '#111827', fontWeight: 500, padding: '14px 16px' }}>{r.propertyName}</td>
                          <td style={{ color: '#6B7280', padding: '14px 16px' }}>{r.category}</td>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {r.room_image_url && <img src={r.room_image_url} alt={r.room_type} style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'cover' }} />}
                              <span style={{ color: '#6B7280' }}>{r.room_type}</span>
                            </div>
                          </td>
                          <td style={{ color: '#6B7280', padding: '14px 16px' }}>{r.bed_type}</td>
                          <td style={{ color: '#6B7280', padding: '14px 16px' }}>{r.amenities_types?.length > 0 ? r.amenities_types.join(', ') : 'None'}</td>
                          <td style={{ color: '#111827', fontWeight: 600, padding: '14px 16px' }}>₹{r.price_per_room}</td>
                          <td style={{ color: '#6B7280', padding: '14px 16px' }}>{Array.isArray(r.rules) ? `${r.rules.length} section(s)` : (r.rules?.length > 35 ? `${r.rules.substring(0, 35)}...` : r.rules)}</td>
                          <td style={{ color: '#6B7280', padding: '14px 16px' }}>{r.checkin_time} - {r.checkout_time}</td>
                          <td style={{ color: '#111827', fontWeight: 600, padding: '14px 16px' }}>{r.offers?.length > 0 ? r.offers.join(', ') : 'None'}</td>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: statusBg, color: statusColor }}>
                              <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor }} /> {statusLabel.toUpperCase()}
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <button type="button" onClick={() => handleDelete(r._id)} style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}>
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    }) : (
                      <tr><td colSpan="11" style={{ textAlign: 'center', padding: '20px', color: '#6B7280' }}>No property requests submitted yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
