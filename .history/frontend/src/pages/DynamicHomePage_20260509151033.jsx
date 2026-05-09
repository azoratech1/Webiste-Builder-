import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Star, Users, Award, TrendingUp, Shield, Zap, Clock, Code,
  ChevronRight, Play, CheckCircle, Quote, MapPin, Mail, Phone,
  Facebook, Twitter, Linkedin, Instagram, BookOpen, Cloud, Smartphone,
  ArrowRight
} from 'lucide-react';
import api from '../services/api';

const DynamicHomePage = () => {
  const [homeData, setHomeData] = useState({
    hero: {
      headline: "Build Amazing Websites",
      subheadline: "Create dynamic pages with our powerful page builder",
      cta_text: "Get Started",
      secondary_cta_text: "Watch Demo",
      trust_badges: ["Professional", "Trusted", "Secure"]
    },
    features: {
      title: "Why Choose Us?",
      subtitle: "What makes us different from others",
      items: [
        { icon: "Users", title: "Expert Trainers", description: "Learn from industry professionals" },
        { icon: "Code", title: "Live Projects", description: "Work on real-world projects" },
        { icon: "Award", title: "Placement Support", description: "98% placement record" },
        { icon: "Clock", title: "Flexible Schedule", description: "Weekend and evening batches" }
      ]
    },
    stats: {
      title: "Our Impact in Numbers",
      items: [
        { value: 15000, label: "Students Trained", suffix: "+" },
        { value: 98, label: "Placement Rate", suffix: "%" },
        { value: 500, label: "Partner Companies", suffix: "+" },
        { value: 50, label: "Expert Faculty", suffix: "+" }
      ]
    },
    courses: {
      title: "Our Popular Courses",
      subtitle: "Choose the right course for your career",
      items: [
        {
          title: "Full Stack Web Development",
          description: "Master MERN, MEAN, and modern web technologies",
          duration: "6 Months",
          price: "₹59,999",
          students: 1240,
          rating: 4.8,
          features: ["Live Classes", "Projects", "Certification"]
        },
        {
          title: "Data Science & AI",
          description: "Learn Python, ML, Deep Learning and AI",
          duration: "8 Months",
          price: "₹79,999",
          students: 890,
          rating: 4.9,
          features: ["Python", "TensorFlow", "Real Projects"]
        },
        {
          title: "Mobile App Development",
          description: "iOS and Android development with React Native",
          duration: "5 Months",
          price: "₹49,999",
          students: 670,
          rating: 4.7,
          features: ["React Native", "Firebase", "App Deployment"]
        }
      ]
    },
    testimonials: {
      title: "What Our Students Say",
      subtitle: "Success stories from our alumni",
      items: [
        {
          name: "Priya Sharma",
          role: "Software Engineer at Google",
          text: "The best decision I ever made!",
          rating: 5,
          image: null
        },
        {
          name: "Rahul Verma",
          role: "Full Stack Developer at Amazon",
          text: "Got placed with 24 LPA!",
          rating: 5,
          image: null
        },
        {
          name: "Anjali Singh",
          role: "Backend Developer at Microsoft",
          text: "Live projects made all the difference.",
          rating: 5,
          image: null
        }
      ]
    },
    cta: {
      title: "Ready to Start Your Journey?",
      subtitle: "Join thousands of successful students",
      button_text: "Enroll Now"
    },
    contact: {
      title: "Get In Touch",
      subtitle: "Have questions? We're here to help",
      address: "123 Tech Park, Silicon Valley, CA 94025",
      phone: "+1 (555) 123-4567",
      email: "info@abctechnologies.com",
      hours: "Mon-Fri: 9AM - 6PM"
    },
    slides: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeSlide,
setActiveSlide] =
useState(0);
  const [counts, setCounts] = useState({});

  useEffect(() => {
    fetchHomepageData();
    console.log("hero data is"homeData.hero);
  }, []);
useEffect(() => {

  if (
    !homeData.hero?.slides?.length
  ) return;

  const timer = setInterval(() => {

    setActiveSlide((prev) => {

      return (
        (prev + 1) %
        homeData.hero.slides.length
      );
    });

  }, 4000);

  return () =>
    clearInterval(timer);

}, [
  homeData.hero?.slides?.length
]);
  // Setup intersection observers
  const [featuresRef, featuresInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [statsRef, statsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [coursesRef, coursesInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [testimonialsRef, testimonialsInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    if (statsInView) {
      startCounters();
    }
  }, [statsInView]);

useEffect(() => {

  if (
    !homeData.testimonials?.items?.length
  ) return;

  const timer = setInterval(() => {

    setActiveTestimonial((prev) => {

      return (
        (prev + 1) %
        homeData.testimonials.items.length
      );
    });

  }, 5000);

  return () => clearInterval(timer);

}, [
  homeData.testimonials?.items?.length
]);
  const fetchHomepageData = async () => {
    try {
      // Try to fetch from database
      const response = await api.get('/pages/slug/home');
      if (response.data.success && response.data.data.sections) {
        const sections = response.data.data.sections;
        
        // Map database sections to component data
        const heroSection = sections.find(s => s.section_type === 'hero');
        const featuresSection = sections.find(s => s.section_type === 'features');
        const statsSection = sections.find(s => s.section_type === 'stats');
        const coursesSection = sections.find(s => s.section_type === 'courses');
        const testimonialsSection = sections.find(s => s.section_type === 'testimonials');
        const ctaSection = sections.find(s => s.section_type === 'cta');
        const contactSection = sections.find(s => s.section_type === 'contact');
        
      setHomeData({

  hero:
    heroSection?.content || {},

  features:
    featuresSection?.content || {
      items: []
    },

  stats:
    statsSection?.content || {
      items: []
    },

  courses:
    coursesSection?.content || {
      items: []
    },

  testimonials:
    testimonialsSection?.content || {
      items: []
    },

  cta:
    ctaSection?.content || {},

  contact:
    contactSection?.content || {}
});
      }
    } catch (error) {
      console.error('Error fetching homepage data:', error);
      // Keep using default data
    } finally {
      setLoading(false);
    }
  };

  const startCounters = () => {
   homeData.stats?.items?.forEach((item, idx) => {
      let start = 0;
      const end = item.value;
      const duration = 2000;
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCounts(prev => ({ ...prev, [idx]: end }));
          clearInterval(timer);
        } else {
          setCounts(prev => ({ ...prev, [idx]: Math.floor(start) }));
        }
      }, 16);
    });
  };

  const iconMap = {
    Users: Users,
    Code: Code,
    Award: Award,
    Clock: Clock,
    Zap: Zap,
    Shield: Shield,
    Star: Star
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      {homeData.hero?.headline && (
     // <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
     <section className="relative overflow-hidden text-white min-h-[90vh] flex items-center">
        {/* <div className="absolute inset-0 bg-black opacity-20"></div> */}
        {
homeData.hero?.slides?.length > 0 && (

<div className="absolute inset-0">

  {homeData.hero.slides.map(
    (slide, idx) => (

      <img
        key={idx}

        src={slide.image}

        alt={slide.title}

        className={`
          absolute inset-0
          w-full h-full
          object-cover
          transition-opacity
          duration-1000

          ${
            idx === activeSlide
              ? 'opacity-100'
              : 'opacity-0'
          }
        `}
      />
    )
  )}

</div>

)
}

<div className="absolute inset-0 bg-black/60"></div>
       <div className="relative z-10 container mx-auto px-4 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {homeData.hero.headline}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              {homeData.hero.subheadline}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:shadow-lg transition transform hover:scale-105 inline-flex items-center gap-2">
                {homeData.hero.cta_text} <ArrowRight size={20} />
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition inline-flex items-center gap-2">
                <Play size={20} /> {homeData.hero.secondary_cta_text}
              </button>
            </div>
            {homeData.hero.trust_badges && (
              <div className="mt-12 flex flex-wrap justify-center gap-4">
                {homeData.hero.trust_badges.map((badge, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <CheckCircle size={16} />
                    <span>{badge}</span>
                  </div>
                ))}
              </div>
            )}
            {
homeData.hero?.slides?.length > 1 && (

<div className="flex justify-center gap-2 mt-8">

  {homeData.hero.slides.map(
    (_, idx) => (

      <button
        key={idx}

        onClick={() =>
          setActiveSlide(idx)
        }

        className={`
          h-3 rounded-full
          transition-all duration-300

          ${
            idx === activeSlide
              ? 'bg-white w-8'
              : 'bg-white/50 w-3'
          }
        `}
      />
    )
  )}

</div>

)
}
          </motion.div>
        </div>
      </section>
)}
      {/* Features Section */}
      {homeData.features?.items?.length > 0 && (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{homeData.features.title}</h2>
            <p className="text-gray-600 text-lg">{homeData.features.subtitle}</p>
          </div>
          <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {homeData.features.items.map((item, idx) => {
              const IconComponent = iconMap[item.icon] || Star;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition"
                >
                  <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="text-blue-600" size={28} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
)}
      {/* Stats Section */}
      {homeData.stats?.items?.length > 0 && (
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{homeData.stats.title}</h2>
          </div>
          <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {homeData.stats.items.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ scale: 0 }}
                animate={statsInView ? { scale: 1 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {(counts[idx] || 0)}{item.suffix}
                </div>
                <div className="text-blue-100">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
)}
      {/* Courses Section */}
      {homeData.courses?.items?.length > 0 && (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{homeData.courses.title}</h2>
            <p className="text-gray-600 text-lg">{homeData.courses.subtitle}</p>
          </div>
          <div ref={coursesRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {homeData.courses.items.map((course, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={coursesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold">{course.title}</h3>
                    <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded">
                      <Star size={14} className="text-yellow-500 fill-current" />
                      <span className="text-sm font-semibold">{course.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{course.description}</p>
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                    <span>📅 {course.duration}</span>
                    <span>👨‍🎓 {course.students}+ students</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {course.features.map((feature, fIdx) => (
                      <span key={fIdx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {feature}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600">{course.price}</span>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                      Enroll Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
)}
      {/* Testimonials Section */}
   {homeData.testimonials?.items?.length > 0 && (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{homeData.testimonials.title}</h2>
            <p className="text-gray-600 text-lg">{homeData.testimonials.subtitle}</p>
          </div>
          <div ref={testimonialsRef} className="max-w-4xl mx-auto">
            <motion.div
              key={activeTestimonial}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <Quote size={48} className="text-blue-600 mb-4" />
              <p className="text-xl text-gray-700 mb-6">{homeData.testimonials.items[activeTestimonial].text}</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {homeData.testimonials.items[activeTestimonial].name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold">{homeData.testimonials.items[activeTestimonial].name}</h4>
                  <p className="text-sm text-gray-500">{homeData.testimonials.items[activeTestimonial].role}</p>
                </div>
              </div>
            </motion.div>
            <div className="flex justify-center gap-2 mt-6">
              {homeData.testimonials.items.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTestimonial(idx)}
                  className={`w-2 h-2 rounded-full transition ${
                    idx === activeTestimonial ? 'bg-blue-600 w-8' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
)}
      {/* CTA Section */}
      {homeData.cta?.title && (
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{homeData.cta.title}</h2>
          <p className="text-xl mb-8 text-blue-100">{homeData.cta.subtitle}</p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:shadow-lg transition transform hover:scale-105">
            {homeData.cta.button_text}
          </button>
        </div>
      </section>
)}
      {/* Contact Section */}
      {homeData.contact?.title && (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{homeData.contact.title}</h2>
            <p className="text-gray-600 text-lg">{homeData.contact.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <MapPin className="mx-auto text-blue-600 mb-4" size={32} />
              <h3 className="font-semibold mb-2">Address</h3>
              <p className="text-gray-600">{homeData.contact.address}</p>
            </div>
            <div className="text-center">
              <Phone className="mx-auto text-blue-600 mb-4" size={32} />
              <h3 className="font-semibold mb-2">Phone</h3>
              <p className="text-gray-600">{homeData.contact.phone}</p>
            </div>
            <div className="text-center">
              <Mail className="mx-auto text-blue-600 mb-4" size={32} />
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-gray-600">{homeData.contact.email}</p>
            </div>
            <div className="text-center">
              <Clock className="mx-auto text-blue-600 mb-4" size={32} />
              <h3 className="font-semibold mb-2">Working Hours</h3>
              <p className="text-gray-600">{homeData.contact.hours}</p>
            </div>
          </div>
        </div>
      </section>
      )}
    </div>
  );
};

export default DynamicHomePage;