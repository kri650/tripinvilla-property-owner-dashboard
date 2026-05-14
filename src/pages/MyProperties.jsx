import React, { useState } from 'react';
import { Search, Filter, Calendar, ChevronDown, CheckCircle2, XCircle, MoreVertical, Edit2, Trash2, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MyProperties() {
  const navigate = useNavigate();

  // Form State
  const [propertyType, setPropertyType] = useState('Homestay');
  const [propertyName, setPropertyName] = useState('Aparthotel Stare Miasto, Deluxe');
  const [roomType, setRoomType] = useState('1 Deluxe 4 Normal');
  const [ownerContact, setOwnerContact] = useState('998877665544');
  const [amenitiesTypes, setAmenitiesTypes] = useState('Barbeque, Pub & 2 others');
  const [location, setLocation] = useState('Kasol, Himachal Pradesh, India');
  const [propertyPrice, setPropertyPrice] = useState('₹1,23,940');
  const [status, setStatus] = useState('Active');
  const [aboutProperty, setAboutProperty] = useState('Experience a comfortable and refined stay at Azure Bay Hotel, located in the heart of the city and designed for both leisure and business travelers.');
  const [fileName, setFileName] = useState('Image.jpg, Image.jpg');

  // List State
  const [myProps, setMyProps] = useState([
    { id: '1020251', type: 'Homestay', name: 'Bodhi Roots Homestay', owner: 'Navin Kumar', contact: '998877665', amenities: 'Barbeque, Pub & 2 others', location: 'Kasol, Himachal\nPradesh', about: 'Experience a comfortable and refined...', status: 'Active' },
    { id: '1020251', type: 'Homestay', name: 'Bodhi Roots Homestay', owner: 'Navin Kumar', contact: '998877665', amenities: 'Barbeque, Pub & 2 others', location: 'Kasol, Himachal\nPradesh', about: 'Experience a comfortable and refined...', status: 'Active' },
    { id: '1020251', type: 'Homestay', name: 'Bodhi Roots Homestay', owner: 'Navin Kumar', contact: '998877665', amenities: 'Barbeque, Pub & 2 others', location: 'Kasol, Himachal\nPradesh', about: 'Experience a comfortable and refined...', status: 'Active' },
    { id: '1020251', type: 'Homestay', name: 'Bodhi Roots Homestay', owner: 'Navin Kumar', contact: '998877665', amenities: 'Barbeque, Pub & 2 others', location: 'Kasol, Himachal\nPradesh', about: 'Experience a comfortable and refined...', status: 'Active' },
  ]);

  const handleAddProperty = (e) => {
    e.preventDefault();
    const newProp = {
      id: '1020251',
      type: propertyType,
      name: propertyName,
      owner: 'Jhon Doe',
      contact: ownerContact,
      amenities: amenitiesTypes,
      location: location.split(',')[0] + ', Himachal\nPradesh',
      about: aboutProperty.substring(0, 35) + '...',
      status: status
    };
    setMyProps([newProp, ...myProps]);
    alert('Property added successfully!');
  };

  return (
    <div className="fade-in">

      {/* Spacing under topbar */}
      <div style={{ height: '16px' }} />

      {/* Breadcrumb path indicator */}
      <div className="props-breadcrumb" style={{ margin: '0 39px 12px' }}>
        Property Management &gt; <span>My Properties</span>
      </div>

      {/* ══ Section 1: Form Card inside light green container ══ */}
      <div className="dash-section" style={{ marginBottom: 16, padding: '24px' }}>
        <form onSubmit={handleAddProperty} className="master-form-card" style={{ margin: 0, padding: 0, boxShadow: 'none', background: 'transparent' }}>
          
          {/* Form Header */}
          <div className="master-form-header" style={{ marginBottom: '24px' }}>
            <h3 className="master-form-title" style={{ fontSize: '15px', fontWeight: 700, color: '#111827', fontFamily: '"Outfit", sans-serif' }}>
              Add New Property
            </h3>
            <div className="master-form-actions">
              <button 
                type="button" 
                className="btn-outline-green" 
                onClick={() => navigate('/owner/requests')}
                style={{ cursor: 'pointer', padding: '8px 16px', fontSize: '12.5px', border: '1px solid #58A429', color: '#58A429', borderRadius: '8px', background: 'transparent', fontWeight: 600 }}
              >
                Edit Pricing & Rules
              </button>
              <button 
                type="submit" 
                className="btn-solid-green" 
                style={{ cursor: 'pointer', padding: '8px 24px', fontSize: '12.5px', background: '#58A429', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 600 }}
              >
                Add
              </button>
            </div>
          </div>

          {/* Form Fields Grid - Row 1 */}
          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">Property Type*</label>
              <select className="form-select" value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
                <option value="Homestay">Homestay</option>
                <option value="Villa">Villa</option>
                <option value="Apartment">Apartment</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Property Name*</label>
              <input 
                type="text" 
                className="form-input" 
                value={propertyName} 
                onChange={(e) => setPropertyName(e.target.value)}
                placeholder="Enter property name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Room Type*</label>
              <input 
                type="text" 
                className="form-input" 
                value={roomType} 
                onChange={(e) => setRoomType(e.target.value)}
                placeholder="e.g. 1 Deluxe 4 Normal"
              />
            </div>
          </div>

          {/* Form Fields Grid - Row 2 */}
          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">Owner Contact*</label>
              <input 
                type="text" 
                className="form-input" 
                value={ownerContact} 
                onChange={(e) => setOwnerContact(e.target.value)}
                placeholder="Enter contact number"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Amenities Types*</label>
              <input 
                type="text" 
                className="form-input" 
                value={amenitiesTypes} 
                onChange={(e) => setAmenitiesTypes(e.target.value)}
                placeholder="e.g. Barbeque, Pub & 2 others"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Location*</label>
              <input 
                type="text" 
                className="form-input" 
                value={location} 
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, State, Country"
              />
            </div>
          </div>

          {/* Form Fields Grid - Row 3 */}
          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">Property Price*</label>
              <input 
                type="text" 
                className="form-input" 
                value={propertyPrice} 
                onChange={(e) => setPropertyPrice(e.target.value)}
                placeholder="₹ Amount"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Upload Property Images* <span style={{ color: '#EF4444', fontWeight: 400, fontSize: '11px' }}>Supported File: jpg / max. 5mb</span></label>
              <div className="file-upload-wrapper">
                <input 
                  type="text" 
                  className="file-upload-input" 
                  value={fileName} 
                  readOnly 
                  style={{ pointerEvents: 'none' }}
                />
                <button type="button" className="btn-browse">Browse</button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Status*</label>
              <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Active">Active</option>
                <option value="In-Active">In-Active</option>
              </select>
            </div>
          </div>

          {/* About Textarea */}
          <div className="form-grid-1" style={{ margin: 0 }}>
            <div className="form-group">
              <label className="form-label">About Property*</label>
              <textarea 
                className="form-textarea" 
                rows={3} 
                value={aboutProperty} 
                onChange={(e) => setAboutProperty(e.target.value)}
                placeholder="Write description about property..."
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
                  {['Property No.', 'Property Type', 'Image', 'Property Name', 'Owner Name', 'Owner Contact', 'Amenities Types', 'Location', 'About Property', 'Status', ''].map((h, i) => (
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
                {myProps.map((p, i) => (
                  <tr key={i}>
                    <td style={{ color: '#58A429', fontWeight: 600, padding: '14px 16px' }}>{p.id}</td>
                    <td style={{ color: '#6B7280', padding: '14px 16px' }}>{p.type}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ width: 40, height: 30, background: '#E5E7EB', borderRadius: 6, overflow: 'hidden' }}>
                        <img 
                          src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=100&q=80" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                          alt="" 
                        />
                      </div>
                    </td>
                    <td style={{ color: '#111827', fontWeight: 500, padding: '14px 16px' }}>{p.name}</td>
                    <td style={{ color: '#111827', fontWeight: 500, padding: '14px 16px' }}>{p.owner}</td>
                    <td style={{ color: '#4B5563', padding: '14px 16px' }}>{p.contact}</td>
                    <td style={{ color: '#4B5563', padding: '14px 16px' }}>{p.amenities}</td>
                    <td style={{ color: '#6B7280', whiteSpace: 'pre-line', lineHeight: 1.4, padding: '14px 16px' }}>{p.location}</td>
                    <td style={{ color: '#6B7280', padding: '14px 16px', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: '200px' }}>{p.about}</td>
                    <td style={{ padding: '14px 16px' }}>
                      {p.status === 'Active'
                        ? <span className="status-pill active" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: '#DCFCE7', color: '#58A429' }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#58A429' }}></span> Active
                          </span>
                        : <span className="status-pill inactive" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: '#FEE2E2', color: '#EF4444' }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF4444' }}></span> In-Active
                          </span>
                      }
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
