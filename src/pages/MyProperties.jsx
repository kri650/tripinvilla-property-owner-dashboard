import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, Calendar, ChevronDown, CheckCircle2, XCircle, MoreVertical, Edit2, Trash2, ArrowUpRight, Upload, TrendingUp, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { propertyService, dashboardService } from '../services/api';

export default function MyProperties() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    type: 'Homestay',
    name: '',
    roomType: '1 Deluxe 4 Normal',
    ownerContact: '',
    amenities: '',
    location: '',
    full_address: '',
    latitude: '',
    longitude: '',
    price: '',
    status: 'Active',
    description: '',
    checkIn: '3:00 PM',
    checkOut: '12:00 PM',
    rules: '• Primary Guest should be atleast 18 years of age.\n• Passport, Aadhaar, Driving License and Govt. ID are accepted as ID proof(s).',
    area: '31 sq. ft.',
    bedRooms: 1,
    beds: 2,
    capacity: 3,
    bathRooms: 1
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]); // Cloudinary URLs already saved
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [myProps, setMyProps] = useState([]);
  const [statsData, setStatsData] = useState(null);
  const [enquiryCounts, setEnquiryCounts] = useState({});
  const [loading, setLoading] = useState(false);
  // Amenities multi-select state
  const [selectedAmenitiesList, setSelectedAmenitiesList] = useState([]);
  const [availableAmenitiesList, setAvailableAmenitiesList] = useState([]);
  const [amenitiesLoading, setAmenitiesLoading] = useState(false);

  // Landmarks state
  const [landmarksList, setLandmarksList] = useState([]);
  const [landmarkName, setLandmarkName] = useState('');
  const [landmarkType, setLandmarkType] = useState('Tourist Popular');
  const [landmarkImageFile, setLandmarkImageFile] = useState(null);
  const [landmarkImagePreview, setLandmarkImagePreview] = useState('');
  const [landmarkImageUploading, setLandmarkImageUploading] = useState(false);
  const landmarkImageRef = useRef(null);

  // Filters State
  const [filterType, setFilterType] = useState('');
  const [filterSearch, setFilterSearch] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  const fetchMyProperties = async () => {
    try {
      const res = await propertyService.getMine();
      setMyProps(res.data);
    } catch (err) {
      console.error('Error fetching properties:', err);
    }
  };

  const fetchAmenitiesForType = async (propertyType) => {
    setAmenitiesLoading(true);
    try {
      const scope = propertyType || 'All';
      const res = await fetch(`http://localhost:5000/api/admin/amenities/active?scope=${scope}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setAvailableAmenitiesList(data.map(a => a.amenitiesName));
      }
    } catch (err) {
      setAvailableAmenitiesList(['WiFi', 'Parking', 'Pool', 'AC', 'Kitchen', 'Barbeque', 'Gym']);
    } finally {
      setAmenitiesLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await dashboardService.getStats();
      setStatsData(res.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const fetchEnquiries = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/owner-dashboard/enquiries', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        const counts = {};
        data.forEach(e => {
          const propId = e.property?._id || e.property;
          if (propId) {
            counts[propId] = (counts[propId] || 0) + 1;
          }
        });
        setEnquiryCounts(counts);
      }
    } catch (err) {
      console.error('Error fetching enquiries for counts:', err);
    }
  };

  useEffect(() => {
    fetchMyProperties();
    fetchStats();
    fetchEnquiries();
    fetchAmenitiesForType('Homestay'); // default type
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // When property type changes, reload amenities filtered by that scope
    if (name === 'type') {
      setSelectedAmenitiesList([]);
      fetchAmenitiesForType(value);
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const totalAllowed = 10 - existingImages.length;
    const combined = [...selectedFiles, ...newFiles].slice(0, totalAllowed);
    setSelectedFiles(combined);
    // Reset so same file can be re-added after removal
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveNewFile = (idx) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const handleRemoveExistingImage = (idx) => {
    setExistingImages(prev => prev.filter((_, i) => i !== idx));
  };

  const handleEdit = (p) => {
    setEditId(p._id);
    setShowForm(true);
    const pType = p.type || 'Homestay';
    const amenitiesArr = Array.isArray(p.amenities)
      ? p.amenities
      : (p.amenities || '').split(',').map(a => a.trim()).filter(Boolean);
    setSelectedAmenitiesList(amenitiesArr);
    fetchAmenitiesForType(pType);
    
    // Fetch existing landmarks for the property
    propertyService.getLandmarks(p._id)
      .then(res => setLandmarksList(res.data))
      .catch(err => console.error("Error fetching landmarks:", err));

    // Pre-load existing images
    setExistingImages(Array.isArray(p.images) ? p.images : []);
    setSelectedFiles([]);

    setFormData({
      type: pType,
      name: p.name || '',
      roomType: p.roomType || '1 Deluxe 4 Normal',
      ownerContact: p.ownerContact || '',
      amenities: Array.isArray(p.amenities) ? p.amenities.join(', ') : (p.amenities || ''),
      location: p.address || p.location || '',
      full_address: p.full_address || p.address || p.location || '',
      latitude: p.latitude || '',
      longitude: p.longitude || '',
      price: p.price_per_night !== undefined ? p.price_per_night : (p.price || ''),
      status: p.status || 'Active',
      description: p.description || '',
      checkIn: p.checkIn || '3:00 PM',
      checkOut: p.checkOut || '12:00 PM',
      rules: p.rules || '• Primary Guest should be atleast 18 years of age.\n• Passport, Aadhaar, Driving License and Govt. ID are accepted as ID proof(s).',
      area: p.area || '31 sq. ft.',
      bedRooms: p.bedRooms !== undefined ? p.bedRooms : 1,
      beds: p.beds !== undefined ? p.beds : 2,
      capacity: p.capacity !== undefined ? p.capacity : 3,
      bathRooms: p.bathRooms !== undefined ? p.bathRooms : 1
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;
    try {
      await propertyService.delete(id);
      fetchMyProperties();
      fetchStats();
    } catch (err) {
      alert('Error deleting property');
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    try {
      await propertyService.updateStatus(id, newStatus);
      fetchMyProperties();
      fetchStats();
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

      // Merge kept existing images with newly uploaded ones
      const allImages = [...existingImages, ...imageUrls];
      if (allImages.length < 1) {
        alert('Please add at least 1 property image.');
        setLoading(false);
        return;
      }

      const propertyData = {
        type: formData.type,
        name: formData.name,
        roomType: formData.roomType,
        ownerContact: formData.ownerContact,
        address: formData.location,
        location: formData.location,
        full_address: formData.full_address || formData.location,
        latitude: formData.latitude ? Number(formData.latitude) : undefined,
        longitude: formData.longitude ? Number(formData.longitude) : undefined,
        amenities: selectedAmenitiesList.length > 0
          ? selectedAmenitiesList
          : formData.amenities.split(',').map(a => a.trim()).filter(Boolean),
        price_per_night: Number(formData.price),
        price: Number(formData.price),
        status: formData.status,
        description: formData.description,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        rules: formData.rules,
        area: formData.area,
        bedRooms: Number(formData.bedRooms),
        beds: Number(formData.beds),
        capacity: Number(formData.capacity),
        bathRooms: Number(formData.bathRooms)
      };
      
      if (allImages.length > 0) {
        propertyData.images = allImages;
      }

      if (editId) {
        await propertyService.update(editId, propertyData);
        alert('Property updated successfully!');
      } else {
        const createdProp = await propertyService.add(propertyData);
        const newId = createdProp.data.id || createdProp.data._id;
        // Sync any locally added landmarks with the new property
        for (const lm of landmarksList) {
          await propertyService.addLandmark(newId, lm);
        }
        alert('Property added successfully!');
      }
      
      fetchMyProperties();
      fetchStats();
      resetForm();
    } catch (err) {
      alert('Error saving property: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleAddLandmark = async () => {
    if (!landmarkName.trim()) return;
    setLandmarkImageUploading(true);
    let imageUrl = '';
    try {
      if (landmarkImageFile) {
        const uploadData = new FormData();
        uploadData.append('images', landmarkImageFile);
        const uploadRes = await propertyService.uploadImages(uploadData);
        if (uploadRes.data && uploadRes.data.urls && uploadRes.data.urls.length > 0) {
          imageUrl = uploadRes.data.urls[0];
        }
      }
    } catch (err) {
      console.error('Image upload failed', err);
    } finally {
      setLandmarkImageUploading(false);
    }

    const lmData = { landmark_name: landmarkName.trim(), landmark_type: landmarkType, landmark_image_url: imageUrl };
    
    if (editId) {
      try {
        const res = await propertyService.addLandmark(editId, lmData);
        setLandmarksList(prev => [...prev, res.data]);
      } catch (err) {
        alert('Failed to add landmark');
      }
    } else {
      setLandmarksList(prev => [...prev, lmData]);
    }
    setLandmarkName('');
    setLandmarkImageFile(null);
    setLandmarkImagePreview('');
    if (landmarkImageRef.current) landmarkImageRef.current.value = '';
  };

  const handleRemoveLandmark = async (idx, lm) => {
    if (editId && lm._id) {
      try {
        await propertyService.deleteLandmark(lm._id);
        setLandmarksList(prev => prev.filter((_, i) => i !== idx));
      } catch (err) {
        alert('Failed to remove landmark');
      }
    } else {
      setLandmarksList(prev => prev.filter((_, i) => i !== idx));
    }
  };

  const resetForm = () => {
    setEditId(null);
    setShowForm(false);
    setSelectedAmenitiesList([]);
    setLandmarksList([]);
    setLandmarkName('');
    setLandmarkType('Tourist Popular');
    setFormData({
      type: 'Homestay',
      name: '',
      roomType: '1 Deluxe 4 Normal',
      ownerContact: '',
      amenities: '',
      location: '',
      full_address: '',
      latitude: '',
      longitude: '',
      price: '',
      status: 'Active',
      description: '',
      checkIn: '3:00 PM',
      checkOut: '12:00 PM',
      rules: '• Primary Guest should be atleast 18 years of age.\n• Passport, Aadhaar, Driving License and Govt. ID are accepted as ID proof(s).',
      area: '31 sq. ft.',
      bedRooms: 1,
      beds: 2,
      capacity: 3,
      bathRooms: 1
    });
    setSelectedFiles([]);
  };

  const filteredProps = myProps.filter(p => {
    const matchesSearch = filterSearch.trim() === '' || 
      p.name?.toLowerCase().includes(filterSearch.toLowerCase()) ||
      p.city?.toLowerCase().includes(filterSearch.toLowerCase()) ||
      (p.address || p.location || '').toLowerCase().includes(filterSearch.toLowerCase()) ||
      p.propertyNo?.toString().includes(filterSearch);

    const matchesType = filterType === '' || p.type === filterType;

    let matchesDate = true;
    if (p.createdAt) {
      const pDate = new Date(p.createdAt);
      pDate.setHours(0, 0, 0, 0);
      
      if (filterDateFrom) {
        const fromDate = new Date(filterDateFrom);
        fromDate.setHours(0, 0, 0, 0);
        if (pDate < fromDate) matchesDate = false;
      }
      if (filterDateTo) {
        const toDate = new Date(filterDateTo);
        toDate.setHours(0, 0, 0, 0);
        if (pDate > toDate) matchesDate = false;
      }
    } else if (filterDateFrom || filterDateTo) {
      matchesDate = false;
    }

    return matchesSearch && matchesType && matchesDate;
  });

  const ownerUser = JSON.parse(localStorage.getItem('owner_user')) || {};
  const ownerName = ownerUser.name || 'Jhon Doe';
  const ownerEmail = ownerUser.email || 'jhon@gmail.com';
  const ownerInitial = ownerName.charAt(0).toUpperCase();

  return (
    <div className="fade-in">
      <div style={{ height: '16px' }} />
      {/* Breadcrumb */}
      <div className="props-breadcrumb" style={{ margin: '0 39px 12px', fontSize: '13px', color: '#6B7280', fontFamily: '"Outfit", sans-serif' }}>
        Property Management &gt; <span style={{ color: '#111827', fontWeight: 600 }}>My Properties</span>
      </div>

      {/* Unified Figma Dashboard Card - Green Background Div */}
      <div className="dash-section" style={{ 
        borderRadius: '18px', 
        border: '1px solid #EFF6E6',
        padding: '24px',
        boxSizing: 'border-box',
        marginTop: 0,
        background: '#FAFDF2'
      }}>
        
        {/* Inner White Background Card */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '32px',
          border: '1px solid #EFF6E6',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.02)'
        }}>
          {/* Card Header Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '20px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: 0, fontFamily: '"Outfit", sans-serif' }}>My Properties</h2>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              {/* Add Property Button */}
              <button 
                onClick={() => {
                  resetForm();
                  setShowForm(!showForm);
                }}
                style={{ 
                  background: '#58A429', 
                  color: '#ffffff', 
                  borderRadius: '8px', 
                  padding: '10px 20px', 
                  fontWeight: 600, 
                  fontSize: '13px', 
                  border: 'none', 
                  cursor: 'pointer',
                  fontFamily: '"Outfit", sans-serif',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 8px rgba(88, 164, 41, 0.2)'
                }}
              >
                {showForm && !editId ? 'Hide Form' : 'Add Property'}
              </button>
            </div>
          </div>

          {/* Stats Section */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            
            {/* Card 1: Total Enquiries */}
            <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #EFF6E6', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: 500, fontFamily: '"Outfit", sans-serif' }}>Total Enquiries (Today)</span>
              <span style={{ fontSize: '32px', fontWeight: 700, color: '#111827', fontFamily: '"Outfit", sans-serif' }}>
                {statsData?.totalEnquiries !== undefined ? statsData.totalEnquiries : 0}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', background: '#E8F5EE', color: '#58A429', padding: '3px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>
                  <TrendingUp size={11} /> + 04.6%
                </span>
                <span style={{ color: '#9CA3AF', fontSize: '11px', fontFamily: '"Outfit", sans-serif' }}>Compared to yesterday</span>
              </div>
            </div>

            {/* Card 2: Active Properties */}
            <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #EFF6E6', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: 500, fontFamily: '"Outfit", sans-serif' }}>Active Properties</span>
              <span style={{ fontSize: '32px', fontWeight: 700, color: '#111827', fontFamily: '"Outfit", sans-serif' }}>
                {myProps.filter(p => p.status === 'Active').length}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', background: '#FEE2E2', color: '#EF4444', padding: '3px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>
                  <TrendingDown size={11} /> - 16.6%
                </span>
                <span style={{ color: '#9CA3AF', fontSize: '11px', fontFamily: '"Outfit", sans-serif' }}>Compared to yesterday</span>
              </div>
            </div>

            {/* Card 3: Response Rate */}
            <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #EFF6E6', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: 500, fontFamily: '"Outfit", sans-serif' }}>Response Rate</span>
              <span style={{ fontSize: '32px', fontWeight: 700, color: '#111827', fontFamily: '"Outfit", sans-serif' }}>
                {statsData?.totalEnquiries > 0 ? '95%' : '95%'}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', background: '#E8F5EE', color: '#58A429', padding: '3px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>
                  <TrendingUp size={11} /> + 16.6%
                </span>
                <span style={{ color: '#9CA3AF', fontSize: '11px', fontFamily: '"Outfit", sans-serif' }}>Compared to yesterday</span>
              </div>
            </div>

          </div>
        </div>

        {/* Toggled Form Editor Section */}
        {showForm && (
          <div style={{ marginTop: '24px', padding: '32px', background: '#ffffff', border: '1.5px dashed #58A429', borderRadius: '16px', position: 'relative' }}>
            <form id="property-form" onSubmit={handleSubmit} className="master-form-card" style={{ margin: 0, padding: 0, boxShadow: 'none', background: 'transparent' }}>
              <div className="master-form-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className="master-form-title" style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: 0, fontFamily: '"Outfit", sans-serif' }}>
                  {editId ? 'Edit Property Details' : 'Add New Property'}
                </h3>
                <div className="master-form-actions" style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    type="button" 
                    onClick={() => navigate('/owner/pricing-rules')}
                    style={{ 
                      background: '#ffffff', 
                      color: '#58A429', 
                      border: '1.5px solid #58A429', 
                      borderRadius: '24px', 
                      padding: '8px 24px', 
                      fontWeight: 600, 
                      fontSize: '13px', 
                      cursor: 'pointer',
                      fontFamily: '"Outfit", sans-serif',
                      transition: 'all 0.2s ease-in-out'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#FAFDF2';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = '#ffffff';
                    }}
                  >
                    Edit Pricing & Rules
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading} 
                    style={{ 
                      background: '#58A429', 
                      color: '#ffffff', 
                      border: 'none', 
                      borderRadius: '24px', 
                      padding: '8px 32px', 
                      fontWeight: 600, 
                      fontSize: '13px', 
                      cursor: 'pointer',
                      fontFamily: '"Outfit", sans-serif',
                      boxShadow: '0 2px 8px rgba(88, 164, 41, 0.2)'
                    }}
                  >
                    {loading ? 'Saving...' : (editId ? 'Update' : 'Add')}
                  </button>
                </div>
              </div>

              <div className="form-grid-3">
                <div className="form-group">
                  <label className="form-label" style={{ fontFamily: '"Outfit", sans-serif' }}>Property Type*</label>
                  <select className="form-select" name="type" value={formData.type} onChange={handleChange}>
                    <option value="Homestay">Homestay</option>
                    <option value="Villa">Villa</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Resort">Resort</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontFamily: '"Outfit", sans-serif' }}>Property Name*</label>
                  <input type="text" className="form-input" name="name" value={formData.name} onChange={handleChange} placeholder="Enter property name" required />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontFamily: '"Outfit", sans-serif' }}>Room Type*</label>
                  <input type="text" className="form-input" name="roomType" value={formData.roomType} onChange={handleChange} placeholder="e.g. 1 Deluxe 4 Normal" required />
                </div>
              </div>

              <div className="form-grid-3">
                <div className="form-group">
                  <label className="form-label" style={{ fontFamily: '"Outfit", sans-serif' }}>Owner Contact*</label>
                  <input type="text" className="form-input" name="ownerContact" value={formData.ownerContact} onChange={handleChange} placeholder="Owner contact number" required />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label" style={{ fontFamily: '"Outfit", sans-serif' }}>
                    Amenities Types *
                    <span style={{ marginLeft: 8, fontSize: 11, color: '#9CA3AF', fontWeight: 400 }}>
                      Showing amenities for: <strong style={{ color: '#58A429' }}>{formData.type}</strong>
                    </span>
                  </label>
                  {amenitiesLoading ? (
                    <div style={{ color: '#9CA3AF', fontSize: 13 }}>Loading amenities...</div>
                  ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                      {availableAmenitiesList.map(am => {
                        const isSelected = selectedAmenitiesList.includes(am);
                        return (
                          <button
                            key={am} type="button"
                            onClick={() => setSelectedAmenitiesList(prev =>
                              prev.includes(am) ? prev.filter(a => a !== am) : [...prev, am]
                            )}
                            style={{
                              padding: '5px 13px', borderRadius: 20, fontSize: 12, fontWeight: 500,
                              border: isSelected ? '1.5px solid #58A429' : '1px solid #D1D5DB',
                              background: isSelected ? '#ECFDF5' : '#fff',
                              color: isSelected ? '#58A429' : '#374151',
                              cursor: 'pointer', transition: 'all 0.15s'
                            }}
                          >{am}</button>
                        );
                      })}
                      {availableAmenitiesList.length === 0 && (
                        <span style={{ fontSize: 12, color: '#9CA3AF' }}>No amenities found for this property type.</span>
                      )}
                    </div>
                  )}
                  {selectedAmenitiesList.length > 0 && (
                    <div style={{ marginTop: 6, fontSize: 11, color: '#6B7280' }}>
                      Selected: <strong style={{ color: '#58A429' }}>{selectedAmenitiesList.join(', ')}</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Exact Map Location Section */}
              <div className="form-group" style={{ marginBottom: '16px', border: '1px solid #E5E7EB', padding: '16px', borderRadius: '8px', background: '#F9FAFB' }}>
                <label className="form-label" style={{ fontFamily: '"Outfit", sans-serif', fontSize: '15px', color: '#111827', display: 'block', marginBottom: '12px' }}>
                  Exact Map Location
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label className="form-label" style={{ fontSize: '12px', color: '#4B5563' }}>Full Address / Location String*</label>
                    <input type="text" className="form-input" name="full_address" value={formData.full_address} onChange={(e) => {
                      handleChange(e);
                      // Mirror it to location for backward compatibility
                      setFormData(prev => ({ ...prev, location: e.target.value, full_address: e.target.value }));
                    }} placeholder="e.g. Kasol, Himachal Pradesh 175105, India" required />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: '12px', color: '#4B5563' }}>Latitude</label>
                    <input type="number" step="any" className="form-input" name="latitude" value={formData.latitude} onChange={handleChange} placeholder="e.g. 32.0100" />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: '12px', color: '#4B5563' }}>Longitude</label>
                    <input type="number" step="any" className="form-input" name="longitude" value={formData.longitude} onChange={handleChange} placeholder="e.g. 77.2970" />
                  </div>
                </div>
                
                {formData.latitude && formData.longitude && (
                  <div style={{ width: '100%', height: '200px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #D1D5DB' }}>
                    <iframe
                      title="Property Map Preview"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      src={`https://www.google.com/maps?q=${formData.latitude},${formData.longitude}&z=14&output=embed`}
                    />
                  </div>
                )}
                <div style={{ marginTop: '12px' }}>
                  <button type="button" onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition((position) => {
                        setFormData(prev => ({
                          ...prev,
                          latitude: position.coords.latitude,
                          longitude: position.coords.longitude
                        }));
                      }, (error) => {
                        alert('Unable to retrieve your location. Please check browser permissions or enter manually.');
                      });
                    } else {
                      alert('Geolocation is not supported by your browser.');
                    }
                  }} style={{ padding: '8px 16px', background: '#FFFFFF', color: '#4B5563', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    📍 Locate on Map
                  </button>
                  <span style={{ fontSize: '11px', color: '#9CA3AF', marginLeft: '12px' }}>Auto-fills your exact GPS coordinates.</span>
                </div>
              </div>

              <div className="form-grid-3" style={{ marginBottom: '16px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontFamily: '"Outfit", sans-serif' }}>Property Price*</label>
                  <input type="number" className="form-input" name="price" value={formData.price} onChange={handleChange} placeholder="₹ Amount" required />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontFamily: '"Outfit", sans-serif' }}>Upload Property Images* <span style={{ fontWeight: 400, color: '#9CA3AF', fontSize: '11px' }}>(Min 1, Max 10)</span></label>

                  {/* Thumbnail gallery of existing + new images */}
                  {(existingImages.length > 0 || selectedFiles.length > 0) && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                      {existingImages.map((url, idx) => (
                        <div key={`ex-${idx}`} style={{ position: 'relative', width: '72px', height: '72px' }}>
                          <img src={url} alt={`img-${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', border: '1px solid #D1D5DB' }} />
                          <button type="button" onClick={() => handleRemoveExistingImage(idx)} style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#EF4444', color: '#fff', border: 'none', borderRadius: '50%', width: '18px', height: '18px', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>×</button>
                        </div>
                      ))}
                      {selectedFiles.map((file, idx) => (
                        <div key={`new-${idx}`} style={{ position: 'relative', width: '72px', height: '72px' }}>
                          <img src={URL.createObjectURL(file)} alt={file.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', border: '2px solid #58A429' }} />
                          <button type="button" onClick={() => handleRemoveNewFile(idx)} style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#EF4444', color: '#fff', border: 'none', borderRadius: '50%', width: '18px', height: '18px', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>×</button>
                          <span style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '9px', textAlign: 'center', borderRadius: '0 0 8px 8px', padding: '2px' }}>New</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add more images button — only if under 10 total */}
                  {(existingImages.length + selectedFiles.length) < 10 && (
                    <div className="file-upload-wrapper" onClick={() => fileInputRef.current.click()} style={{ cursor: 'pointer' }}>
                      <input type="text" className="file-upload-input" value={existingImages.length + selectedFiles.length > 0 ? `${existingImages.length + selectedFiles.length} image(s) — click to add more` : 'Click to browse'} readOnly />
                      <button type="button" className="btn-browse"><Upload size={14} /></button>
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple hidden accept="image/*" />
                    </div>
                  )}
                  {(existingImages.length + selectedFiles.length) >= 10 && (
                    <p style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px' }}>Maximum 10 images reached.</p>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontFamily: '"Outfit", sans-serif' }}>Status*</label>
                  <select className="form-select" name="status" value={formData.status} onChange={handleChange}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-3" style={{ marginBottom: '16px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontFamily: '"Outfit", sans-serif' }}>Check-In Time*</label>
                  <input type="text" className="form-input" name="checkIn" value={formData.checkIn} onChange={handleChange} placeholder="e.g. 3:00 PM" required />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontFamily: '"Outfit", sans-serif' }}>Check-Out Time*</label>
                  <input type="text" className="form-input" name="checkOut" value={formData.checkOut} onChange={handleChange} placeholder="e.g. 12:00 PM" required />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontFamily: '"Outfit", sans-serif' }}>Area Size*</label>
                  <input type="text" className="form-input" name="area" value={formData.area} onChange={handleChange} placeholder="e.g. 31 sq. ft." required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '16px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontFamily: '"Outfit", sans-serif' }}>Bed Rooms*</label>
                  <input type="number" className="form-input" name="bedRooms" value={formData.bedRooms} onChange={handleChange} placeholder="Rooms" required />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontFamily: '"Outfit", sans-serif' }}>Beds Count*</label>
                  <input type="number" className="form-input" name="beds" value={formData.beds} onChange={handleChange} placeholder="Beds" required />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontFamily: '"Outfit", sans-serif' }}>Guests Capacity*</label>
                  <input type="number" className="form-input" name="capacity" value={formData.capacity} onChange={handleChange} placeholder="Guests" required />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontFamily: '"Outfit", sans-serif' }}>Bath Rooms*</label>
                  <input type="number" className="form-input" name="bathRooms" value={formData.bathRooms} onChange={handleChange} placeholder="Baths" required />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label" style={{ fontFamily: '"Outfit", sans-serif' }}>Nearby Landmarks</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={landmarkName} 
                        onChange={(e) => setLandmarkName(e.target.value)} 
                        onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); handleAddLandmark(); } }}
                        placeholder="e.g. Anjuna Flea Market" 
                        style={{ flex: 1 }}
                      />
                      <select 
                        className="form-select" 
                        value={landmarkType} 
                        onChange={(e) => setLandmarkType(e.target.value)}
                        style={{ width: '180px' }}
                      >
                        <option value="Tourist Popular">Tourist Popular</option>
                        <option value="Beach">Beach</option>
                        <option value="Market">Market</option>
                        <option value="Temple">Temple</option>
                        <option value="Airport">Airport</option>
                        <option value="Railway Station">Railway Station</option>
                        <option value="Bus Stand">Bus Stand</option>
                        <option value="Restaurant">Restaurant</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <label style={{ fontSize: '12px', color: '#4B5563', fontWeight: 500, whiteSpace: 'nowrap' }}>Landmark Image:</label>
                      <input 
                        type="file" 
                        ref={landmarkImageRef}
                        accept="image/jpg,image/jpeg,image/png"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          if (file.size > 5 * 1024 * 1024) { alert('Max 5MB allowed'); return; }
                          setLandmarkImageFile(file);
                          setLandmarkImagePreview(URL.createObjectURL(file));
                        }}
                        style={{ flex: 1, fontSize: '12px' }}
                      />
                      {landmarkImagePreview && (
                        <img src={landmarkImagePreview} alt="preview" style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #D1D5DB' }} />
                      )}
                      <button 
                        type="button" 
                        onClick={handleAddLandmark}
                        disabled={landmarkImageUploading}
                        style={{ padding: '8px 16px', background: landmarkImageUploading ? '#9CA3AF' : '#58A429', color: 'white', border: 'none', borderRadius: '8px', cursor: landmarkImageUploading ? 'not-allowed' : 'pointer', fontWeight: 500, whiteSpace: 'nowrap' }}
                      >
                        {landmarkImageUploading ? 'Uploading...' : 'Add Landmark'}
                      </button>
                    </div>
                  </div>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {landmarksList.map((lm, idx) => (
                    <div key={idx} style={{ 
                      display: 'flex', alignItems: 'center', gap: '8px', 
                      background: '#F3F4F6', color: '#1F2937', 
                      padding: '6px 10px 6px 6px', borderRadius: '16px', fontSize: '13px', fontWeight: 500,
                      border: '1px solid #E5E7EB'
                    }}>
                      {lm.landmark_image_url ? (
                        <img src={lm.landmark_image_url} alt={lm.landmark_name} style={{ width: '32px', height: '32px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }} />
                      ) : (
                        <span>📍</span>
                      )}
                      <span>{lm.landmark_name} — <span style={{ color: '#6B7280', fontSize: '12px' }}>{lm.landmark_type}</span></span>
                      <button type="button" onClick={() => handleRemoveLandmark(idx, lm)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: 0, display: 'flex', marginLeft: '2px' }}>
                        <span style={{ fontSize: '16px', lineHeight: '14px' }}>&times;</span>
                      </button>
                    </div>
                  ))}
                  {landmarksList.length === 0 && <span style={{ fontSize: '13px', color: '#6B7280' }}>No landmarks added yet.</span>}
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label" style={{ fontFamily: '"Outfit", sans-serif' }}>Property Rules (New line per rule)*</label>
                <textarea className="form-textarea" name="rules" rows={3} value={formData.rules} onChange={handleChange} placeholder="e.g. • Primary Guest should be atleast 18 years of age." required />
              </div>

              <div className="form-grid-3" style={{ marginBottom: '16px' }}>
                <div className="form-group" style={{ gridColumn: 'span 3', marginTop: '8px' }}>
                  <label className="form-label" style={{ fontFamily: '"Outfit", sans-serif' }}>About Property*</label>
                  <textarea className="form-textarea" name="description" rows={3} value={formData.description} onChange={handleChange} placeholder="Write description about property..." required />
                </div>
              </div>
            </form>
          </div>
        )}

      </div> {/* Closes first dash-section green background wrapper */}

      <div style={{ height: '24px' }} />

      {/* Unified Figma Dashboard Card 2 — Property List Table (Separate Green Background Div) */}
      <div className="dash-section" style={{ 
        borderRadius: '18px', 
        border: '1px solid #EFF6E6',
        padding: '36px',
        boxSizing: 'border-box',
        marginTop: 0
      }}>

        {/* Property List Table Sub-Card */}
        <div style={{ 
          border: '1px solid #EFF6E6', 
          borderRadius: '12px', 
          padding: '24px',
          background: '#ffffff'
        }}>
          {/* Table Header with Title & Filters */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', margin: 0, fontFamily: '"Outfit", sans-serif' }}>My Property List</h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              {/* Date From */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '6px 12px', background: '#ffffff' }}>
                <Calendar size={14} style={{ color: '#9CA3AF' }} />
                <input 
                  type="date" 
                  value={filterDateFrom} 
                  onChange={(e) => setFilterDateFrom(e.target.value)}
                  style={{ border: 'none', outline: 'none', fontSize: '12px', color: '#374151', width: '105px', fontFamily: 'inherit' }} 
                />
              </div>
              {/* Date To */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '6px 12px', background: '#ffffff' }}>
                <Calendar size={14} style={{ color: '#9CA3AF' }} />
                <input 
                  type="date" 
                  value={filterDateTo} 
                  onChange={(e) => setFilterDateTo(e.target.value)}
                  style={{ border: 'none', outline: 'none', fontSize: '12px', color: '#374151', width: '105px', fontFamily: 'inherit' }} 
                />
              </div>
              {/* Property Type Dropdown */}
              <select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value)}
                style={{ padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '12px', color: '#374151', outline: 'none', background: '#ffffff', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                <option value="">Property Type</option>
                <option value="Homestay">Homestay</option>
                <option value="Villa">Villa</option>
                <option value="Apartment">Apartment</option>
                <option value="Resort">Resort</option>
              </select>
              {/* Filter Clear button */}
              <button 
                onClick={() => {
                  setFilterType('');
                  setFilterSearch('');
                  setFilterDateFrom('');
                  setFilterDateTo('');
                }}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  padding: '8px 16px', 
                  border: '1px solid #58A429', 
                  color: '#58A429', 
                  borderRadius: '8px', 
                  fontWeight: 600, 
                  fontSize: '12px', 
                  background: '#FAFDF2',
                  cursor: 'pointer'
                }}
              >
                <Filter size={14} /> Clear
              </button>
              {/* Search Input */}
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Search size={14} style={{ position: 'absolute', left: '12px', color: '#9CA3AF' }} />
                <input 
                  type="text" 
                  value={filterSearch}
                  onChange={(e) => setFilterSearch(e.target.value)}
                  placeholder="Search" 
                  style={{ padding: '8px 12px 8px 34px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '12px', width: '150px', outline: 'none', background: '#ffffff', fontFamily: 'inherit' }} 
                />
              </div>
            </div>
          </div>

          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <th style={{ color: '#9CA3AF', fontWeight: 500, fontSize: '12px', padding: '12px 14px' }}>Property No</th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500, fontSize: '12px', padding: '12px 14px' }}>Image</th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500, fontSize: '12px', padding: '12px 14px' }}>Property Name</th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500, fontSize: '12px', padding: '12px 14px' }}>Location</th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500, fontSize: '12px', padding: '12px 14px' }}>Category</th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500, fontSize: '12px', padding: '12px 14px' }}>Best Room Rate</th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500, fontSize: '12px', padding: '12px 14px' }}>Rooms</th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500, fontSize: '12px', padding: '12px 14px' }}>User Contacts</th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500, fontSize: '12px', padding: '12px 14px' }}>Direct Enquiries</th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500, fontSize: '12px', padding: '12px 14px' }}>Rating</th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500, fontSize: '12px', padding: '12px 14px' }}>Status</th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500, fontSize: '12px', padding: '12px 14px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProps.length > 0 ? (
                  filteredProps.map((p, i) => (
                    <tr key={p._id || i} style={{ borderBottom: '1px solid #F3F4F6' }}>
                      <td style={{ color: '#58A429', fontWeight: 600, padding: '14px' }}>{p.propertyNo}</td>
                      <td style={{ padding: '14px' }}>
                        <div style={{ width: 44, height: 34, background: '#E5E7EB', borderRadius: 6, overflow: 'hidden' }}>
                          <img src={p.images?.[0] || 'https://via.placeholder.com/44x34'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                        </div>
                      </td>
                      <td style={{ color: '#111827', fontWeight: 600, padding: '14px' }}>{p.name}</td>
                      <td style={{ padding: '14px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 500, color: '#374151', fontSize: '12px' }}>{p.city}</span>
                          <span style={{ fontSize: '11px', color: '#9CA3AF' }}>{p.address || p.location}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px' }}>
                        <span className="category-pill" style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 500, background: '#EFF6FF', color: '#3B82F6' }}>
                          {p.type}
                        </span>
                      </td>
                      <td style={{ color: '#111827', fontWeight: 600, padding: '14px' }}>₹{(p.price_per_night !== undefined ? p.price_per_night : p.price)?.toLocaleString()}</td>
                      <td style={{ color: '#374151', fontWeight: 500, padding: '14px' }}>{p.bedrooms || p.bedRooms || 1}</td>
                      <td style={{ color: '#374151', fontWeight: 500, padding: '14px' }}>{enquiryCounts[p._id] || 0}</td>
                      <td style={{ color: '#EF4444', fontWeight: 500, padding: '14px' }}>{Math.round((enquiryCounts[p._id] || 0) * 0.1)}</td>
                      <td style={{ color: '#D97706', fontWeight: 600, padding: '14px' }}>{p.rating || '5 Star'}</td>
                      <td style={{ padding: '14px' }}>
                        <span 
                          className={`status-pill ${p.status === 'Active' ? 'active' : 'inactive'}`} 
                          onClick={() => handleStatusToggle(p._id, p.status)}
                          style={{ cursor: 'pointer', userSelect: 'none' }}
                          title="Click to toggle status"
                        >
                          {p.status}
                        </span>
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
                    <td colSpan="12" style={{ textAlign: 'center', padding: '40px 0', color: '#9CA3AF', fontSize: '13px' }}>
                      No properties found matching your search.
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
