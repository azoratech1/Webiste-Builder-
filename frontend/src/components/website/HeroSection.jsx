import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';

const HeroSection = ({ data, title }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-purple-700 text-white">
      {data.background_image && (
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${data.background_image})` }}
        />
      )}
      
      <div className="relative container mx-auto px-4 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {data.headline || title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            {data.subheadline}
          </p>
          
          {data.cta_text && (
            <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:shadow-lg transition transform hover:scale-105 inline-flex items-center gap-2">
              {data.cta_text}
              <ArrowRight size={20} />
            </button>
          )}
          
          {data.trust_badges && (
            <div className="mt-12 flex flex-wrap justify-center gap-4">
              {data.trust_badges.map((badge, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
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
};

export default HeroSection;