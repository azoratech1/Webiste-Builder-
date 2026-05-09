import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Save, Trash2, GripVertical, Eye, ArrowLeft, X } from 'lucide-react';
import api,{} from '../../services/api';

const PageEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editedSection, setEditedSection] = useState(null); // Store edited content locally

  useEffect(() => {
    fetchPage();
  }, [id]);

  const fetchPage = async () => {
    try {
      const res = await api.get(`/pages/${id}`);
      setPage(res.data.data);
      setSections(res.data.data.sections || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addSection = async (type) => {
    const newSection = {
      page_id: parseInt(id),
      section_type: type,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Section`,
      content: getDefaultContent(type),
      order_position: sections.length,
      is_active: true
    };
    
    try {
      await api.post('/sections', newSection);
      fetchPage();
      setShowSectionModal(false);
      alert('Section added successfully!');
    } catch (error) {
      alert('Error adding section');
    }
  };

  const saveSection = async () => {
    if (!editedSection) return;
    
    setSaving(true);
    try {
      await api.put(`/sections/${editedSection.id}`, editedSection);
      await fetchPage(); // Refresh to get updated data
      setEditingSection(null);
      setEditedSection(null);
      alert('Section saved successfully!');
    } catch (error) {
      alert('Error saving section');
    } finally {
      setSaving(false);
    }
  };

  const deleteSection = async (sectionId) => {
    if (window.confirm('Delete this section?')) {
      await api.delete(`/sections/${sectionId}`);
      fetchPage();
      alert('Section deleted successfully!');
    }
  };

  const startEditing = (section) => {
    // Create a deep copy of the section to edit locally
    setEditedSection(JSON.parse(JSON.stringify(section)));
    setEditingSection(section.id);
  };

  const cancelEditing = () => {
    setEditingSection(null);
    setEditedSection(null);
  };

  const updateLocalContent = (key, value) => {
    if (!editedSection) return;
    setEditedSection({
      ...editedSection,
      content: {
        ...editedSection.content,
        [key]: value
      }
    });
  };

  const updateLocalNestedContent = (arrayKey, index, field, value) => {
    if (!editedSection) return;
    const newArray = [...(editedSection.content[arrayKey] || [])];
    if (newArray[index]) {
      newArray[index] = { ...newArray[index], [field]: value };
      setEditedSection({
        ...editedSection,
        content: {
          ...editedSection.content,
          [arrayKey]: newArray
        }
      });
    }
  };

  const addLocalArrayItem = (arrayKey, defaultItem) => {
    if (!editedSection) return;
    const currentArray = editedSection.content[arrayKey] || [];
    setEditedSection({
      ...editedSection,
      content: {
        ...editedSection.content,
        [arrayKey]: [...currentArray, defaultItem]
      }
    });
  };

  const removeLocalArrayItem = (arrayKey, index) => {
    if (!editedSection) return;
    const currentArray = editedSection.content[arrayKey] || [];
    setEditedSection({
      ...editedSection,
      content: {
        ...editedSection.content,
        [arrayKey]: currentArray.filter((_, i) => i !== index)
      }
    });
  };

  const updateLocalTitle = (title) => {
    if (!editedSection) return;
    setEditedSection({ ...editedSection, title });
  };

  const updateLocalActive = (is_active) => {
    if (!editedSection) return;
    setEditedSection({ ...editedSection, is_active });
  };

  const getDefaultContent = (type) => {
    const defaults = {
      hero: { 
        headline: 'Welcome', 
        subheadline: 'Your success starts here', 
        cta_text: 'Get Started' 
      },
      about: { 
        title: 'About Us', 
        description: 'Company description goes here', 
        mission: 'Our mission statement',
        vision: 'Our vision statement',
        values: ['Innovation', 'Quality', 'Integrity']
      },
      features: { 
        title: 'Our Features', 
        items: [
          { title: 'Feature 1', description: 'Description for feature 1' },
          { title: 'Feature 2', description: 'Description for feature 2' }
        ] 
      },
      contact: { 
        title: 'Contact Us',
        address: '123 Business Street, City',
        phone: '+1 (555) 123-4567',
        email: 'info@example.com',
        hours: 'Mon-Fri: 9AM - 6PM'
      }
    };
    return defaults[type] || {};
  };

  const renderEditor = () => {
    if (!editedSection) return null;
    
    const content = editedSection.content;
    const sectionType = editedSection.section_type;

    switch (sectionType) {
      case 'hero':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Headline</label>
              <input 
                type="text" 
                value={content.headline || ''} 
                onChange={(e) => updateLocalContent('headline', e.target.value)} 
                className="w-full border rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subheadline</label>
              <textarea 
                value={content.subheadline || ''} 
                onChange={(e) => updateLocalContent('subheadline', e.target.value)} 
                className="w-full border rounded-lg p-2"
                rows="2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">CTA Button Text</label>
              <input 
                type="text" 
                value={content.cta_text || ''} 
                onChange={(e) => updateLocalContent('cta_text', e.target.value)} 
                className="w-full border rounded-lg p-2"
              />
            </div>
          </div>
        );
      
      case 'about':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input 
                type="text" 
                value={content.title || ''} 
                onChange={(e) => updateLocalContent('title', e.target.value)} 
                className="w-full border rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea 
                value={content.description || ''} 
                onChange={(e) => updateLocalContent('description', e.target.value)} 
                className="w-full border rounded-lg p-2"
                rows="4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mission</label>
              <textarea 
                value={content.mission || ''} 
                onChange={(e) => updateLocalContent('mission', e.target.value)} 
                className="w-full border rounded-lg p-2"
                rows="2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Vision</label>
              <textarea 
                value={content.vision || ''} 
                onChange={(e) => updateLocalContent('vision', e.target.value)} 
                className="w-full border rounded-lg p-2"
                rows="2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Values (comma separated)</label>
              <input 
                type="text" 
                value={(content.values || []).join(', ')} 
                onChange={(e) => updateLocalContent('values', e.target.value.split(',').map(v => v.trim()))} 
                className="w-full border rounded-lg p-2"
                placeholder="Innovation, Quality, Integrity"
              />
            </div>
          </div>
        );
      
      case 'features':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Section Title</label>
              <input 
                type="text" 
                value={content.title || ''} 
                onChange={(e) => updateLocalContent('title', e.target.value)} 
                className="w-full border rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Features Items</label>
              {(content.items || []).map((item, idx) => (
                <div key={idx} className="border rounded-lg p-3 mb-2 bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Item {idx + 1}</span>
                    <button onClick={() => removeLocalArrayItem('items', idx)} className="text-red-600 text-sm">
                      Remove
                    </button>
                  </div>
                  <input 
                    type="text" 
                    value={item.title || ''} 
                    onChange={(e) => updateLocalNestedContent('items', idx, 'title', e.target.value)} 
                    className="w-full border rounded-lg p-2 mb-2"
                    placeholder="Feature Title"
                  />
                  <textarea 
                    value={item.description || ''} 
                    onChange={(e) => updateLocalNestedContent('items', idx, 'description', e.target.value)} 
                    className="w-full border rounded-lg p-2"
                    rows="2"
                    placeholder="Feature Description"
                  />
                </div>
              ))}
              <button 
                onClick={() => addLocalArrayItem('items', { title: 'New Feature', description: 'Description here' })}
                className="text-blue-600 text-sm mt-2"
              >
                + Add Feature
              </button>
            </div>
          </div>
        );
      
      case 'contact':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input 
                type="text" 
                value={content.title || ''} 
                onChange={(e) => updateLocalContent('title', e.target.value)} 
                className="w-full border rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <textarea 
                value={content.address || ''} 
                onChange={(e) => updateLocalContent('address', e.target.value)} 
                className="w-full border rounded-lg p-2"
                rows="2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input 
                type="text" 
                value={content.phone || ''} 
                onChange={(e) => updateLocalContent('phone', e.target.value)} 
                className="w-full border rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input 
                type="email" 
                value={content.email || ''} 
                onChange={(e) => updateLocalContent('email', e.target.value)} 
                className="w-full border rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Working Hours</label>
              <input 
                type="text" 
                value={content.hours || ''} 
                onChange={(e) => updateLocalContent('hours', e.target.value)} 
                className="w-full border rounded-lg p-2"
              />
            </div>
          </div>
        );
      
      default:
        return (
          <textarea
            value={JSON.stringify(content, null, 2)}
            onChange={(e) => {
              try {
                const newContent = JSON.parse(e.target.value);
                setEditedSection({ ...editedSection, content: newContent });
              } catch (err) {}
            }}
            className="w-full h-64 font-mono text-sm border rounded-lg p-2"
          />
        );
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/pages')}
            className="text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">Editing: {page?.name}</h1>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => window.open(`/${page?.slug}`, '_blank')}
            className="border border-gray-300 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition"
          >
            <Eye size={18} /> Preview
          </button>
          <button 
            onClick={() => setShowSectionModal(true)} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
          >
            <Plus size={18} /> Add Section
          </button>
        </div>
      </div>
      
      {saving && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
          Saving...
        </div>
      )}
      
      <div className="space-y-4">
        {sections.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500">No sections yet. Click "Add Section" to get started.</p>
          </div>
        ) : (
          sections.map((section) => (
            <div key={section.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="flex justify-between items-center p-4 bg-gray-50 border-b">
                <div className="flex items-center gap-2">
                  <GripVertical size={18} className="text-gray-400 cursor-move" />
                  <span className="font-semibold capitalize px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                    {section.section_type}
                  </span>
                  <span className="text-gray-600">{section.title}</span>
                  {!section.is_active && (
                    <span className="text-xs bg-gray-300 px-2 py-1 rounded">Inactive</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => startEditing(section)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => deleteSection(section.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              {editingSection === section.id && editedSection && (
                <div className="p-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Section Title</label>
                    <input
                      type="text"
                      value={editedSection.title || ''}
                      onChange={(e) => updateLocalTitle(e.target.value)}
                      className="w-full border rounded-lg p-2"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={editedSection.is_active}
                        onChange={(e) => updateLocalActive(e.target.checked)}
                      />
                      <span className="text-sm">Active</span>
                    </label>
                  </div>
                  {renderEditor()}
                  <div className="mt-4 pt-4 border-t flex justify-end gap-2">
                    <button 
                      onClick={cancelEditing}
                      className="px-4 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-50 transition"
                    >
                      <X size={16} /> Cancel
                    </button>
                    <button 
                      onClick={saveSection}
                      disabled={saving}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition disabled:opacity-50"
                    >
                      <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      
      {/* Add Section Modal */}
      {showSectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Add Section</h2>
            <p className="text-gray-600 mb-4">Select the type of section to add:</p>
            <div className="space-y-2">
              {['hero', 'about', 'features', 'contact'].map((type) => (
                <button
                  key={type}
                  onClick={() => addSection(type)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 rounded-lg capitalize transition border"
                >
                  <div className="font-semibold">{type} Section</div>
                  <div className="text-sm text-gray-500">
                    {type === 'hero' && 'Hero banner with title, subtitle and CTA'}
                    {type === 'about' && 'About section with description, mission and vision'}
                    {type === 'features' && 'Features grid with customizable items'}
                    {type === 'contact' && 'Contact form with address and contact info'}
                  </div>
                </button>
              ))}
            </div>
            <button 
              onClick={() => setShowSectionModal(false)}
              className="mt-4 w-full bg-gray-300 py-2 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageEditor;