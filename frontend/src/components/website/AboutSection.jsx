import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const AboutSection = ({ data, title }) => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {data.image && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <img
                src={data.image}
                alt={title}
                className="rounded-lg shadow-lg w-full"
              />
            </motion.div>
          )}
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={`${data.image ? 'lg:w-1/2' : 'w-full max-w-3xl mx-auto text-center'}`}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{title}</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">{data.description}</p>
            
            {data.mission && (
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
                <p className="text-gray-700">{data.mission}</p>
              </div>
            )}
            
            {data.points && data.points.length > 0 && (
              <div className="space-y-3">
                {data.points.map((point, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="text-green-500" size={20} />
                    <span className="text-gray-700">{point}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;