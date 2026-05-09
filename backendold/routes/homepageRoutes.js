const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all homepage sections
router.get('/sections', async (req, res) => {
  try {
    console.log('📊 Fetching homepage sections...');
    
    // Check if table exists
    const [tables] = await db.query("SHOW TABLES LIKE 'homepage_sections'");
    
    if (tables.length === 0) {
      console.log('⚠️ Homepage sections table not found, creating...');
      // Create table if it doesn't exist
      await db.query(`
        CREATE TABLE IF NOT EXISTS homepage_sections (
          id INT PRIMARY KEY AUTO_INCREMENT,
          section_key VARCHAR(100) UNIQUE NOT NULL,
          section_name VARCHAR(255) NOT NULL,
          content JSON NOT NULL,
          is_active BOOLEAN DEFAULT true,
          order_position INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      
      // Insert default sections
      await insertDefaultSections(db);
    }
    
    const [rows] = await db.query(
      'SELECT * FROM homepage_sections WHERE is_active = true ORDER BY order_position'
    );
    
    // Parse JSON content for each section
    const sections = rows.map(section => ({
      ...section,
      content: typeof section.content === 'string' ? JSON.parse(section.content) : section.content
    }));
    
    console.log(`✅ Found ${sections.length} homepage sections`);
    res.json({ success: true, data: sections });
  } catch (error) {
    console.error('❌ Error fetching homepage sections:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single section by key
router.get('/section/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const [rows] = await db.query(
      'SELECT * FROM homepage_sections WHERE section_key = ? AND is_active = true',
      [key]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Section not found' });
    }
    
    const section = {
      ...rows[0],
      content: typeof rows[0].content === 'string' ? JSON.parse(rows[0].content) : rows[0].content
    };
    
    res.json({ success: true, data: section });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update specific section
router.put('/section/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const { content } = req.body;
    
    const contentJson = JSON.stringify(content);
    
    const [result] = await db.query(
      'UPDATE homepage_sections SET content = ? WHERE section_key = ?',
      [contentJson, key]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Section not found' });
    }
    
    res.json({ success: true, message: 'Section updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update section active status
router.patch('/section/:key/toggle', async (req, res) => {
  try {
    const { key } = req.params;
    const { is_active } = req.body;
    
    await db.query(
      'UPDATE homepage_sections SET is_active = ? WHERE section_key = ?',
      [is_active, key]
    );
    
    res.json({ success: true, message: 'Section status updated' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Helper function to insert default sections
async function insertDefaultSections(db) {
  const defaultSections = [
    {
      section_key: 'hero',
      section_name: 'Hero Section',
      content: {
        headline: 'Master Modern Web Development',
        subheadline: "Join India's #1 Coding Institute with 98% Placement Record",
        cta_text: 'Start Learning Today',
        cta_link: '/courses',
        secondary_cta_text: 'Watch Demo',
        secondary_cta_link: '/demo',
        background_image: null,
        trust_badges: ['Industry Expert Trainers', 'Live Projects', '100% Job Assistance', 'Certification']
      },
      order_position: 1
    },
    {
      section_key: 'features',
      section_name: 'Key Features',
      content: {
        title: 'Why Choose Us?',
        subtitle: 'What makes us different from others',
        items: [
          {
            icon: 'Users',
            title: 'Expert Trainers',
            description: 'Learn from industry professionals with 10+ years experience'
          },
          {
            icon: 'Code',
            title: 'Live Projects',
            description: 'Work on real-world projects and build your portfolio'
          },
          {
            icon: 'Award',
            title: 'Placement Support',
            description: '98% placement record with top MNCs'
          },
          {
            icon: 'Clock',
            title: 'Flexible Schedule',
            description: 'Weekend and evening batches available'
          }
        ]
      },
      order_position: 2
    },
    {
      section_key: 'stats',
      section_name: 'Statistics',
      content: {
        title: 'Our Impact in Numbers',
        items: [
          { value: 15000, label: 'Students Trained', suffix: '+' },
          { value: 98, label: 'Placement Rate', suffix: '%' },
          { value: 500, label: 'Partner Companies', suffix: '+' },
          { value: 50, label: 'Expert Faculty', suffix: '+' }
        ]
      },
      order_position: 3
    },
    {
      section_key: 'courses',
      section_name: 'Popular Courses',
      content: {
        title: 'Our Popular Courses',
        subtitle: 'Choose the right course for your career',
        items: [
          {
            title: 'Full Stack Web Development',
            description: 'Master MERN, MEAN, and modern web technologies',
            duration: '6 Months',
            price: '₹59,999',
            students: 1240,
            rating: 4.8,
            features: ['Live Classes', 'Projects', 'Certification']
          },
          {
            title: 'Data Science & AI',
            description: 'Learn Python, ML, Deep Learning and AI',
            duration: '8 Months',
            price: '₹79,999',
            students: 890,
            rating: 4.9,
            features: ['Python', 'TensorFlow', 'Real Projects']
          },
          {
            title: 'Mobile App Development',
            description: 'iOS and Android development with React Native',
            duration: '5 Months',
            price: '₹49,999',
            students: 670,
            rating: 4.7,
            features: ['React Native', 'Firebase', 'App Deployment']
          }
        ]
      },
      order_position: 4
    },
    {
      section_key: 'testimonials',
      section_name: 'Student Testimonials',
      content: {
        title: 'What Our Students Say',
        subtitle: 'Success stories from our alumni',
        items: [
          {
            name: 'Priya Sharma',
            role: 'Software Engineer at Google',
            text: 'The best decision I ever made! The curriculum is industry-relevant and instructors are amazing.',
            rating: 5,
            image: null
          },
          {
            name: 'Rahul Verma',
            role: 'Full Stack Developer at Amazon',
            text: 'Got placed with 24 LPA. The placement support is outstanding!',
            rating: 5,
            image: null
          },
          {
            name: 'Anjali Singh',
            role: 'Backend Developer at Microsoft',
            text: 'Live projects and real-world experience made all the difference.',
            rating: 5,
            image: null
          }
        ]
      },
      order_position: 5
    },
    {
      section_key: 'cta',
      section_name: 'Call to Action',
      content: {
        title: 'Ready to Start Your Journey?',
        subtitle: 'Join thousands of successful students who transformed their careers',
        button_text: 'Enroll Now',
        button_link: '/contact',
        background_image: null
      },
      order_position: 6
    },
    {
      section_key: 'contact',
      section_name: 'Contact Section',
      content: {
        title: 'Get In Touch',
        subtitle: "Have questions? We're here to help",
        address: '123 Tech Park, Silicon Valley, CA 94025',
        phone: '+1 (555) 123-4567',
        email: 'info@abctechnologies.com',
        hours: 'Mon-Fri: 9AM - 6PM'
      },
      order_position: 7
    }
  ];
  
  for (const section of defaultSections) {
    await db.query(
      'INSERT INTO homepage_sections (section_key, section_name, content, order_position) VALUES (?, ?, ?, ?)',
      [section.section_key, section.section_name, JSON.stringify(section.content), section.order_position]
    );
  }
  
  console.log('✅ Default homepage sections inserted');
}

module.exports = router;