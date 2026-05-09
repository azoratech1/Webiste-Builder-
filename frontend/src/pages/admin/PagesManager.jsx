import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, Globe, Home, Info, Mail, Briefcase } from 'lucide-react';
import api from '../../services/api';

const PagesManager = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newPage, setNewPage] = useState({ name: '', slug: '', is_active: true });
  const navigate = useNavigate();

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const res = await api.get('/pages');
      setPages(res.data.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPage = async () => {
    if (!newPage.name || !newPage.slug) {
      alert('Please enter page name and slug');
      return;
    }
    try {
      await api.post('/pages', newPage);
      setShowModal(false);
      setNewPage({ name: '', slug: '', is_active: true });
      fetchPages();
      alert('Page created successfully!');
    } catch (error) {
      alert('Error creating page');
    }
  };

  const deletePage = async (id) => {
    if (window.confirm('Delete this page? This will also delete all sections.')) {
      await api.delete(`/pages/${id}`);
      fetchPages();
      alert('Page deleted successfully!');
    }
  };

  const getPageIcon = (slug) => {
    const icons = {
      home: <Home size={18} />,
      about: <Info size={18} />,
      contact: <Mail size={18} />,
      services: <Briefcase size={18} />
    };
    return icons[slug] || <Globe size={18} />;
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pages Manager</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <Plus size={18} /> Create New Page
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pages.map((page) => (
          <div key={page.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    {getPageIcon(page.slug)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{page.name}</h3>
                    <p className="text-sm text-gray-500">/{page.slug}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${page.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {page.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                {page.sections_count || 0} sections
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/admin/pages/${page.id}`)}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
                >
                  <Edit size={16} /> Edit
                </button>
                <button
                  onClick={() => window.open(`/${page.slug}`, '_blank')}
                  className="flex-1 border border-gray-300 px-3 py-2 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2"
                >
                  <Eye size={16} /> View
                </button>
                <button
                  onClick={() => deletePage(page.id)}
                  className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Create Page Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Page</h2>
            <input
              type="text"
              placeholder="Page Name (e.g., Portfolio)"
              className="w-full border rounded-lg px-4 py-2 mb-3 focus:ring-2 focus:ring-blue-500"
              value={newPage.name}
              onChange={(e) => setNewPage({ 
                ...newPage, 
                name: e.target.value,
                slug: e.target.value.toLowerCase().replace(/ /g, '-')
              })}
            />
            <input
              type="text"
              placeholder="Slug (e.g., portfolio)"
              className="w-full border rounded-lg px-4 py-2 mb-3 focus:ring-2 focus:ring-blue-500"
              value={newPage.slug}
              onChange={(e) => setNewPage({ ...newPage, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
            />
            <label className="flex items-center gap-2 mb-4">
              <input 
                type="checkbox" 
                checked={newPage.is_active} 
                onChange={(e) => setNewPage({ ...newPage, is_active: e.target.checked })} 
              />
              <span className="text-sm">Active</span>
            </label>
            <div className="flex gap-2">
              <button onClick={createPage} className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                Create
              </button>
              <button onClick={() => setShowModal(false)} className="flex-1 bg-gray-300 py-2 rounded-lg hover:bg-gray-400 transition">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PagesManager;