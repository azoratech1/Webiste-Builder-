import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin, Globe } from 'lucide-react';
import api from '../services/api';

const Footer = () => {
  const [companyInfo, setCompanyInfo] = useState({
    name: 'ABC Technologies',
    logo: null,
    tagline: 'Your Success Partner',
    email: 'info@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Business Street, Tech City',
    website: 'www.example.com',
    socialMedia: {}
  });
  const [pages, setPages] = useState([]);

  useEffect(() => {
    fetchCompanyInfo();
    fetchPages();
  }, []);

  const fetchCompanyInfo = async () => {
    try {
      const response = await api.get('/settings/company');
      if (response.data.success) {
        setCompanyInfo(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching company info:', error);
    }
  };

  const fetchPages = async () => {
    try {
      const response = await api.get('/pages');
      const activePages = response.data.data.filter(page => page.is_active);
      setPages(activePages);
    } catch (error) {
      console.error('Error fetching pages:', error);
    }
  };

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              {companyInfo.logo ? (
                <img src={companyInfo.logo} alt={companyInfo.name} className="h-10 w-auto" />
              ) : (
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="font-bold text-xl">A</span>
                </div>
              )}
              <h3 className="text-xl font-bold">{companyInfo.name}</h3>
            </div>
            <p className="text-gray-400 text-sm mb-4">{companyInfo.tagline}</p>
            <div className="space-y-2 text-sm text-gray-400">
              <p className="flex items-center gap-2">
                <Mail size={14} /> {companyInfo.email}
              </p>
              <p className="flex items-center gap-2">
                <Phone size={14} /> {companyInfo.phone}
              </p>
              <p className="flex items-center gap-2">
                <MapPin size={14} /> {companyInfo.address}
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {pages.map((page) => (
                <li key={page.id}>
                  <Link 
                    to={`/${page.slug}`}
                    className="text-gray-400 hover:text-white transition"
                  >
                    {page.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Our Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Web Development</li>
              <li>Mobile Apps</li>
              <li>Cloud Solutions</li>
              <li>Digital Marketing</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
            <p className="text-gray-400 text-sm mb-3">
              Subscribe to get updates about our courses and offers.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 rounded-l-lg text-gray-800"
              />
              <button className="bg-blue-600 px-4 py-2 rounded-r-lg hover:bg-blue-700 transition">
                Subscribe
              </button>
            </div>
            <div className="flex gap-3 mt-4">
              {companyInfo.socialMedia?.facebook && (
                <a href={companyInfo.socialMedia.facebook} target="_blank" rel="noopener noreferrer" 
                   className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition">
                  <Facebook size={16} />
                </a>
              )}
              {companyInfo.socialMedia?.twitter && (
                <a href={companyInfo.socialMedia.twitter} target="_blank" rel="noopener noreferrer"
                   className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition">
                  <Twitter size={16} />
                </a>
              )}
              {companyInfo.socialMedia?.linkedin && (
                <a href={companyInfo.socialMedia.linkedin} target="_blank" rel="noopener noreferrer"
                   className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition">
                  <Linkedin size={16} />
                </a>
              )}
              {companyInfo.socialMedia?.instagram && (
                <a href={companyInfo.socialMedia.instagram} target="_blank" rel="noopener noreferrer"
                   className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition">
                  <Instagram size={16} />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} {companyInfo.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;