import React, { useState, useEffect } from 'react';
import {
  Link,
  useLocation,
  useNavigate,
  useParams
} from 'react-router-dom';
import { Menu, X, ChevronDown, Home, Info, Phone, Server, User, Settings, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const WebsiteNavbar = () => {
  const { websiteSlug } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pages, setPages] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [companyInfo, setCompanyInfo] = useState({
    name: 'My Company',
    logo: null,
    tagline: 'Your Success Partner'
  });
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPages();
    fetchCompanyInfo();
    checkAuth();
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchPages = async () => {
    try {
      const response = await api.get('/pages');
      // Filter pages that are active and should show in navigation
      const activePages = response.data.data.filter(page => page.is_active && page.show_in_nav);
      // Sort by order_position
      activePages.sort((a, b) => (a.order_position || 0) - (b.order_position || 0));
      setPages(activePages);
    } catch (error) {
      console.error('Error fetching pages:', error);
      // Fallback pages
      setPages([
        { id: 1, name: 'Home', slug: 'home' },
        { id: 2, name: 'About', slug: 'about' },
        { id: 3, name: 'Services', slug: 'services' },
        { id: 4, name: 'Contact', slug: 'contact' }
      ]);
    }
  };

  const fetchCompanyInfo = async () => {
    try {
      const response = await api.get('/settings/company');
      if (response.data.success) {
        setCompanyInfo(response.data.data);
      }
    } catch (error) {
      console.log('Using default company info');
    }
  };

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchUserInfo();
    }
  };

  const fetchUserInfo = async () => {
    try {
      const response = await api.get('/auth/me');
      if (response.data.success) {
        setUser(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const handleScroll = () => {
    setScrolled(window.scrollY > 50);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);
    navigate('/');
    window.location.reload();
  };

  const getPageIcon = (slug) => {
    const icons = {
      home: <Home size={18} />,
      about: <Info size={18} />,
      contact: <Phone size={18} />,
      services: <Server size={18} />
    };
    return icons[slug] || <Home size={18} />;
  };

  // const isActive = (path) => {
  //   if (path === '/' && location.pathname === '/') return true;
  //   if (path !== '/' && location.pathname === `/${path}`) return true;
  //   return false;
  // };
const isActive = (slug) => {

  const currentPath =
    location.pathname;

  if (slug === 'home') {

    return currentPath === `/${websiteSlug}`;
  }

  return currentPath ===
    `/${websiteSlug}/${slug}`;
};
  // Build navigation links from database pages
  const navLinks = pages.map(page => ({
    name: page.name,
    slug: page.slug,
    path: page.slug === 'home' ? '/' : `/${page.slug}`
  }));

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white shadow-lg py-2' 
          : 'bg-gradient-to-r from-blue-600 to-purple-700 py-4'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            {/* Logo and Company Name */}
            <Link to="/" className="flex items-center space-x-3 group cursor-pointer">
              {companyInfo.logo ? (
                <img src={companyInfo.logo} alt={companyInfo.name} className="h-10 w-auto object-contain" />
              ) : (
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  scrolled ? 'bg-blue-600' : 'bg-white bg-opacity-20'
                }`}>
                  <span className="text-xl font-bold text-white">{companyInfo.name?.charAt(0) || 'M'}</span>
                </div>
              )}
              <div>
                <h1 className={`font-bold text-xl ${scrolled ? 'text-gray-800' : 'text-white'}`}>
                  {companyInfo.name}
                </h1>
                {!scrolled && companyInfo.tagline && (
                  <p className="text-xs text-blue-100">{companyInfo.tagline}</p>
                )}
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.slug}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 ${
                    isActive(link.slug === 'home' ? '' : link.slug)
                      ? scrolled 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white bg-opacity-20 text-white'
                      : scrolled
                        ? 'text-gray-700 hover:bg-gray-100'
                        : 'text-white hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  {getPageIcon(link.slug)}
                  {link.name}
                </Link>
              ))}
              
              {/* Admin Dropdown */}
              {isLoggedIn ? (
                <div className="relative ml-2">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 ${
                      scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white hover:bg-opacity-10'
                    }`}
                  >
                    <User size={18} />
                    {user?.username || 'Account'}
                    <ChevronDown size={14} />
                  </button>
                  
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                      <Link to="/admin/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setShowDropdown(false)}>
                        Admin Panel
                      </Link>
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className={`ml-4 px-6 py-2 rounded-lg transition-all duration-300 font-semibold ${
                  scrolled ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white text-blue-600 hover:bg-gray-100'
                }`}>
                  Admin Login
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setIsOpen(!isOpen)} className={`md:hidden p-2 rounded-lg transition ${scrolled ? 'text-gray-800' : 'text-white'}`}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white shadow-lg overflow-hidden"
            >
              <div className="container mx-auto px-4 py-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.slug}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 rounded-lg transition flex items-center gap-3 ${
                      isActive(link.slug === 'home' ? '' : link.slug)
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {getPageIcon(link.slug)}
                    {link.name}
                  </Link>
                ))}
                {isLoggedIn ? (
                  <>
                    <Link to="/admin/dashboard" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">
                      Admin Panel
                    </Link>
                    <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full mt-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700">
                      Logout
                    </button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setIsOpen(false)} className="block mt-2 px-4 py-3 bg-blue-600 text-white rounded-lg text-center">
                    Admin Login
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      <div className="h-16"></div>
    </>
  );
};

export default WebsiteNavbar;