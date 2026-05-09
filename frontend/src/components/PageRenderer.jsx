import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, CheckCircle, ArrowRight, Star, Users, Award } from 'lucide-react';

const PageRenderer = ({ pageData, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!pageData || !pageData.sections || pageData.sections.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{pageData?.name || 'Page'}</h1>
          <p className="text-gray-600">No content available. Please add sections in the admin panel.</p>
          <a href="/admin/pages" className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Edit Page
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      {pageData.sections.filter(s => s.is_active).map((section, index) => (
        <SectionRenderer key={section.id} section={section} index={index} />
      ))}
    </div>
  );
};

const SectionRenderer = ({ section, index }) => {
  const sectionType = section.section_type;
  const content = typeof section.content === 'string' ? JSON.parse(section.content) : section.content;
  const title = section.title;

  switch (sectionType) {
    case 'hero':
      return <HeroSection content={content} />;
    case 'about':
      return <AboutSection content={content} title={title} />;
    case 'features':
      return <FeaturesSection content={content} title={title} />;
    case 'contact':
      return <ContactSection content={content} title={title} />;
    default:
      return null;
  }
};

const HeroSection = ({ content }) => (
  <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white py-24">
    <div className="container mx-auto px-4 text-center">
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-6xl font-bold mb-4"
      >
        {content.headline || 'Welcome'}
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto"
      >
        {content.subheadline || 'Your success starts here'}
      </motion.p>
      {content.cta_text && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:shadow-lg transition transform hover:scale-105 inline-flex items-center gap-2"
        >
          {content.cta_text} <ArrowRight size={18} />
        </motion.button>
      )}
    </div>
  </section>
);

const AboutSection = ({ content, title }) => (
  <section className="py-16">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{title || content.title || 'About Us'}</h2>
          <p className="text-gray-600 text-lg leading-relaxed">{content.description}</p>
        </motion.div>
        
        {(content.mission || content.vision) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {content.mission && (
              <div className="bg-blue-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-3">Our Mission</h3>
                <p className="text-gray-700 leading-relaxed">{content.mission}</p>
              </div>
            )}
            {content.vision && (
              <div className="bg-purple-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-3">Our Vision</h3>
                <p className="text-gray-700 leading-relaxed">{content.vision}</p>
              </div>
            )}
          </div>
        )}
        
        {content.values && content.values.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-center mb-8">Our Values</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {content.values.map((value, idx) => (
                <div key={idx} className="text-center p-4 bg-gray-50 rounded-lg">
                  <CheckCircle className="mx-auto text-green-500 mb-2" size={24} />
                  <span className="text-gray-700 font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </section>
);

const FeaturesSection = ({ content, title }) => (
  <section className="py-16 bg-gray-50">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{title || content.title || 'Our Features'}</h2>
        {content.subtitle && <p className="text-gray-600 text-lg">{content.subtitle}</p>}
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {content.items && content.items.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Star className="text-blue-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-600 leading-relaxed">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const ContactSection = ({ content, title }) => (
  <section className="py-16">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{title || content.title || 'Contact Us'}</h2>
        {content.subtitle && <p className="text-gray-600 text-lg">{content.subtitle}</p>}
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          {content.address && (
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <MapPin className="text-blue-600 mt-1" size={24} />
              <div>
                <h3 className="font-semibold mb-1">Address</h3>
                <p className="text-gray-600">{content.address}</p>
              </div>
            </div>
          )}
          {content.phone && (
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <Phone className="text-blue-600 mt-1" size={24} />
              <div>
                <h3 className="font-semibold mb-1">Phone</h3>
                <p className="text-gray-600">{content.phone}</p>
              </div>
            </div>
          )}
          {content.email && (
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <Mail className="text-blue-600 mt-1" size={24} />
              <div>
                <h3 className="font-semibold mb-1">Email</h3>
                <p className="text-gray-600">{content.email}</p>
              </div>
            </div>
          )}
          {content.hours && (
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <Clock className="text-blue-600 mt-1" size={24} />
              <div>
                <h3 className="font-semibold mb-1">Working Hours</h3>
                <p className="text-gray-600">{content.hours}</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder="Your Name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Subject"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <textarea
              placeholder="Your Message"
              rows="5"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold">
              Send Message
            </button>
          </form>
        </div>
      </div>
      
      {content.map_embed && (
        <div className="mt-12 rounded-xl overflow-hidden shadow-lg">
          <iframe
            src={content.map_embed}
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            title="Location Map"
          ></iframe>
        </div>
      )}
    </div>
  </section>
);

export default PageRenderer;