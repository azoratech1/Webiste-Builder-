import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Image as ImageIcon, X, Check, Loader } from 'lucide-react';
import api from '../../services/api';

const MediaManager = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const response = await api.get('/media');
      setMedia(response.data.data);
      console.log("media is"+JSON.stringify(media))
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      uploadFile(file);
    }
  };

  const uploadFile = async (file) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }
    
    const formData = new FormData();
    formData.append('image', file);
    
    setUploading(true);
    try {
      const response = await api.post('/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        alert('File uploaded successfully!');
        fetchMedia(); // Refresh the list
        setSelectedFile(null);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file: ' + (error.response?.data?.error || error.message));
    } finally {
      setUploading(false);
    }
  };

  const deleteMedia = async (id) => {
    if (window.confirm('Are you sure you want to delete this media?')) {
      try {
        await api.delete(`/media/${id}`);
        fetchMedia();
        alert('Media deleted successfully!');
      } catch (error) {
        console.error('Error deleting media:', error);
        alert('Error deleting media');
      }
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    alert('URL copied to clipboard!');
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Media Manager</h1>
      </div>
      
      {/* Upload Area */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <label className="block">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition">
            <Upload className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-600">Click to select an image</p>
            <p className="text-sm text-gray-400 mt-1">Supports: JPG, PNG, GIF, WEBP (Max 5MB)</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading}
            />
          </div>
        </label>
        
        {uploading && (
          <div className="mt-4 text-center">
            <Loader className="animate-spin mx-auto mb-2" size={24} />
            <p className="text-sm text-gray-500">Uploading...</p>
          </div>
        )}
      </div>
      
      {/* Media Grid */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Media Library ({media.length} files)</h2>
        </div>
        <div className="p-6">
          {media.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="mx-auto text-gray-400 mb-4" size={64} />
              <p className="text-gray-500">No media files uploaded yet</p>
              <p className="text-sm text-gray-400">Click above to upload your first image</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {media.map((item) => (
                <div key={item.id} className="group relative">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={item.url}
                      alt={item.original_name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150?text=Error';
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                    <button
                      onClick={() => copyToClipboard(`http://localhost:5000${item.path}`)}
                      className="p-2 bg-white rounded-full hover:bg-gray-100"
                      title="Copy URL"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => deleteMedia(item.id)}
                      className="p-2 bg-white rounded-full hover:bg-red-100 text-red-600"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 truncate" title={item.original_name}>
                    {item.original_name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaManager;