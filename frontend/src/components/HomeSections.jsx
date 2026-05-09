import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Star, Users, Award, Clock, Code, Zap, Shield,
  Play, CheckCircle, Quote, MapPin, Mail, Phone,
  ArrowRight, Target, Eye, Heart, Briefcase, TrendingUp
} from 'lucide-react';

// ─── Shared hook: trigger animation once when element enters viewport ──────────
const useInViewOnce = () => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, inView];
};

// ─── Shared icon map ──────────────────────────────────────────────────────────
export const iconMap = {
  Users, Code, Award, Clock, Zap, Shield, Star,
  Target, Eye, Heart, Briefcase, TrendingUp, Mail, Phone, MapPin
};

// ─────────────────────────────────────────────────────────────────────────────
// HERO SECTION
// content: { headline, subheadline, cta_text, secondary_cta_text, trust_badges[] }
// ─────────────────────────────────────────────────────────────────────────────
export const HeroSection = ({ content }) => (
  <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
    <div className="absolute inset-0 bg-black opacity-20" />
    <div className="relative container mx-auto px-4 py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto text-center"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          {content.headline}
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-blue-100">
          {content.subheadline}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {content.cta_text && (
            <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:shadow-lg transition transform hover:scale-105 inline-flex items-center gap-2">
              {content.cta_text} <ArrowRight size={20} />
            </button>
          )}
          {content.secondary_cta_text && (
            <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition inline-flex items-center gap-2">
              <Play size={20} /> {content.secondary_cta_text}
            </button>
          )}
        </div>
        {content.trust_badges?.length > 0 && (
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            {content.trust_badges.map((badge, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <CheckCircle size={16} />
                <span>{badge}</span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  </section>
);

// ─────────────────────────────────────────────────────────────────────────────
// FEATURES SECTION
// content: { title, subtitle, items[{ icon, title, description }] }
// ─────────────────────────────────────────────────────────────────────────────
export const FeaturesSection = ({ content }) => {
  const [ref, inView] = useInViewOnce();
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{content.title}</h2>
          {content.subtitle && <p className="text-gray-600 text-lg">{content.subtitle}</p>}
        </div>
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {content.items?.map((item, idx) => {
            const Icon = iconMap[item.icon] || Star;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition"
              >
                <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="text-blue-600" size={28} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// STATS SECTION
// content: { title, items[{ value, label, suffix }] }
// ─────────────────────────────────────────────────────────────────────────────
export const StatsSection = ({ content }) => {
  const [ref, inView] = useInViewOnce();
  const [counts, setCounts] = useState({});

  useEffect(() => {
    if (!inView) return;
    content.items?.forEach((item, idx) => {
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
  }, [inView]);

  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{content.title}</h2>
        </div>
        <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {content.items?.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ scale: 0 }}
              animate={inView ? { scale: 1 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold mb-2">
                {counts[idx] ?? 0}{item.suffix}
              </div>
              <div className="text-blue-100">{item.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// COURSES SECTION
// content: { title, subtitle, items[{ title, description, duration, price, students, rating, features[] }] }
// ─────────────────────────────────────────────────────────────────────────────
export const CoursesSection = ({ content }) => {
  const [ref, inView] = useInViewOnce();
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{content.title}</h2>
          {content.subtitle && <p className="text-gray-600 text-lg">{content.subtitle}</p>}
        </div>
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.items?.map((course, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
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
                  {course.features?.map((f, fIdx) => (
                    <span key={fIdx} className="text-xs bg-gray-100 px-2 py-1 rounded">{f}</span>
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
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SERVICES SECTION (for Services page)
// content: { title, subtitle, items[{ icon, title, description, price?, features[] }] }
// ─────────────────────────────────────────────────────────────────────────────
export const ServicesSection = ({ content }) => {
  const [ref, inView] = useInViewOnce();
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{content.title}</h2>
          {content.subtitle && <p className="text-gray-600 text-lg">{content.subtitle}</p>}
        </div>
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.items?.map((service, idx) => {
            const Icon = iconMap[service.icon] || Briefcase;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition border border-gray-100"
              >
                <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="text-blue-600" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                {service.features?.length > 0 && (
                  <ul className="space-y-2 mb-4">
                    {service.features.map((f, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle size={14} className="text-green-500" /> {f}
                      </li>
                    ))}
                  </ul>
                )}
                {service.price && (
                  <div className="text-xl font-bold text-blue-600">{service.price}</div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// TESTIMONIALS SECTION
// content: { title, subtitle, items[{ name, role, text, rating }] }
// ─────────────────────────────────────────────────────────────────────────────
export const TestimonialsSection = ({ content }) => {
  const [active, setActive] = useState(0);
  const items = content.items || [];

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => setActive(p => (p + 1) % items.length), 5000);
    return () => clearInterval(timer);
  }, [items.length]);

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{content.title}</h2>
          {content.subtitle && <p className="text-gray-600 text-lg">{content.subtitle}</p>}
        </div>
        <div className="max-w-4xl mx-auto">
          {items[active] && (
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <Quote size={48} className="text-blue-600 mb-4" />
              <p className="text-xl text-gray-700 mb-6">{items[active].text}</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {items[active].name?.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold">{items[active].name}</h4>
                  <p className="text-sm text-gray-500">{items[active].role}</p>
                </div>
              </div>
            </motion.div>
          )}
          {items.length > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {items.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActive(idx)}
                  className={`h-2 rounded-full transition-all ${idx === active ? 'bg-blue-600 w-8' : 'bg-gray-300 w-2'}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ABOUT SECTION
// content: { title, description, mission, vision, values[] }
// ─────────────────────────────────────────────────────────────────────────────
export const AboutSection = ({ content }) => {
  const [ref, inView] = useInViewOnce();
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{content.title}</h2>
            <p className="text-gray-600 text-lg leading-relaxed">{content.description}</p>
          </motion.div>

          {(content.mission || content.vision) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {content.mission && (
                <div className="bg-blue-50 p-6 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="text-blue-600" size={20} />
                    <h3 className="text-xl font-semibold">Our Mission</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{content.mission}</p>
                </div>
              )}
              {content.vision && (
                <div className="bg-purple-50 p-6 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Eye className="text-purple-600" size={20} />
                    <h3 className="text-xl font-semibold">Our Vision</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{content.vision}</p>
                </div>
              )}
            </div>
          )}

          {content.values?.length > 0 && (
            <div ref={ref}>
              <h3 className="text-2xl font-bold text-center mb-8">Our Values</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {content.values.map((value, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className="text-center p-4 bg-gray-50 rounded-lg"
                  >
                    <CheckCircle className="mx-auto text-green-500 mb-2" size={24} />
                    <span className="text-gray-700 font-medium">{value}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// TEAM SECTION
// content: { title, subtitle, items[{ name, role, bio, image? }] }
// ─────────────────────────────────────────────────────────────────────────────
export const TeamSection = ({ content }) => {
  const [ref, inView] = useInViewOnce();
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{content.title}</h2>
          {content.subtitle && <p className="text-gray-600 text-lg">{content.subtitle}</p>}
        </div>
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.items?.map((member, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                {member.name?.charAt(0)}
              </div>
              <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
              <p className="text-blue-600 text-sm mb-3">{member.role}</p>
              {member.bio && <p className="text-gray-600 text-sm">{member.bio}</p>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CTA SECTION
// content: { title, subtitle, button_text }
// ─────────────────────────────────────────────────────────────────────────────
export const CTASection = ({ content }) => (
  <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
    <div className="container mx-auto px-4 text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">{content.title}</h2>
      {content.subtitle && <p className="text-xl mb-8 text-blue-100">{content.subtitle}</p>}
      {content.button_text && (
        <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:shadow-lg transition transform hover:scale-105">
          {content.button_text}
        </button>
      )}
    </div>
  </section>
);

// ─────────────────────────────────────────────────────────────────────────────
// CONTACT SECTION
// content: { title, subtitle, address, phone, email, hours, map_embed? }
// ─────────────────────────────────────────────────────────────────────────────
export const ContactSection = ({ content }) => (
  <section className="py-20">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{content.title}</h2>
        {content.subtitle && <p className="text-gray-600 text-lg">{content.subtitle}</p>}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          {content.address && (
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <MapPin className="text-blue-600 mt-1 shrink-0" size={24} />
              <div><h3 className="font-semibold mb-1">Address</h3><p className="text-gray-600">{content.address}</p></div>
            </div>
          )}
          {content.phone && (
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <Phone className="text-blue-600 mt-1 shrink-0" size={24} />
              <div><h3 className="font-semibold mb-1">Phone</h3><p className="text-gray-600">{content.phone}</p></div>
            </div>
          )}
          {content.email && (
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <Mail className="text-blue-600 mt-1 shrink-0" size={24} />
              <div><h3 className="font-semibold mb-1">Email</h3><p className="text-gray-600">{content.email}</p></div>
            </div>
          )}
          {content.hours && (
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <Clock className="text-blue-600 mt-1 shrink-0" size={24} />
              <div><h3 className="font-semibold mb-1">Working Hours</h3><p className="text-gray-600">{content.hours}</p></div>
            </div>
          )}
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="space-y-4">
            <input type="text" placeholder="Your Name" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
            <input type="email" placeholder="Your Email" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
            <input type="text" placeholder="Subject" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
            <textarea placeholder="Your Message" rows={5} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold">
              Send Message
            </button>
          </div>
        </div>
      </div>
      {content.map_embed && (
        <div className="mt-12 rounded-xl overflow-hidden shadow-lg">
          <iframe src={content.map_embed} width="100%" height="400" style={{ border: 0 }} allowFullScreen loading="lazy" title="Location Map" />
        </div>
      )}
    </div>
  </section>
);