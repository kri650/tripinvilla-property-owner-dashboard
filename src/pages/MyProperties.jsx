import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, Calendar, ChevronDown, CheckCircle2, XCircle, MoreVertical, Edit2, Trash2, ArrowUpRight, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { propertyService } from '../services/api';

export default function MyProperties() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    type: 'Homestay',
    name: '',
    bedRooms: 1,
    ownerContact: '',
    amenities: '',
    location: '',
    city: '',
    price: '',
    status: 'Active',
    description: ''
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [editId, setEditId] = useState(null);
  const [myProps, setMyProps] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMyProperties = async () => {
    try {
      const res = await propertyService.getMine();
      setMyProps(res.data);
    } catch (err) {
      console.error('Error fetching properties:', err);
    }
  };

  useEffect(() => {
    fetchMyProperties();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleEdit = (p) => {
    setEditId(p._id);
    setFormData({
      type: p.type || 'Homestay',
      name: p.name || '',
      bedRooms: p.bedrooms !== undefined ? p.bedrooms : (p.bedRooms || 1),
      ownerContact: p.ownerContact || '',
      amenities: Array.isArray(p.amenities) ? p.amenities.join(', ') : (p.amenities || ''),
      location: p.address || p.location || '',
      city: p.city || '',
      price: p.price_per_night !== undefined ? p.price_per_night : (p.price || ''),
      status: p.status || 'Active',
      description: p.description || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;
    try {
      await propertyService.delete(id);
      fetchMyProperties();
    } catch (err) {
      alert('Error deleting property');
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    try {
      await propertyService.updateStatus(id, newStatus);
      fetchMyProperties();
    } catch (err) {
      alert('Error updating status: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrls = [];
      if (selectedFiles.length > 0) {
        const uploadData = new FormData();
        selectedFiles.forEach(file => uploadData.append('images', file));
        const uploadRes = await propertyService.uploadImages(uploadData);
        imageUrls = uploadRes.data.urls;
      }

      const propertyData = {
        type: formData.type,
        name: formData.name,
        bedrooms: Number(formData.bedRooms),
        address: formData.location,
        city: formData.city,
        amenities: formData.amenities.split(',').map(a => a.trim()),
        price_per_night: Number(formData.price),
        status: formData.status,
        description: formData.description
      };
      
      if (imageUrls.length > 0) {
        propertyData.images = imageUrls;
      }

      if (editId) {
        await propertyService.update(editId, propertyData);
        alert('Property updated successfully!');
      } else {
        await propertyService.add(propertyData);
        alert('Property added successfully!');
      }
      
      fetchMyProperties();
      resetForm();
    } catch (err) {
      alert('Error saving property: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditId(null);
    setFormData({
      type: 'Homestay',
      name: '',
      bedRooms: 1,
      ownerContact: '',
      amenities: '',
      location: '',
      city: '',
      price: '',
      status: 'Active',
      description: ''
    });
    setSelectedFiles([]);
  };

  return (
    <div className="fade-in">
      <div style={{ height: '16px' }} />
      <div className="props-breadcrumb" style={{ margin: '0 39px 12px' }}>
        Property Management &gt; <span>My Properties</span>
      </div>

      <div className="dash-section" style={{ marginBottom: 16, padding: '24px' }}>
        <form id="property-form" onSubmit={handleSubmit} className="master-form-card" style={{ margin: 0, padding: 0, boxShadow: 'none', background: 'transparent' }}>
          <div className="master-form-header" style={{ marginBottom: '24px' }}>
            <h3 className="master-form-title" style={{ fontSize: '15px', fontWeight: 700, color: '#111827', fontFamily: '"Outfit", sans-serif' }}>
              {editId ? 'Edit Property' : 'Add New Property'}
            </h3>
            <div className="master-form-actions">
              {editId && (
                <button type="button" className="btn-outline-green" onClick={resetForm} style={{ marginRight: '10px' }}>Cancel</button>
              )}
              <button type="submit" className="btn-solid-green" disabled={loading} style={{ cursor: 'pointer', padding: '8px 24px', fontSize: '12.5px', background: '#58A429', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 600 }}>
                {loading ? 'Saving...' : (editId ? 'Update' : 'Add')}
              </button>
            </div>
          </div>

          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">Property Type*</label>
              <select className="form-select" name="type" value={formData.type} onChange={handleChange}>
                <option value="Homestay">Homestay</option>
                <option value="Villa">Villa</option>
                <option value="Apartment">Apartment</option>
                <option value="Resort">Resort</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Property Name*</label>
              <input type="text" className="form-input" name="name" value={formData.name} onChange={handleChange} placeholder="Enter property name" required />
            </div>
            <div className="form-group">
              <label className="form-label">Bedrooms*</label>
              <input type="number" className="form-input" name="bedRooms" value={formData.bedRooms} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">Location (Full Address)*</label>
              <input type="text" className="form-input" name="location" value={formData.location} onChange={handleChange} placeholder="Full address" required />
            </div>
            <div className="form-group">
              <label className="form-label">City*</label>
              <input type="text" className="form-input" name="city" value={formData.city} onChange={handleChange} placeholder="e.g. Kasol" required />
            </div>
            <div className="form-group">
              <label className="form-label">Amenities (Comma separated)*</label>
              <input type="text" className="form-input" name="amenities" value={formData.amenities} onChange={handleChange} placeholder="Barbeque, WiFi, Pool" required />
            </div>
          </div>

          <div className="form-grid-3" style={{ marginBottom: '16px' }}>
            <div className="form-group">
              <label className="form-label">Price per Night*</label>
              <input type="number" className="form-input" name="price" value={formData.price} onChange={handleChange} placeholder="₹ Amount" required />
            </div>
            <div className="form-group">
              <label className="form-label">Upload Images*</label>
              <div className="file-upload-wrapper" onClick={() => fileInputRef.current.click()} style={{ cursor: 'pointer' }}>
                <input type="text" className="file-upload-input" value={selectedFiles.length > 0 ? `${selectedFiles.length} files selected` : 'Click to browse'} readOnly />
                <button type="button" className="btn-browse"><Upload size={14} /></button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple hidden accept="image/*" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Status*</label>
              <select className="form-select" name="status" value={formData.status} onChange={handleChange}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            
            <div className="form-group" style={{ gridColumn: 'span 3', marginTop: '8px' }}>
              <label className="form-label">Description*</label>
              <textarea className="form-textarea" name="description" rows={3} value={formData.description} onChange={handleChange} placeholder="Write description about property..." required />
            </div>
          </div>
        </form>
      </div>

      <div className="dash-section" style={{ marginBottom: 24, padding: '24px' }}>
        <div className="chart-card" style={{ padding: 0, overflow: 'hidden', borderRadius: 12, border: 'none', boxShadow: 'none' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ whiteSpace: 'nowrap' }}>
              <thead>
                <tr>
                  {[
                    { label: 'Property No.', width: '12%' },
                    { label: 'Type', width: '10%' },
                    { label: 'Image', width: '8%' },
                    { label: 'Name', width: '25%' },
                    { label: 'City', width: '15%' },
                    { label: 'Price', width: '12%' },
                    { label: 'Status', width: '10%' },
                    { label: 'Actions', width: '8%' }
                  ].map((col, i) => (
                    <th key={i} style={{ color: '#374151', fontWeight: 600, padding: '14px 16px', width: col.width, textAlign: 'left' }}>{col.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {myProps.length > 0 ? myProps.map((p, i) => (
                  <tr key={i}>
                    <td style={{ color: '#58A429', fontWeight: 600, padding: '14px 16px' }}>{p.propertyNo}</td>
                    <td style={{ color: '#6B7280', padding: '14px 16px' }}>{p.type}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ width: 40, height: 30, background: '#E5E7EB', borderRadius: 6, overflow: 'hidden' }}>
                        <img src={p.images?.[0] || 'https://via.placeholder.com/40x30'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                      </div>
                    </td>
                    <td style={{ color: '#111827', fontWeight: 500, padding: '14px 16px' }}>{p.name}</td>
                    <td style={{ color: '#4B5563', padding: '14px 16px' }}>{p.city}</td>
                    <td style={{ color: '#111827', fontWeight: 500, padding: '14px 16px' }}>₹{p.price_per_night !== undefined ? p.price_per_night : p.price}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span 
                        className={`status-pill ${p.status === 'Active' ? 'active' : 'inactive'}`} 
                        onClick={() => handleStatusToggle(p._id, p.status)}
                        style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '4px', 
                          padding: '3px 10px', 
                          borderRadius: '20px', 
                          fontSize: '11px', 
                          fontWeight: 600, 
                          background: p.status === 'Active' ? '#DCFCE7' : '#FEE2E2', 
                          color: p.status === 'Active' ? '#58A429' : '#EF4444',
                          cursor: 'pointer',
                          userSelect: 'none'
                        }}
                        title="Click to toggle status"
                      >
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: p.status === 'Active' ? '#58A429' : '#EF4444' }}></span> {p.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button type="button" onClick={() => handleEdit(p)} style={{ color: '#58A429', background: 'none', border: 'none', cursor: 'pointer' }}><Edit2 size={14} /></button>
                        <button type="button" onClick={() => handleDelete(p._id)} style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>No properties found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
