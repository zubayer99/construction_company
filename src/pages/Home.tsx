import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import ProductsSection from '../components/ProductsSection';
import ServicesSection from '../components/ServicesSection-new';
import TestimonialsSection from '../components/TestimonialsSection';
import NewsSection from '../components/NewsSection';
import ContactSection from '../components/ContactSection';
import NewsletterSection from '../components/NewsletterSection';
import ClientsSection from '../components/ClientsSection';
import Stats from '../components/Stats';
import CtaSection from '../components/CtaSection';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';

const Home = () => {
  return (
    <div>
      <Navbar />
      <div id="home">
        <HeroSection />
      </div>
      <div id="about">
        <AboutSection />
        <Stats />
      </div>
      <div id="products">
        <ProductsSection />
      </div>
      <div id="services">
        <ServicesSection />
        <TestimonialsSection />
        <ClientsSection />
      </div>
      <div id="news">
        <NewsSection />
      </div>
      <CtaSection />
      <div id="contact">
        <ContactSection />
      </div>
      <NewsletterSection />
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Home;