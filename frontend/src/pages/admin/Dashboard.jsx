import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Image, Eye, Users, TrendingUp, Calendar } from 'lucide-react';
import api from '../../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const websiteSlug =
  localStorage.getItem(
    'website_slug'
  );
  const [stats, setStats] = useState({
    pages: 0,
    sections: 0,
    media: 0
  });
  const [recentPages, setRecentPages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [pagesRes, mediaRes] = await Promise.all([
        api.get('/pages'),
        api.get('/media')
      ]);
      
      const pages = pagesRes.data.data;
      setStats({
        pages: pages.length,
        sections: pages.reduce((acc, page) => acc + (page.sections_count || 0), 0),
        media: mediaRes.data.data.length
      });
      setRecentPages(pages.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Pages', value: stats.pages, icon: FileText, color: 'bg-blue-500' },
    { title: 'Total Sections', value: stats.sections, icon: Eye, color: 'bg-green-500' },
    { title: 'Media Files', value: stats.media, icon: Image, color: 'bg-purple-500' },
    { title: 'Page Views', value: '2,345', icon: TrendingUp, color: 'bg-orange-500' },
  ];

  // Navigation handlers
  const handleCreatePage = () => {
    navigate('/admin/pages');
  };

  const handleUploadMedia = () => {
    navigate('/admin/media');
  };

  const handleViewWebsite = () => {
    // Open website in new tab
    window.open(
  `/${websiteSlug}`,
  '_blank'
);
  };

  const handleViewPage = (pageSlug) => {
    // Open specific page in new tab
   window.open(
  `/${websiteSlug}/${pageSlug}`,
  '_blank'
);
  };

  const handleEditPage = (pageId) => {
    navigate(`/admin/pages/${pageId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      <div className="bg-white rounded-lg shadow-sm p-4 border">

  <div className="flex items-center justify-between">

    <div>

      <p className="text-sm text-gray-500 mb-1">
        Website URL
      </p>

      <a
        href={`/${websiteSlug}`}
        target="_blank"
        rel="noreferrer"
        className="text-blue-600 font-medium hover:underline"
      >

        {window.location.origin}/
        {websiteSlug}

      </a>

    </div>

    <button
      onClick={() =>
        navigator.clipboard.writeText(
          `${window.location.origin}/${websiteSlug}`
        )
      }
      className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
    >

      Copy URL

    </button>

  </div>

</div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-full`}>
                <stat.icon className="text-white" size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Recent Pages */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Recent Pages</h2>
        </div>
        <div className="divide-y">
          {recentPages.map((page) => (
            <div key={page.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
              <div 
                className="flex-1 cursor-pointer"
                onClick={() => handleEditPage(page.id)}
              >
                <h3 className="font-medium hover:text-blue-600">{page.name}</h3>
                <p className="text-sm text-gray-500">/{page.slug}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleViewPage(page.slug)}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition"
                  title="View Page"
                >
                  <Eye size={16} className="inline mr-1" />
                  View
                </button>
                <button
                  onClick={() => handleEditPage(page.id)}
                  className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition"
                  title="Edit Page"
                >
                  Edit
                </button>
                <span className={`px-2 py-1 text-xs rounded-full ${page.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {page.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))}
          {recentPages.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No pages created yet. Start by creating your first page!
            </div>
          )}
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Quick Actions</h2>
        </div>
        <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
          <button
            onClick={handleCreatePage}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-center group"
          >
            <FileText className="mx-auto mb-2 text-gray-400 group-hover:text-blue-600" size={24} />
            <span className="text-sm group-hover:text-blue-600">Create New Page</span>
          </button>
          <button
            onClick={handleUploadMedia}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-center group"
          >
            <Image className="mx-auto mb-2 text-gray-400 group-hover:text-blue-600" size={24} />
            <span className="text-sm group-hover:text-blue-600">Upload Media</span>
          </button>
          <button
            onClick={handleViewWebsite}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-center group"
          >
            <Eye className="mx-auto mb-2 text-gray-400 group-hover:text-blue-600" size={24} />
            <span className="text-sm group-hover:text-blue-600">View Website</span>
          </button>
        </div>
      </div>
      
      {/* Quick Tips */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h3 className="font-semibold text-blue-800 mb-2">💡 Quick Tips</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Click on any page name to edit its content</li>
          <li>• Use the "View" button to see how your page looks on the website</li>
          <li>• Add sections to your pages using the Page Builder</li>
          <li>• Upload images in Media Manager to use them in your pages</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;