import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin, ArrowRight, Clock, Award, Shield, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
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
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };
  
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      <div className="container mx-auto px-4">
        {/* Footer Main Content */}
        <motion.div 
          className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {/* Company Info */}
          <motion.div variants={itemVariants}>
            <div className="mb-6">
              <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
                Al Fatah Enterprise
              </h3>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-blue-600 mb-4"></div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Established in 1998, Al Fatah Enterprise is a leading supplier of high-quality industrial products and services across the UAE and the region, committed to excellence and customer satisfaction.
            </p>
            
            {/* Key Features */}
            <div className="mb-6 space-y-3">
              <div className="flex items-center text-sm text-gray-300">
                <Award className="w-4 h-4 mr-2 text-blue-400" />
                ISO 9001:2015 Certified
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <Shield className="w-4 h-4 mr-2 text-blue-400" />
                Trusted by 500+ Companies
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <Globe className="w-4 h-4 mr-2 text-blue-400" />
                25+ Years of Excellence
              </div>
            </div>

            {/* Social Media */}
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-blue-800 hover:bg-blue-600 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-blue-800 hover:bg-blue-600 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-blue-800 hover:bg-blue-600 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-blue-800 hover:bg-blue-600 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </motion.div>
          
          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-semibold mb-6 text-blue-300">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: 'Home', path: '/' },
                { name: 'About Us', path: '/about' },
                { name: 'Products & Solutions', path: '/products' },
                { name: 'Services', path: '/services' },
                { name: 'Projects', path: '/projects' },
                { name: 'News & Updates', path: '/news' },
                { name: 'Careers', path: '/careers' },
                { name: 'Contact Us', path: '/contact' },
              ].map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.path} 
                    className="text-gray-300 hover:text-blue-300 transition-all duration-300 flex items-center group"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 transform transition-transform group-hover:translate-x-1" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Products & Services */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-semibold mb-6 text-blue-300">Products & Services</h3>
            <ul className="space-y-3">
              {[
                'Industrial Equipment',
                'Construction Materials',
                'Safety & PPE Solutions',
                'Electrical & Electronics',
                'HVAC Systems',
                'Oil & Gas Equipment',
                'Technical Consulting',
                'After-Sales Support'
              ].map((service, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="text-gray-300 hover:text-blue-300 transition-all duration-300 flex items-center group"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 transform transition-transform group-hover:translate-x-1" />
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-semibold mb-6 text-blue-300">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 mt-1 text-blue-400 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 leading-relaxed">
                    Al Fatah Enterprise<br />
                    Dubai Industrial Area<br />
                    Dubai, United Arab Emirates
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-blue-400" />
                <div>
                  <p className="text-gray-300">+971 4 XXX XXXX</p>
                  <p className="text-gray-300">+971 50 XXX XXXX</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-blue-400" />
                <div>
                  <p className="text-gray-300">info@alfatahenterprise.com</p>
                  <p className="text-gray-300">sales@alfatahenterprise.com</p>
                </div>
              </div>

              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-3 text-blue-400" />
                <div>
                  <p className="text-gray-300">Mon - Fri: 8:00 AM - 6:00 PM</p>
                  <p className="text-gray-300">Sat: 8:00 AM - 2:00 PM</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-6">
              <a 
                href="/contact" 
                className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                Get Quote Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* Footer Bottom */}
        <motion.div 
          className="border-t border-gray-700 py-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-400 text-sm">
                © {currentYear} Al Fatah Enterprise. All rights reserved.
              </p>
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              <a href="/privacy" className="text-gray-400 hover:text-blue-300 transition duration-300">
                Privacy Policy
              </a>
              <a href="/terms" className="text-gray-400 hover:text-blue-300 transition duration-300">
                Terms of Service
              </a>
              <a href="/sitemap" className="text-gray-400 hover:text-blue-300 transition duration-300">
                Sitemap
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;