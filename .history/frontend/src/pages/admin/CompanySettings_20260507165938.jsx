import React, { useState, useEffect } from 'react';
import { Save, Upload, Building, Mail, Phone, MapPin, Globe, Loader, X } from 'lucide-react';
import api from '../../services/api';

const CompanySettings = () => {
  const [company, setCompany] = useState({
    name: 'ABC Technologies',
    logo: null,
    tagline: 'Your Success Partner',
    email: 'info@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Business Street, Tech City',
    website: 'www.example.com',
    socialMedia: {
      facebook: '',
      twitter: '',
      linkedin: '',
      instagram: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCompanySettings();
  }, []);

  const fetchCompanySettings = async () => {
    try {
      const response = await api.get('/settings/company');
      console.log('Fetched settings:', response.data);
      
      if (response.data.success) {
        setCompany(response.data.data);
        if (response.data.data.logo) {
          setLogoPreview(response.data.data.logo);
        }
      }
    } catch (error) {
      console.error('Error fetching company settings:', error);
      setError('Failed to load company settings');
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];

     if (!file) {
      console.log('No file selected');
      return;
    }
  // Validate file type
  if (!file.type.startsWith('image/')) {
    alert('Please upload an image file (JPEG, PNG, GIF, WEBP)');
    return;
  }
  
  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('File size should be less than 5MB. Your file is ' + (file.size / 1024 / 1024).toFixed(2) + 'MB');
    return;
  }
  
 
    
    console.log('File selected:', file.name, file.type, file.size);
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPEG, PNG, GIF, WEBP)');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result);
    };
    reader.readAsDataURL(file);
    
    // Create form data
    const formData = new FormData();
    formData.append('logo', file);
    
    setUploading(true);
    setError(null);
    
   try {

  const response =
    await api.post(

      '/settings/upload-logo',

      formData,

      {
        headers: {
          'Content-Type':
            'multipart/form-data'
        }
      }
    );

  if (response.data.success) {

    setLogoPreview(
      response.data.data.url
    );

    setCompany({

      ...company,

      logo:
        response.data.data.url
    });

    alert(
      'Logo uploaded successfully!'
    );
  }

} catch (error) {

  console.error(
    'Error uploading logo:',
    error
  );

  alert(
    'Error uploading logo: ' +
    (
      error.response?.data?.error ||
      error.message
    )
  );

  if (company.logo) {

    setLogoPreview(
      company.logo
    );

  } else {

    setLogoPreview(null);
  }

} finally {

  setUploading(false);
}
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put('/settings/company', company);
      console.log('Save response:', response.data);
      
      if (response.data.success) {
        alert('Company settings saved successfully!');
      } else {
        throw new Error(response.data.error || 'Save failed');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const removeLogo = () => {
    setLogoPreview(null);
    setCompany({ ...company, logo: null });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-6">Company Settings</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        {/* Logo Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Logo
          </label>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border-2 border-gray-200">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <Building size={40} className="text-gray-400" />
                )}
              </div>
              {logoPreview && (
                <button
                  onClick={removeLogo}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition"
                  title="Remove logo"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            
            <div>
              <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition inline-flex items-center gap-2">
                {uploading ? (
                  <Loader size={16} className="animate-spin" />
                ) : (
                  <Upload size={16} />
                )}
                {uploading ? 'Uploading...' : 'Upload Logo'}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleLogoUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              <p className="text-xs text-gray-500 mt-2">
                Recommended: Square image, max 5MB
              </p>
            </div>
          </div>
        </div>

        {/* Rest of the form remains the same */}
        {/* Company Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Name
          </label>
          <input
            type="text"
            value={company.name}
            onChange={(e) => setCompany({ ...company, name: e.target.value })}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Tagline */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tagline
          </label>
          <input
            type="text"
            value={company.tagline}
            onChange={(e) => setCompany({ ...company, tagline: e.target.value })}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Mail size={14} className="inline mr-1" /> Email
            </label>
            <input
              type="email"
              value={company.email}
              onChange={(e) => setCompany({ ...company, email: e.target.value })}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Phone size={14} className="inline mr-1" /> Phone
            </label>
            <input
              type="text"
              value={company.phone}
              onChange={(e) => setCompany({ ...company, phone: e.target.value })}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <MapPin size={14} className="inline mr-1" /> Address
          </label>
          <textarea
            value={company.address}
            onChange={(e) => setCompany({ ...company, address: e.target.value })}
            rows="2"
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Globe size={14} className="inline mr-1" /> Website
          </label>
          <input
            type="text"
            value={company.website}
            onChange={(e) => setCompany({ ...company, website: e.target.value })}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Social Media */}
        <h3 className="text-lg font-semibold mb-3">Social Media Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Facebook
            </label>
            <input
              type="url"
              value={company.socialMedia.facebook}
              onChange={(e) => setCompany({
                ...company,
                socialMedia: { ...company.socialMedia, facebook: e.target.value }
              })}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://facebook.com/yourpage"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Twitter
            </label>
            <input
              type="url"
              value={company.socialMedia.twitter}
              onChange={(e) => setCompany({
                ...company,
                socialMedia: { ...company.socialMedia, twitter: e.target.value }
              })}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://twitter.com/yourhandle"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              LinkedIn
            </label>
            <input
              type="url"
              value={company.socialMedia.linkedin}
              onChange={(e) => setCompany({
                ...company,
                socialMedia: { ...company.socialMedia, linkedin: e.target.value }
              })}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://linkedin.com/company/yourcompany"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instagram
            </label>
            <input
              type="url"
              value={company.socialMedia.instagram}
              onChange={(e) => setCompany({
                ...company,
                socialMedia: { ...company.socialMedia, instagram: e.target.value }
              })}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://instagram.com/yourhandle"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={loading || uploading}
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={18} />
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
};

export default CompanySettings;