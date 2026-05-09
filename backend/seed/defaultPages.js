module.exports = [

  {
    name: 'Home',
    slug: 'home',
    sections: [

      {
        section_type: 'hero',
        title: 'Hero Section',
        content: {
          headline: 'Build Amazing Websites',
          subheadline: 'Create dynamic pages with our powerful page builder',
          cta_text: 'Get Started',
          secondary_cta_text: 'Watch Demo',
          trust_badges: [
            'Professional',
            'Trusted',
            'Secure'
          ]
        }
      },

      {
        section_type: 'features',
        title: 'Features',
        content: {
          title: 'Why Choose Us?',
          subtitle: 'What makes us different',
          items: [
            {
              icon: 'Users',
              title: 'Expert Trainers',
              description: 'Learn from experts'
            }
          ]
        }
      },

      {
        section_type: 'stats',
        title: 'Stats',
        content: {
          title: 'Our Impact',
          items: [
            {
              value: 15000,
              label: 'Students',
              suffix: '+'
            }
          ]
        }
      }

    ]
  },

  {
    name: 'About',
    slug: 'about',
    sections: [

      {
        section_type: 'about',
        title: 'About Us',
        content: {
          heading: 'About Our Company',
          description:
            'We build amazing websites.'
        }
      }

    ]
  },

  {
    name: 'Services',
    slug: 'services',
    sections: [

      {
        section_type: 'services',
        title: 'Our Services',
        content: {
          title: 'What We Offer',
          items: [
            'Web Development',
            'Mobile Apps',
            'SEO'
          ]
        }
      }

    ]
  },

  {
    name: 'Contact',
    slug: 'contact',
    sections: [

      {
        section_type: 'contact',
        title: 'Contact Us',
        content: {
          email: 'info@example.com',
          phone: '+91 9999999999'
        }
      }

    ]
  }

];