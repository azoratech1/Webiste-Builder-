import React, { useState, useEffect } from 'react';
import { Save, Edit2, Eye, Plus, Trash2 } from 'lucide-react';
import api from '../../services/api';

const HomepageEditor = () => {
  const [sections, setSections] = useState([]);
  const [editingSection, setEditingSection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const response = await api.get('/homepage/sections');
      if (response.data.success) {
        setSections(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSection = async (key, content) => {
    try {
      await api.put(`/homepage/section/${key}`, { content });
      alert('Section updated successfully!');
      fetchSections();
      setEditingSection(null);
    } catch (error) {
      console.error('Error updating section:', error);
      alert('Error updating section');
    }
  };

  const renderEditor = (section) => {
    const [content, setContent] = useState(section.content);

    const handleSave = () => {
      updateSection(section.section_key, content);
    };

    switch (section.section_key) {
      case 'hero':
        return (
          <div className="space-y-4">
            <input
              type="text"
              value={content.headline}
              onChange={(e) => setContent({...content, headline: e.target.value})}
              className="w-full border rounded p-2"
              placeholder="Headline"
            />
            <textarea
              value={content.subheadline}
              onChange={(e) => setContent({...content, subheadline: e.target.value})}
              className="w-full border rounded p-2"
              rows="3"
              placeholder="Subheadline"
            />
            <input
              type="text"
              value={content.cta_text}
              onChange={(e) => setContent({...content, cta_text: e.target.value})}
              className="w-full border rounded p-2"
              placeholder="CTA Button Text"
            />
            <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded">
              Save Changes
            </button>
          </div>
        );
      
      case 'features':
        return (
          <div className="space-y-4">
            <input
              type="text"
              value={content.title}
              onChange={(e) => setContent({...content, title: e.target.value})}
              className="w-full border rounded p-2"
              placeholder="Section Title"
            />
            {content.items.map((item, idx) => (
              <div key={idx} className="border p-4 rounded">
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => {
                    const newItems = [...content.items];
                    newItems[idx].title = e.target.value;
                    setContent({...content, items: newItems});
                  }}
                  className="w-full border rounded p-2 mb-2"
                  placeholder="Feature Title"
                />
                <textarea
                  value={item.description}
                  onChange={(e) => {
                    const newItems = [...content.items];
                    newItems[idx].description = e.target.value;
                    setContent({...content, items: newItems});
                  }}
                  className="w-full border rounded p-2"
                  rows="2"
                  placeholder="Feature Description"
                />
              </div>
            ))}
            <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded">
              Save Changes
            </button>
          </div>
        );
      
      default:
        return (
          <div>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(content, null, 2)}
            </pre>
            <button onClick={handleSave} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
              Save Changes
            </button>
          </div>
        );
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Homepage Editor</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sections List */}
        <div className="lg:col-span-1 space-y-2">
          <h2 className="text-lg font-semibold mb-3">Sections</h2>
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setEditingSection(section)}
              className={`w-full text-left p-3 rounded-lg transition ${
                editingSection?.id === section.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <div className="font-semibold">{section.section_name}</div>
              <div className="text-sm opacity-75">{section.section_key}</div>
            </button>
          ))}
        </div>
        
        {/* Editor */}
        <div className="lg:col-span-2">
          {editingSection ? (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">
                Edit {editingSection.section_name}
              </h2>
              {renderEditor(editingSection)}
            </div>
          ) : (
            <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-500">
              Select a section to edit
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomepageEditor;