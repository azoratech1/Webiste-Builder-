import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Save, 
  Trash2, 
  Move,
  Eye,
  Settings,
  Copy,
  Image as ImageIcon,
  Type,
  Layout,
  Star,
  Users,
  Phone,
  MapPin
} from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import SortableSection from '../../components/SortableSection';
import SectionEditor from '../../components/SectionEditor';
import api from '../../services/api';

const PageBuilder = () => {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(null);
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [showSectionEditor, setShowSectionEditor] = useState(false);
  const [loading, setLoading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    if (pageId) {
      fetchPage();
    } else {
      // Create new page
      setPage({ name: '', slug: '', is_active: true });
      setSections([]);
    }
  }, [pageId]);

  const fetchPage = async () => {
    try {
      const response = await api.get(`/pages/${pageId}`);
      setPage(response.data.data);
      setSections(response.data.data.sections || []);
    } catch (error) {
      console.error('Error fetching page:', error);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = sections.findIndex(s => s.id === active.id);
      const newIndex = sections.findIndex(s => s.id === over.id);
      const newSections = arrayMove(sections, oldIndex, newIndex);
      setSections(newSections);
      // Update order in backend
      updateSectionOrder(newSections);
    }
  };

  const updateSectionOrder = async (newSections) => {
    const orderData = newSections.map((section, index) => ({
      id: section.id,
      order: index
    }));
    try {
      await api.post('/sections/reorder', { sections: orderData });
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const addNewSection = (type) => {
    const newSection = {
      id: Date.now(),
      section_type: type,
      title: `New ${type} Section`,
      content: getDefaultContent(type),
      order_position: sections.length,
      is_active: true
    };
    setSections([...sections, newSection]);
    setSelectedSection(newSection);
    setShowSectionEditor(true);
  };

  const getDefaultContent = (type) => {
    const defaults = {
      hero: {
        headline: 'Welcome to our website',
        subheadline: 'Your success starts here',
        cta_text: 'Get Started',
        cta_link: '#',
        background_image: null
      },
      features: {
        items: [
          { title: 'Feature 1', description: 'Description here', icon: 'Star' },
          { title: 'Feature 2', description: 'Description here', icon: 'Users' }
        ]
      },
      about: {
        title: 'About Us',
        description: 'Your company description here',
        image: null,
        mission: 'Our mission statement'
      },
      contact: {
        title: 'Contact Us',
        address: '123 Street, City',
        phone: '+1234567890',
        email: 'info@example.com',
        map_embed: ''
      },
      gallery: {
        title: 'Gallery',
        images: [],
        layout: 'grid'
      },
      testimonials: {
        title: 'Testimonials',
        items: [
          { name: 'John Doe', role: 'CEO', text: 'Great service!', rating: 5 }
        ]
      }
    };
    return defaults[type] || {};
  };

 const saveSection = async (sectionData) => {
  try {
    // Check if this is a new section (temporary ID)
    const isNewSection = !sectionData.id || 
                         isNaN(sectionData.id) || 
                         sectionData.id.toString().length > 10;
    
    if (!isNewSection) {
      // Update existing section
      await api.put(`/sections/${sectionData.id}`, sectionData);
    } else {
      // Create new section
      await api.post('/sections', {
        ...sectionData,
        page_id: page.id  // Make sure page.id exists
      });
    }
    
    setShowSectionEditor(false);
    fetchPage(); // Refresh data
    alert('Section saved successfully!');
  } catch (error) {
    console.error('Error saving section:', error);
    alert('Error saving section: ' + (error.response?.data?.error || error.message));
  }
};

  const deleteSection = async (sectionId) => {
    if (window.confirm('Are you sure you want to delete this section?')) {
      try {
        await api.delete(`/sections/${sectionId}`);
        fetchPage();
      } catch (error) {
        console.error('Error deleting section:', error);
      }
    }
  };

  const savePage = async () => {
    setLoading(true);
    try {
      if (page.id) {
        await api.put(`/pages/${page.id}`, page);
      } else {
        const response = await api.post('/pages', page);
        navigate(`/admin/pages/${response.data.data.id}`);
      }
      alert('Page saved successfully!');
    } catch (error) {
      console.error('Error saving page:', error);
      alert('Error saving page');
    } finally {
      setLoading(false);
    }
  };

  const sectionTypes = [
    { type: 'hero', icon: Star, label: 'Hero Section' },
    { type: 'features', icon: Layout, label: 'Features' },
    { type: 'about', icon: Users, label: 'About' },
    { type: 'contact', icon: Phone, label: 'Contact' },
    { type: 'gallery', icon: ImageIcon, label: 'Gallery' },
    { type: 'testimonials', icon: Star, label: 'Testimonials' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-4 flex-1">
            <input
              type="text"
              value={page?.name || ''}
              onChange={(e) => setPage({ ...page, name: e.target.value })}
              placeholder="Page Name"
              className="text-2xl font-bold border-2 border-transparent focus:border-blue-500 rounded px-2 py-1 outline-none"
            />
            <div className="flex gap-4">
              <input
                type="text"
                value={page?.slug || ''}
                onChange={(e) => setPage({ ...page, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                placeholder="page-slug"
                className="border rounded px-3 py-1"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={page?.is_active}
                  onChange={(e) => setPage({ ...page, is_active: e.target.checked })}
                />
                Active
              </label>
            </div>
          </div>
          <button
            onClick={savePage}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Save size={18} />
            {loading ? 'Saving...' : 'Save Page'}
          </button>
        </div>
      </div>

      {/* Add Section Buttons */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Add Sections</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {sectionTypes.map((section) => (
            <button
              key={section.type}
              onClick={() => addNewSection(section.type)}
              className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition group"
            >
              <section.icon className="text-gray-400 group-hover:text-blue-600" size={24} />
              <span className="text-sm text-gray-600 group-hover:text-blue-600">{section.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sections List */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Page Sections</h3>
        </div>
        <div className="p-4">
          {sections.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No sections added yet. Click on any section type above to add content.
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-3">
                  {sections.map((section) => (
                    <SortableSection
                      key={section.id}
                      section={section}
                      onEdit={() => {
                        setSelectedSection(section);
                        setShowSectionEditor(true);
                      }}
                      onDelete={() => deleteSection(section.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>

      {/* Section Editor Modal */}
      {showSectionEditor && (
        <SectionEditor
          section={selectedSection}
          onSave={saveSection}
          onClose={() => setShowSectionEditor(false)}
        />
      )}
    </div>
  );
};

export default PageBuilder;