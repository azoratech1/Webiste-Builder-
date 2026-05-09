import React from 'react';
import { motion } from 'framer-motion';
import { Star, Users, Award, TrendingUp, Shield, Zap } from 'lucide-react';

const iconMap = {
  Star: Star,
  Users: Users,
  Award: Award,
  TrendingUp: TrendingUp,
  Shield: Shield,
  Zap: Zap
};

const FeaturesSection = ({ data, title }) => {
  const items = data?.items || [];
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {title && (
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{title}</h2>
            {data.subtitle && <p className="text-gray-600 max-w-2xl mx-auto">{data.subtitle}</p>}
          </div>
        )}
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {items.map((item, index) => {
            const IconComponent = iconMap[item.icon] || Star;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <IconComponent className="text-blue-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;