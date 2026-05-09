import React from 'react';
import { useParams } from 'react-router-dom';

import WebsiteNavbar from '../components/WebsiteNavbar';
import Footer from '../components/WebsiteFooter';

import DynamicHomePage from './DynamicHomePage';
import AboutPage from './AboutPage';
import ContactPage from './ContactPage';
import ServicesPage from './ServicePage';

const WebsiteView = () => {

  const { slug = 'home' } = useParams();

  // Render correct page
  const renderPage = () => {

    switch (slug) {

      // case 'home':
      //   return <DynamicHomePage />;

      case 'about':
        return <AboutPage />;

      case 'contact':
        return <ContactPage />;

      case 'services':
        return <ServicesPage />;

      default:

        return (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">

              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                404
              </h1>

              <p className="text-gray-600 text-lg">
                Page Not Found
              </p>

            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">

      <WebsiteNavbar />

      <main className="flex-grow">
        {renderPage()}
      </main>

      <Footer />

    </div>
  );
};

export default WebsiteView;