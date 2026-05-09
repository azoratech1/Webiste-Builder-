import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import api from '../services/api';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  // const [contactInfo, setContactInfo] = useState({
  //   title: 'Contact Us',
  //   subtitle: "Have questions? We'd love to hear from you",
  //   address: '123 Business Street, Tech City, TC 12345',
  //   phone: '+1 (555) 123-4567',
  //   email: 'info@example.com',
  //   hours: 'Monday - Friday: 9AM - 6PM',
  //   mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290355!2d-74.00369368400567!3d40.71312937933072!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a316bb6e4f3%3A0xc2c6a5a6c8f5e6a!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1641234567890!5m2!1sen!2sus'
  // });
const [contactInfo,
setContactInfo] = useState({

  hero: {},

  contact: {},

  form: {}
});
  useEffect(() => {
    fetchContactData();
  }, []);

  // const fetchContactData = async () => {
  //   try {
  //     const response = await api.get('/pages/slug/contact');
  //     if (response.data.success && response.data.data.sections) {
  //       const heroSection = response.data.data.sections.find(s => s.section_type === 'hero');
  //       const contactSection = response.data.data.sections.find(s => s.section_type === 'contact');
        
  //       if (heroSection?.content) {
  //         setContactInfo(prev => ({
  //           ...prev,
  //           title: heroSection.content.headline || prev.title,
  //           subtitle: heroSection.content.subheadline || prev.subtitle
  //         }));
  //       }
        
  //       if (contactSection?.content) {
  //         setContactInfo(prev => ({
  //           ...prev,
  //           ...contactSection.content
  //         }));
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error fetching contact data:', error);
  //   }
  // };
const fetchContactData =
async () => {

  try {

    const response =
      await api.get(
        '/pages/slug/contact'
      );

    if (
      response.data.success &&
      response.data.data.sections
    ) {

      const sections =
        response.data.data.sections;

      const heroSection =
        sections.find(
          s =>
          s.section_type === 'hero'
        );

      const contactSection =
        sections.find(
          s =>
          s.section_type === 'contact'
        );

      const formSection =
        sections.find(
          s =>
          s.section_type === 'form'
        );

      setContactInfo({

        hero:
          heroSection?.content || {},

        contact:
          contactSection?.content || {},

        form:
          formSection?.content || {}
      });
    }

  } catch (error) {

    console.error(
      'Error fetching contact data:',
      error
    );
  }
};
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div>
      {/* Hero Section */}
      {
contactInfo.hero?.headline && (
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{contactInfo.hero?.headline}</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">{contactInfo.hero?.subheadline}</p>
        </div>
      </section>
)}
      {/* Contact Information Cards */}
      {
(
  contactInfo.contact?.address ||
  contactInfo.contact?.phone ||
  contactInfo.contact?.email
) && (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <MapPin className="mx-auto text-blue-600 mb-3" size={32} />
              <h3 className="font-semibold mb-2">Visit Us</h3>
              <p className="text-gray-600 text-sm">{contactInfo.address}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <Phone className="mx-auto text-blue-600 mb-3" size={32} />
              <h3 className="font-semibold mb-2">Call Us</h3>
              <p className="text-gray-600 text-sm">{contactInfo.phone}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <Mail className="mx-auto text-blue-600 mb-3" size={32} />
              <h3 className="font-semibold mb-2">Email Us</h3>
              <p className="text-gray-600 text-sm">{contactInfo.email}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <Clock className="mx-auto text-blue-600 mb-3" size={32} />
              <h3 className="font-semibold mb-2">Working Hours</h3>
              <p className="text-gray-600 text-sm">{contactInfo.hours}</p>
            </div>
          </div>
        </div>
      </section>
)}
      {/* Contact Form & Map */}
      {
(
  contactInfo.form?.title ||
  contactInfo.contact?.mapEmbed
) && (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">{contactInfo.form?.title}</h2>
              {submitted ? (
                <div className="bg-green-100 text-green-700 p-4 rounded-lg text-center">
                  <Send className="mx-auto mb-2" size={32} />
                  <p className="font-semibold">Message Sent!</p>
                  <p className="text-sm">We'll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500" />
                  <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500" />
                  <input type="text" name="subject" placeholder="Subject" value={formData.subject} onChange={handleChange} required className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500" />
                  <textarea name="message" placeholder="Message" value={formData.message} onChange={handleChange} required rows="5" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"></textarea>
                  <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
                    <Send size={18} /> {contactInfo.form?.button_text}
                  </button>
                </form>
              )}
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} className="bg-white rounded-xl shadow-lg overflow-hidden">
             {
contactInfo.contact?.mapEmbed && (
              <iframe src={contactInfo.mapEmbed} width="100%" height="100%" style={{ minHeight: '400px' }} allowFullScreen loading="lazy" title="Location Map"></iframe>
            </motion.div>
          </div>
        </div>
      </section>
      )}
    </div>
  );
};

export default ContactPage;