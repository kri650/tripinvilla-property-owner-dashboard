import React, { useEffect, useMemo, useState } from 'react';
import { Search, Filter, Calendar, ChevronDown, MoreVertical, Edit2, Trash2, Clock } from 'lucide-react';
import { offerService, propertyService } from '../services/api';

export default function OffersByDate() {
  // Form State
  const [propertyName, setPropertyName] = useState('Aparthotel Stare Miasto, Deluxe');
  const [category, setCategory] = useState('Homestay');
  const [roomType, setRoomType] = useState('Deluxe Room 1, Semi Deluxe 2');
  const [foods, setFoods] = useState('Pure - Veg');
  const [amenities, setAmenities] = useState('Barbeque, Pub & 2 others');
  const [price, setPrice] = useState('₹1,233 per night');
  const [date, setDate] = useState('2025-12-12'); // 12 Dec, 2025
  const [time, setTime] = useState('9:00 AM');
  const [offerPercent, setOfferPercent] = useState('20% Off');
  const [description, setDescription] = useState('Offer will applicable on first book');

  // Table State
  const [offersList, setOffersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [ownerProperties, setOwnerProperties] = useState([]);

  const mapOffer = (o) => {
    const df = o.dateFrom ? new Date(o.dateFrom) : null;
    const dt = o.dateTo ? new Date(o.dateTo) : null;
    const dates = df && dt
      ? `${df.toLocaleDateString()} - ${dt.toLocaleDateString()}`
      : (df ? df.toLocaleDateString() : 'N/A');

    return {
      _id: o._id,
      id: o.offerId || String(o._id || '').substring(0, 8),
      dates,
      name: o.propertyName || o.propertyId?.name || 'Property',
      location: o.location || o.propertyId?.location || 'N/A',
      category: o.category || 'N/A',
      room: o.room || 'N/A',
      foods: o.foods || 'N/A',
      amenities: Array.isArray(o.amenities) ? o.amenities.join(', ') : (o.amenities || 'N/A'),
      offer: typeof o.offerPercent === 'number' ? `${o.offerPercent}% Off` : (o.offer || 'N/A'),
      desc: o.description || o.desc || '',
      status: o.status || 'Active'
    };
  };

  const refreshOffers = async () => {
    const res = await offerService.getMine();
    setOffersList((res.data || []).map(mapOffer));
  };

  useEffect(() => {
    const init = async () => {
      try {
        const [propsRes] = await Promise.all([
          propertyService.getMine()
        ]);
        setOwnerProperties(propsRes.data || []);
        await refreshOffers();
      } catch (err) {
        console.error('Error loading offers:', err);
        setOffersList([]);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleCreateOffer = (e) => {
    e.preventDefault();
    (async () => {
      try {
        const df = new Date(date);
        const dt = new Date(df.getTime() + 7 * 86400000);

        const pctMatch = String(offerPercent).match(/\d+/);
        const pct = pctMatch ? Number(pctMatch[0]) : 0;

        const propNameClean = String(propertyName).split(',')[0].trim().toLowerCase();
        const matchedProp = ownerProperties.find((p) => String(p.name || '').toLowerCase() === propNameClean)
          || ownerProperties.find((p) => String(p.name || '').toLowerCase().includes(propNameClean));

        const payload = {
          dateFrom: df,
          dateTo: dt,
          propertyId: matchedProp?._id,
          propertyName: matchedProp?.name || propertyName,
          location: matchedProp?.location || matchedProp?.city || 'N/A',
          category: matchedProp?.type || category,
          room: roomType,
          foods,
          amenities: String(amenities).split(',').map(s => s.trim()).filter(Boolean),
          offerPercent: pct,
          description
        };

        await offerService.create(payload);
        await refreshOffers();
        alert('Special offer created successfully!');
      } catch (err) {
        console.error('Error creating offer:', err);
        alert('Failed to create offer. Please check your server connection.');
      }
    })();
  };

  const handleDeleteOffer = async (offerId) => {
    if (!offerId) return;
    const ok = confirm('Delete this offer?');
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

      {/* ══ Section 1: Form Card inside light green container ══ */}
      <div className="dash-section" style={{ marginBottom: 16, padding: '24px' }}>
        <form onSubmit={handleCreateOffer} className="master-form-card" style={{ margin: 0, padding: 0, boxShadow: 'none', background: 'transparent' }}>
          
          {/* Form Header */}
          <div className="master-form-header" style={{ marginBottom: '24px' }}>
            <h3 className="master-form-title" style={{ fontSize: '15px', fontWeight: 700, color: '#111827', fontFamily: '"Outfit", sans-serif' }}>
              Offers by Date
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
              <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Homestay">Homestay</option>
                <option value="Villa">Villa</option>
                <option value="Apartment">Apartment</option>
              </select>
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
              <label className="form-label">Foods*</label>
              <select className="form-select" value={foods} onChange={(e) => setFoods(e.target.value)}>
                <option value="Pure - Veg">Pure - Veg</option>
                <option value="Non - Veg">Non - Veg</option>
                <option value="All Foods">All Foods</option>
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
              <label className="form-label">Date*</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="date" 
                  className="form-input" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)}
                  style={{ paddingRight: '36px' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Time*</label>
              <input 
                type="text" 
                className="form-input" 
                value={time} 
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 9:00 AM"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Offer*</label>
              <input 
                type="text" 
                className="form-input" 
                value={offerPercent} 
                onChange={(e) => setOfferPercent(e.target.value)}
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
                  {['Offer ID', 'Dates & Time', 'Property Name', 'Location', 'Category', 'Room', 'Foods', 'Amenities', 'Offer', 'Description', 'Status', ''].map((h, i) => (
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
                  <tr><td colSpan="12" style={{ padding: '14px 16px', color: '#6B7280' }}>No offers found.</td></tr>
                ) : filteredOffers.map((o, i) => (
                  <tr key={i}>
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
                    <td style={{ color: '#4B5563', padding: '14px 16px' }}>{o.amenities}</td>
                    <td style={{ color: '#111827', fontWeight: 600, padding: '14px 16px' }}>{o.offer}</td>
                    <td style={{ color: '#6B7280', padding: '14px 16px', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: '200px' }}>{o.desc}</td>
                    <td style={{ padding: '14px 16px' }}>
                      {o.status === 'Active'
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
                        <button style={{ color: '#58A429', background: 'none', border: 'none', cursor: 'pointer' }}><Edit2 size={14} /></button>
                        <button onClick={() => handleDeleteOffer(o._id)} style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={14} /></button>
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
