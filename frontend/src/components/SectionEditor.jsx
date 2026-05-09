import React, { useState } from 'react';
import { X, Upload, Plus, Trash2, Move } from 'lucide-react';
import api from '../services/api';

const SectionEditor = ({ section, onSave, onClose }) => {
  const [formData, setFormData] = useState({ ...section });
  const [uploading, setUploading] = useState(false);

  const handleContentChange = (key, value) => {
    setFormData({
      ...formData,
      content: {
        ...formData.content,
        [key]: value
      }
    });
  };

  const handleArrayItemChange = (arrayKey, index, field, value) => {
    const newArray = [...(formData.content[arrayKey] || [])];
    newArray[index] = { ...newArray[index], [field]: value };
    handleContentChange(arrayKey, newArray);
  };

  const addArrayItem = (arrayKey, defaultItem) => {
    const currentArray = formData.content[arrayKey] || [];
    handleContentChange(arrayKey, [...currentArray, defaultItem]);
  };

  const removeArrayItem = (arrayKey, index) => {
    const currentArray = formData.content[arrayKey] || [];
    handleContentChange(arrayKey, currentArray.filter((_, i) => i !== index));
  };

  const handleImageUpload = async (field, file) => {
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    try {
      const response = await api.post('/media/upload', formData);
      handleContentChange(field, response.data.data.url);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  const renderContentFields = () => {
    switch (section.section_type) {
      case 'hero':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Headline</label>
              <input
                type="text"
                value={formData.content.headline || ''}
                onChange={(e) => handleContentChange('headline', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subheadline</label>
              <textarea
                value={formData.content.subheadline || ''}
                onChange={(e) => handleContentChange('subheadline', e.target.value)}
                className="w-full border rounded px-3 py-2"
                rows="3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">CTA Text</label>
              <input
                type="text"
                value={formData.content.cta_text || ''}
                onChange={(e) => handleContentChange('cta_text', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Background Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload('background_image', e.target.files[0])}
                className="w-full"
              />
              {formData.content.background_image && (
                <img src={formData.content.background_image} alt="Background" className="mt-2 h-32 object-cover rounded" />
              )}
            </div>
          </div>
        );

      case 'features':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Section Title</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Features Items</label>
              {(formData.content.items || []).map((item, index) => (
                <div key={index} className="border rounded p-4 mb-3">
                  <div className="flex justify-between mb-2">
                    <strong>Item {index + 1}</strong>
                    <button onClick={() => removeArrayItem('items', index)} className="text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Title"
                    value={item.title || ''}
                    onChange={(e) => handleArrayItemChange('items', index, 'title', e.target.value)}
                    className="w-full border rounded px-3 py-2 mb-2"
                  />
                  <textarea
                    placeholder="Description"
                    value={item.description || ''}
                    onChange={(e) => handleArrayItemChange('items', index, 'description', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    rows="2"
                  />
                </div>
              ))}
              <button
                onClick={() => addArrayItem('items', { title: '', description: '' })}
                className="flex items-center gap-2 text-blue-600"
              >
                <Plus size={16} /> Add Feature
              </button>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <textarea
                value={formData.content.address || ''}
                onChange={(e) => handleContentChange('address', e.target.value)}
                className="w-full border rounded px-3 py-2"
                rows="3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="text"
                value={formData.content.phone || ''}
                onChange={(e) => handleContentChange('phone', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={formData.content.email || ''}
                onChange={(e) => handleContentChange('email', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Google Maps Embed URL</label>
              <input
                type="text"
                value={formData.content.map_embed || ''}
                onChange={(e) => handleContentChange('map_embed', e.target.value)}
                placeholder="https://www.google.com/maps/embed?..."
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="text-gray-500">
            Editor for {section.section_type} section coming soon...
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Edit {section.section_type} Section</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Section Title</label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          
          {renderContentFields()}
          
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(formData)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save Section
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionEditor;