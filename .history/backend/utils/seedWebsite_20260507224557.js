const Page =
require('../models/Page');

const Section =
require('../models/Section');

const Setting =
require('../models/Setting');

module.exports =
async (websiteId) => {

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
  // DEFAULT SETTINGS
  // =========================

  await Setting.create({

    website_id:
      websiteId,

    setting_key:
      'company',

    setting_value: {

      name:
        'My Company',

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