import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code, Smartphone, Cloud, Shield, TrendingUp, BarChart, ArrowRight, CheckCircle } from 'lucide-react';
import api from '../services/api';

const ServicesPage = () => {
  // const [servicesData, setServicesData] = useState({
  //   hero: {
  //     title: 'Our Services',
  //     subtitle: 'Comprehensive digital solutions for your business',
  //     description: 'We offer a wide range of services to help your business grow and succeed.'
  //   },
  //   servicesList: [
  //     { icon: Code, title: 'Web Development', description: 'Custom websites and web applications', features: ['React/Angular/Vue', 'Node.js/Python', 'Responsive Design'] },
  //     { icon: Smartphone, title: 'Mobile Development', description: 'Native and cross-platform mobile apps', features: ['iOS & Android', 'React Native', 'Flutter'] },
  //     { icon: Cloud, title: 'Cloud Solutions', description: 'Scalable cloud infrastructure', features: ['AWS/Azure/GCP', 'DevOps', 'Cloud Migration'] },
  //     { icon: Shield, title: 'Cybersecurity', description: 'Protect your business', features: ['Security Audits', 'Penetration Testing', 'Compliance'] },
  //     { icon: TrendingUp, title: 'Digital Marketing', description: 'Grow your online presence', features: ['SEO Optimization', 'Social Media', 'Content Marketing'] },
  //     { icon: BarChart, title: 'Data Analytics', description: 'Turn data into insights', features: ['Business Intelligence', 'Data Visualization', 'Predictive Analytics'] }
  //   ],
  //   process: [
  //     { step: '01', title: 'Discovery', description: 'Understanding your goals' },
  //     { step: '02', title: 'Planning', description: 'Strategic planning' },
  //     { step: '03', title: 'Development', description: 'Agile development' },
  //     { step: '04', title: 'Launch', description: 'Deployment and support' }
  //   ]
  // });
  const [servicesData, setServicesData] = useState({

  hero: {},

  servicesList: [],

  process: []
});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServicesData();
  }, []);

  const fetchServicesData = async () => {
    try {
      const response = await api.get('/pages/slug/services');
      if (response.data.success && response.data.data.sections) {
        const heroSection = response.data.data.sections.find(s => s.section_type === 'hero');
        const servicesSection = response.data.data.sections.find(s => s.section_type === 'services');
        const processSection = response.data.data.sections.find(s => s.section_type === 'process');
        
        if (heroSection?.content) {
          setServicesData(prev => ({
            ...prev,
            hero: {
              title: heroSection.content.headline || prev.hero.title,
              subtitle: heroSection.content.subheadline || prev.hero.subtitle,
              description: heroSection.content.description || prev.hero.description
            }
          }));
        }
        
        if (servicesSection?.content) {
          setServicesData(prev => ({
            ...prev,
            servicesList: servicesSection.content.items || prev.servicesList
          }));
        }
        
        if (processSection?.content) {
          setServicesData(prev => ({
            ...prev,
            process: processSection.content.items || prev.process
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching services data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const serviceIcons = { 'Web Development': Code, 'Mobile Development': Smartphone, 'Cloud Solutions': Cloud, 'Cybersecurity': Shield, 'Digital Marketing': TrendingUp, 'Data Analytics': BarChart };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{servicesData.hero.title}</h1>
          <p className="text-xl text-blue-100 mb-4">{servicesData.hero.subtitle}</p>
          <p className="text-lg max-w-2xl mx-auto">{servicesData.hero.description}</p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesData.servicesList.map((service, idx) => {
              const Icon = serviceIcons[service.title] || Code;
              return (
                <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition group">
                  <div className="p-6">
                    <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 transition">
                      <Icon className="text-blue-600 group-hover:text-white transition" size={28} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <div className="space-y-2">
                      {service.features?.map((feature, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2 text-sm text-gray-500">
                          <CheckCircle size={14} className="text-green-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {servicesData.process.map((step, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">{step.step}</div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8">Let's discuss how we can help your business grow</p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:shadow-lg transition">Contact Us Today</button>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;