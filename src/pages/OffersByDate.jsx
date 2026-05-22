import React, { useEffect, useMemo, useState } from 'react';
import { Search, Filter, Calendar, ChevronDown, MoreVertical, Edit2, Trash2, Clock } from 'lucide-react';
import { offerService, propertyRequestService } from '../services/api';

export default function OffersByDate() {
  // Form State
  const [selectedRequestId, setSelectedRequestId] = useState('');
  const [propertyId, setPropertyId] = useState('');
  const [category, setCategory] = useState('');
  const [roomType, setRoomType] = useState('');
  const [foods, setFoods] = useState('Pure Veg');
  const [amenities, setAmenities] = useState('');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('9:00 AM');
  const [offerPercent, setOfferPercent] = useState('20% Off');
  const [description, setDescription] = useState('Offer will applicable on first book');

  // State lists
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [offersList, setOffersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const mapOffer = (o) => {
    const od = o.offer_date ? new Date(o.offer_date) : (o.dateFrom ? new Date(o.dateFrom) : null);
    const dateFormatted = od ? od.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';
    const timeFormatted = o.offer_time || 'N/A';

    return {
      _id: o._id || o.id,
      id: o.offerId || 'N/A',
      dates: `${dateFormatted} at ${timeFormatted}`,
      name: o.propertyName || o.property_id?.name || 'Property',
      location: o.location || o.property_id?.location || 'N/A',
      category: o.category || 'N/A',
      room: o.room_type || o.room || 'N/A',
      foods: o.food_type || o.foods || 'N/A',
      amenities: Array.isArray(o.amenities) ? o.amenities.join(', ') : (o.amenities || 'N/A'),
      offer: (() => {
        const val = o.offer_percent || o.offerPercent || o.offer || '20% Off';
        const str = String(val).trim();
        if (/off/i.test(str)) return str;
        if (str.endsWith('%')) return `${str} Off`;
        return `${str}% Off`;
      })(),
      desc: o.description || o.desc || '',
      status: o.status || 'active'
    };
  };

  const refreshOffers = async () => {
    try {
      const res = await offerService.getMine();
      setOffersList((res.data || []).map(mapOffer));
    } catch (err) {
      console.error('Error fetching offers:', err);
    }
  };

  const init = async () => {
    try {
      setLoading(true);
      const reqsRes = await propertyRequestService.getMine();
      const approved = (reqsRes.data || []).filter(r => r.admin_status === 'approved');
      setApprovedRequests(approved);

      // Auto-select first request if available
      if (approved.length > 0) {
        const first = approved[0];
        setSelectedRequestId(first._id || first.id);
        setPropertyId(first.property_id || first.property?._id || '');
        setCategory(first.category || first.property?.type || 'Homestay');
        setRoomType(first.room_type || 'Deluxe Room');
        setAmenities(Array.isArray(first.amenities_types) ? first.amenities_types.join(', ') : '');
        setPrice(first.price_per_room || 0);
      }

      await refreshOffers();
    } catch (err) {
      console.error('Error loading page data:', err);
      setOffersList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    init();
  }, []);

  const handleRequestChange = (requestId) => {
    setSelectedRequestId(requestId);
    const req = approvedRequests.find(r => r._id === requestId || r.id === requestId);
    if (req) {
      setPropertyId(req.property_id || req.property?._id || '');
      setCategory(req.category || req.property?.type || 'Homestay');
      setRoomType(req.room_type || 'Deluxe Room');
      setAmenities(Array.isArray(req.amenities_types) ? req.amenities_types.join(', ') : '');
      setPrice(req.price_per_room || 0);
    } else {
      setPropertyId('');
      setCategory('');
      setRoomType('');
      setAmenities('');
      setPrice('');
    }
  };

  const handleCreateOffer = async (e) => {
    e.preventDefault();
    if (!propertyId) {
      alert('Please select a property configuration.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        property_id: propertyId,
        food_type: foods,
        offer_date: date,
        offer_time: time,
        offer_percent: offerPercent,
        description: description
      };

      await offerService.create(payload);
      await refreshOffers();
      alert('Promotional offer created successfully and is live instantly!');
    } catch (err) {
      console.error('Error creating offer:', err);
      alert(err.response?.data?.message || 'Failed to create offer.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteOffer = async (offerId) => {
    if (!offerId) return;
    const ok = confirm('Are you sure you want to delete this offer?');
    if (!ok) return;
    try {
      await offerService.remove(offerId);
      setOffersList((prev) => prev.filter((o) => o._id !== offerId));
    } catch (err) {
      console.error('Error deleting offer:', err);
      alert('Failed to delete offer.');
    }
  };

  const filteredOffers = useMemo(() => {
    if (!searchTerm) return offersList;
    const q = searchTerm.toLowerCase();
    return offersList.filter((o) =>
      (o.name || '').toLowerCase().includes(q) ||
      (o.location || '').toLowerCase().includes(q) ||
      (o.category || '').toLowerCase().includes(q) ||
      String(o.id || '').toLowerCase().includes(q)
    );
  }, [offersList, searchTerm]);

  return (
    <div className="fade-in">
      <div style={{ height: '16px' }} />

      {/* Breadcrumb */}
      <div className="props-breadcrumb" style={{ margin: '0 39px 12px' }}>
        Property Management &gt; <span>Offers by Date</span>
      </div>

      {/* ══ Section 1: Form Card ══ */}
      <div className="dash-section" style={{ marginBottom: 16, padding: '24px' }}>
        <form onSubmit={handleCreateOffer} className="master-form-card" style={{ margin: 0, padding: 0, boxShadow: 'none', background: 'transparent' }}>
          
          {/* Form Header */}
          <div className="master-form-header" style={{ marginBottom: '24px' }}>
            <h3 className="master-form-title" style={{ fontSize: '15px', fontWeight: 700, color: '#111827', fontFamily: '"Outfit", sans-serif' }}>
              Create Promotional Offer
            </h3>
            <button 
              type="submit" 
              className="btn-solid-green" 
              disabled={submitting}
              style={{ cursor: 'pointer', padding: '8px 24px', fontSize: '12.5px', background: '#58A429', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 600, opacity: submitting ? 0.7 : 1 }}
            >
              {submitting ? 'Adding...' : 'Add Offer'}
            </button>
          </div>

          {/* Form Fields Grid - Row 1 */}
          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">Property Name (Only Approved Properties)*</label>
              <select 
                className="form-select" 
                value={selectedRequestId} 
                onChange={(e) => handleRequestChange(e.target.value)}
                required
              >
                <option value="">Select approved configuration...</option>
                {approvedRequests.map(r => (
                  <option key={r._id || r.id} value={r._id || r.id}>
                    {r.propertyName || r.property?.name} ({r.room_type})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Category (Auto-filled)*</label>
              <input 
                type="text" 
                className="form-input" 
                value={category} 
                readOnly 
                disabled 
                placeholder="Select property first"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Room Type (Auto-filled)*</label>
              <input 
                type="text" 
                className="form-input" 
                value={roomType} 
                readOnly 
                disabled 
                placeholder="Select property first"
              />
            </div>
          </div>

          {/* Form Fields Grid - Row 2 */}
          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">Foods*</label>
              <select className="form-select" value={foods} onChange={(e) => setFoods(e.target.value)}>
                <option value="Pure Veg">Pure Veg</option>
                <option value="Non-Veg">Non-Veg</option>
                <option value="Both">Both</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Amenities Types (Auto-filled)*</label>
              <input 
                type="text" 
                className="form-input" 
                value={amenities} 
                readOnly 
                disabled 
                placeholder="Select property first"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Price for Room (Auto-filled)*</label>
              <input 
                type="text" 
                className="form-input" 
                value={price ? `₹${price} per night` : ''} 
                readOnly 
                disabled 
                placeholder="Select property first"
              />
            </div>
          </div>

          {/* Form Fields Grid - Row 3 */}
          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">Date (Valid Offer Date)*</label>
              <input 
                type="date" 
                className="form-input" 
                value={date} 
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Time (Offer Start Time)*</label>
              <input 
                type="text" 
                className="form-input" 
                value={time} 
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 9:00 AM"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Offer % (Discount)*</label>
              <input 
                type="text" 
                className="form-input" 
                value={offerPercent} 
                onChange={(e) => setOfferPercent(e.target.value)}
                placeholder="e.g. 20% Off"
                required
              />
            </div>
          </div>

          {/* Description Textarea */}
          <div className="form-grid-1" style={{ margin: 0 }}>
            <div className="form-group">
              <label className="form-label">Description*</label>
              <textarea 
                className="form-textarea" 
                rows={3} 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Offer applicable on first book"
                required
              />
            </div>
          </div>

        </form>
      </div>

      {/* Search Filter Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 39px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', background: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '6px 12px', width: '320px' }}>
          <Search size={16} style={{ color: '#9CA3AF', marginRight: '8px' }} />
          <input 
            type="text" 
            placeholder="Search offers..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: 'none', outline: 'none', width: '100%', fontSize: '13px' }}
          />
        </div>
      </div>

      {/* ══ Section 2: Table Card ══ */}
      <div className="dash-section" style={{ marginBottom: 24, padding: '24px' }}>
        <div className="chart-card" style={{ padding: 0, overflow: 'hidden', borderRadius: 12, border: 'none', boxShadow: 'none' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ whiteSpace: 'nowrap' }}>
              <thead>
                <tr>
                  {['Offer ID', 'Dates & Time', 'Property Name', 'Location', 'Category', 'Room', 'Foods', 'Amenities', 'Offer %', 'Description', 'Status', ''].map((h, i) => (
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
                  <tr><td colSpan="12" style={{ padding: '14px 16px', color: '#6B7280' }}>Loading offers...</td></tr>
                ) : filteredOffers.length === 0 ? (
                  <tr><td colSpan="12" style={{ padding: '14px 16px', color: '#6B7280' }}>No promotional offers found.</td></tr>
                ) : filteredOffers.map((o, i) => (
                  <tr key={o._id}>
                    <td style={{ color: '#58A429', fontWeight: 600, padding: '14px 16px' }}>{o.id}</td>
                    <td style={{ color: '#6B7280', padding: '14px 16px' }}>{o.dates}</td>
                    <td style={{ color: '#111827', fontWeight: 500, padding: '14px 16px' }}>{o.name}</td>
                    <td style={{ color: '#6B7280', padding: '14px 16px' }}>{o.location}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className="category-pill" style={{ background: '#F0FAF6', color: '#1d9e75', fontWeight: 500, padding: '3px 10px', borderRadius: '4px', fontSize: '11px' }}>
                        {o.category}
                      </span>
                    </td>
                    <td style={{ color: '#4B5563', padding: '14px 16px' }}>{o.room}</td>
                    <td style={{ color: '#4B5563', padding: '14px 16px' }}>{o.foods}</td>
                    <td style={{ color: '#4B5563', padding: '14px 16px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.amenities}</td>
                    <td style={{ color: '#111827', fontWeight: 600, padding: '14px 16px' }}>{o.offer}</td>
                    <td style={{ color: '#6B7280', padding: '14px 16px', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: '200px' }}>{o.desc}</td>
                    <td style={{ padding: '14px 16px' }}>
                      {o.status.toLowerCase() === 'active'
                        ? <span className="status-pill active" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: '#DCFCE7', color: '#58A429' }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#58A429' }}></span> Active
                          </span>
                        : <span className="status-pill inactive" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: '#FEE2E2', color: '#EF4444' }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF4444' }}></span> Expired
                          </span>
                      }
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button onClick={() => handleDeleteOffer(o._id)} style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={14} /></button>
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
