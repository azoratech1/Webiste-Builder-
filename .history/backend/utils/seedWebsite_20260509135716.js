const Page =
require('../models/Page');

const Section =
require('../models/Section');

const Setting =
require('../models/Setting');

module.exports =
module.exports =
async (
  websiteId,
  websiteName
) => {

  // =========================
  // CREATE DEFAULT PAGES
  // =========================

  const homePage =
    await Page.create({

      id: 1,

      website_id:
        websiteId,

      name: 'Home',

      slug: 'home',

      is_active: true,

      show_in_nav: true,

      order_position: 1
    });

  const aboutPage =
    await Page.create({

      id: 2,

      website_id:
        websiteId,

      name: 'About',

      slug: 'about',

      is_active: true,

      show_in_nav: true,

      order_position: 2
    });

  const servicesPage =
    await Page.create({

      id: 3,

      website_id:
        websiteId,

      name: 'Services',

      slug: 'services',

      is_active: true,

      show_in_nav: true,

      order_position: 3
    });

  const contactPage =
    await Page.create({

      id: 4,

      website_id:
        websiteId,

      name: 'Contact',

      slug: 'contact',

      is_active: true,

      show_in_nav: true,

      order_position: 4
    });

  // =========================
  // HOME PAGE SECTIONS
  // =========================

  await Section.insertMany([

    {
      id: 1,
      website_id: websiteId,
      page_id: homePage.id,
      section_type: 'hero',
      title: 'Hero',
      order_position: 1,

      content: {
        headline:
          "Build Amazing Websites",

        subheadline:
          "Create dynamic pages with our powerful page builder",

        cta_text:
          "Get Started",

        secondary_cta_text:
          "Watch Demo",

        trust_badges: [
          "Professional",
          "Trusted",
          "Secure"
        ]
      }
    },

    {
      id: 2,
      website_id: websiteId,
      page_id: homePage.id,
      section_type: 'features',
      title: 'Features',
      order_position: 2,

      content: {

        title:
          "Why Choose Us?",

        subtitle:
          "What makes us different from others",

        items: [

          {
            icon: "Users",
            title:
              "Expert Trainers",

            description:
              "Learn from industry professionals"
          },

          {
            icon: "Code",
            title:
              "Live Projects",

            description:
              "Work on real-world projects"
          },

          {
            icon: "Award",
            title:
              "Placement Support",

            description:
              "98% placement record"
          },

          {
            icon: "Clock",
            title:
              "Flexible Schedule",

            description:
              "Weekend and evening batches"
          }
        ]
      }
    },

    {
      id: 3,
      website_id: websiteId,
      page_id: homePage.id,
      section_type: 'stats',
      title: 'Stats',
      order_position: 3,

      content: {

        title:
          "Our Impact in Numbers",

        items: [

          {
            value: 15000,
            label:
              "Students Trained",
            suffix: "+"
          },

          {
            value: 98,
            label:
              "Placement Rate",
            suffix: "%"
          },

          {
            value: 500,
            label:
              "Partner Companies",
            suffix: "+"
          },

          {
            value: 50,
            label:
              "Expert Faculty",
            suffix: "+"
          }
        ]
      }
    },

    {
      id: 4,
      website_id: websiteId,
      page_id: homePage.id,
      section_type: 'courses',
      title: 'Courses',
      order_position: 4,

      content: {

        title:
          "Our Popular Courses",

        subtitle:
          "Choose the right course for your career",

        items: [

          {
            title:
              "Full Stack Web Development",

            description:
              "Master MERN Stack",

            duration:
              "6 Months",

            price:
              "₹59,999",

            students: 1240,

            rating: 4.8,

            features: [
              "Live Classes",
              "Projects",
              "Certification"
            ]
          }
        ]
      }
    },

    {
      id: 5,
      website_id: websiteId,
      page_id: homePage.id,
      section_type: 'testimonials',
      title: 'Testimonials',
      order_position: 5,

      content: {

        title:
          "What Our Students Say",

        subtitle:
          "Success stories",

        items: [

          {
            name:
              "Priya Sharma",

            role:
              "Software Engineer",

            text:
              "Best decision ever!",

            rating: 5
          }
        ]
      }
    },

    {
      id: 6,
      website_id: websiteId,
      page_id: homePage.id,
      section_type: 'cta',
      title: 'CTA',
      order_position: 6,

      content: {

        title:
          "Ready to Start Your Journey?",

        subtitle:
          "Join thousands of successful students",

        button_text:
          "Enroll Now"
      }
    },

    {
      id: 7,
      website_id: websiteId,
      page_id: homePage.id,
      section_type: 'contact',
      title: 'Contact',
      order_position: 7,

      content: {

        title:
          "Get In Touch",

        subtitle:
          "Have questions? We're here to help",

        address:
          "123 Tech Park",

        phone:
          "+1 555 123456",

        email:
          "info@test.com",

        hours:
          "Mon-Fri"
      }
    }
  ]);

  // =========================
  // ABOUT PAGE SECTIONS
  // =========================

  await Section.insertMany([

    {
      id: 30,
      website_id: websiteId,
      page_id: aboutPage.id,
      section_type: 'hero',
      title: 'About Hero',
      order_position: 1,

      content: {

        headline:
          'About Our Company',

        subheadline:
          'Learn more about who we are',

        description:
          'We are a leading technology company dedicated to providing innovative solutions.'
      }
    },

    {
      id: 31,
      website_id: websiteId,
      page_id: aboutPage.id,
      section_type: 'stats',
      title: 'About Stats',
      order_position: 2,

      content: {

        items: [

          {
            value: '500+',
            label: 'Happy Clients'
          },

          {
            value: '50+',
            label: 'Awards Won'
          },

          {
            value: '8+',
            label: 'Years Experience'
          },

          {
            value: '1000+',
            label: 'Projects Completed'
          }
        ]
      }
    },

    {
      id: 32,
      website_id: websiteId,
      page_id: aboutPage.id,
      section_type: 'about',
      title: 'Mission Vision',
      order_position: 3,

      content: {

        mission_title:
          'Our Mission',

        mission:
          'To empower businesses with cutting-edge technology solutions that drive growth.',

        vision:
          'To be the global leader in digital transformation.',

        values: [

          'Innovation',

          'Quality',

          'Integrity',

          'Collaboration',

          'Excellence'
        ]
      }
    },

    {
      id: 33,
      website_id: websiteId,
      page_id: aboutPage.id,
      section_type: 'team',
      title: 'Team',
      order_position: 4,

      content: {

        title:
          'Meet Our Leadership Team',

        members: [

          {
            name:
              'John Smith',

            role:
              'CEO & Founder',

            bio:
              '20+ years of experience'
          },

          {
            name:
              'Sarah Johnson',

            role:
              'CTO',

            bio:
              'Expert in cloud architecture'
          },

          {
            name:
              'Mike Wilson',

            role:
              'Head of Design',

            bio:
              'Award-winning designer'
          }
        ]
      }
    }
  ]);

  // =========================
  // SERVICES PAGE SECTIONS
  // =========================

  await Section.insertMany([

    {
      id: 50,
      website_id: websiteId,
      page_id: servicesPage.id,
      section_type: 'hero',
      title: 'Services Hero',
      order_position: 1,

      content: {

        title:
          'Our Services',

        subtitle:
          'Professional solutions for your business'
      }
    },

    {
      id: 51,
      website_id: websiteId,
      page_id: servicesPage.id,
      section_type: 'services',
      title: 'Services List',
      order_position: 2,

      content: {

        items: [

          {
            title:
              'Web Development',

            description:
              'Modern responsive websites',

            icon:
              'Code'
          },

          {
            title:
              'Mobile Apps',

            description:
              'Android & iOS applications',

            icon:
              'Smartphone'
          },

          {
            title:
              'UI/UX Design',

            description:
              'Creative user experiences',

            icon:
              'Palette'
          },

          {
            title:
              'Digital Marketing',

            description:
              'Grow your online presence',

            icon:
              'TrendingUp'
          }
        ]
      }
    },

    {
      id: 52,
      website_id: websiteId,
      page_id: servicesPage.id,
      section_type: 'process',
      title: 'Process',
      order_position: 3,

      content: {

        items: [

          {
            step: '01',
            title: 'Planning',
            description: 'Understanding requirements'
          },

          {
            step: '02',
            title: 'Design',
            description: 'Creating UI/UX'
          },

          {
            step: '03',
            title: 'Development',
            description: 'Building the solution'
          },

          {
            step: '04',
            title: 'Launch',
            description: 'Deploy & support'
          }
        ]
      }
    },

    {
      id: 53,
      website_id: websiteId,
      page_id: servicesPage.id,
      section_type: 'cta',
      title: 'Services CTA',
      order_position: 4,

      content: {

        title:
          'Ready to Get Started?',

        subtitle:
          'Let us help your business grow',

        button_text:
          'Contact Us Today'
      }
    }
  ]);

  // =========================
  // CONTACT PAGE SECTIONS
  // =========================

  await Section.insertMany([

    {
      id: 70,
      website_id: websiteId,
      page_id: contactPage.id,
      section_type: 'hero',
      title: 'Contact Hero',
      order_position: 1,

      content: {

        headline:
          'Contact Us',

        subheadline:
          "Have questions? We'd love to hear from you"
      }
    },

    {
      id: 71,
      website_id: websiteId,
      page_id: contactPage.id,
      section_type: 'contact',
      title: 'Contact Information',
      order_position: 2,

      content: {

        address:
          '123 Business Street, Tech City',

        phone:
          '+1 (555) 123-4567',

        email:
          'info@example.com',

        hours:
          'Monday - Friday: 9AM - 6PM',

        mapEmbed:
          'https://www.google.com/maps/embed?...'
      }
    },

    {
      id: 72,
      website_id: websiteId,
      page_id: contactPage.id,
      section_type: 'form',
      title: 'Contact Form',
      order_position: 3,

      content: {

        title:
          'Send us a Message',

        button_text:
          'Send Message'
      }
    }
  ]);

  // =========================
  // DEFAULT SETTINGS
  // =========================

  await Setting.create({

    id: 1,

    website_id:
      websiteId,

    setting_key:
      'company',

    setting_value: {

      name:
         websiteName,

      tagline:
        'Your Success Partner',

      email:
        'info@example.com',

      phone:
        '+1 555 123456',

      address:
        'Business Address',

      website:
        'www.example.com',

      logo: null,

      socialMedia: {

        facebook: '',

        twitter: '',

        linkedin: '',

        instagram: ''
      }
    }
  });
};