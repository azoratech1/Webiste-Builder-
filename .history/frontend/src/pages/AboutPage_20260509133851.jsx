import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Users, Award, Clock, Heart, Target, Globe, CheckCircle } from 'lucide-react';
import api from '../services/api';

const AboutPage = () => {
  // const [aboutData, setAboutData] = useState({
  //   hero: {
  //     title: 'About Our Company',
  //     subtitle: 'Learn more about who we are',
  //     description: 'We are a leading technology company dedicated to providing innovative solutions.'
  //   },
  //   stats: [
  //     { icon: Users, value: '500+', label: 'Happy Clients' },
  //     { icon: Award, value: '50+', label: 'Awards Won' },
  //     { icon: Clock, value: '8+', label: 'Years Experience' },
  //     { icon: Heart, value: '1000+', label: 'Projects Completed' }
  //   ],
  //   mission: {
  //     title: 'Our Mission',
  //     description: 'To empower businesses with cutting-edge technology solutions that drive growth.',
  //     vision: 'To be the global leader in digital transformation.'
  //   },
  //   values: ['Innovation', 'Quality', 'Integrity', 'Collaboration', 'Excellence'],
  //   team: {
  //     title: 'Meet Our Leadership Team',
  //     members: [
  //       { name: 'John Smith', role: 'CEO & Founder', bio: '20+ years of experience' },
  //       { name: 'Sarah Johnson', role: 'CTO', bio: 'Expert in cloud architecture' },
  //       { name: 'Mike Wilson', role: 'Head of Design', bio: 'Award-winning designer' }
  //     ]
  //   }
  // });
  const [aboutData, setAboutData] = useState({

  hero: {},

  stats: {
    items: []
  },

  mission: {},

  values: [],

  team: {
    title: '',
    members: []
  }
});
  const [loading, setLoading] = useState(true);

  // Fix: Properly use useInView hook
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    fetchAboutData();
  }, []);

 const fetchAboutData = async () => {

  try {

    const response =
      await api.get(
        '/pages/slug/about'
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

      const statsSection =
        sections.find(
          s =>
          s.section_type === 'stats'
        );

      const aboutSection =
        sections.find(
          s =>
          s.section_type === 'about'
        );

      const teamSection =
        sections.find(
          s =>
          s.section_type === 'team'
        );

      setAboutData({

        hero: {

          title:
            heroSection?.content?.headline || '',

          subtitle:
            heroSection?.content?.subheadline || '',

          description:
            heroSection?.content?.description || ''
        },

        stats:
          statsSection?.content || {
            items: []
          },

        mission: {

          title:
            aboutSection?.content?.mission_title || '',

          description:
            aboutSection?.content?.mission || '',

          vision:
            aboutSection?.content?.vision || ''
        },

        values:
          aboutSection?.content?.values || [],

        team: {

          title:
            teamSection?.content?.title || '',

          members:
            teamSection?.content?.members || []
        }
      });
    }

  } catch (error) {

    console.error(
      'Error fetching about data:',
      error
    );

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

  return (
    <div>
      {/* Hero Section */}
      {aboutData.hero?.title && (
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            {aboutData.hero.title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-blue-100 mb-6 max-w-2xl mx-auto"
          >
            {aboutData.hero.subtitle}
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg max-w-3xl mx-auto"
          >
            {aboutData.hero.description}
          </motion.p>
        </div>
      </section>
)}
      {/* Stats Section */}
      {aboutData.stats?.items?.length > 0 && (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {aboutData.stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <stat.icon className="mx-auto text-blue-600 mb-3" size={40} />
                <div className="text-3xl font-bold text-gray-800">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
)}
      {/* Mission & Vision */}
      {
(
  aboutData.mission?.title ||
  aboutData.mission?.vision
) && (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-8 rounded-xl shadow-lg"
            >
              <Target className="text-blue-600 mb-4" size={40} />
              <h3 className="text-2xl font-bold mb-4">{aboutData.mission.title}</h3>
              <p className="text-gray-600 leading-relaxed">{aboutData.mission.description}</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-8 rounded-xl shadow-lg"
            >
              <Globe className="text-blue-600 mb-4" size={40} />
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">{aboutData.mission.vision}</p>
            </motion.div>
          </div>
        </div>
      </section>
)}
      {/* Values Section */}
      {aboutData.values?.length > 0 && (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {aboutData.values.map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-md text-center"
              >
                <CheckCircle className="mx-auto text-green-500 mb-3" size={32} />
                <h3 className="text-lg font-semibold">{value}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{aboutData.team.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {aboutData.team.members.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="w-32 h-32 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
                  {member.name.charAt(0)}
                </div>
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-blue-600 mb-2">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;