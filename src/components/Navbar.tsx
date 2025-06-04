import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const companyName = "Al Fatah Enterprise";

  const navLinks = [
    { name: 'Home', path: '#home' },
    { 
      name: 'About Us', 
      path: '#about',
      dropdown: [
        { name: 'Company Profile', path: '#about' },
        { name: 'Our Story & Heritage', path: '#about' },
        { name: 'Leadership Team', path: '#team' },
        { name: 'Vision & Mission', path: '#about' },
        { name: 'Quality Certifications', path: '#about' },
      ]
    },
    { 
      name: 'Products & Solutions', 
      path: '#products',
      dropdown: [
        { name: 'Industrial Machinery', path: '#products' },
        { name: 'Construction Equipment', path: '#products' },
        { name: 'Safety & PPE Solutions', path: '#products' },
        { name: 'Electrical & Electronics', path: '#products' },
        { name: 'HVAC & Climate Control', path: '#products' },
        { name: 'Oil & Gas Equipment', path: '#products' },
      ]
    },
    { 
      name: 'Services', 
      path: '#services',
      dropdown: [
        { name: 'Equipment Supply', path: '#services' },
        { name: 'Project Management', path: '#services' },
        { name: 'Technical Consulting', path: '#services' },
        { name: 'Installation Services', path: '#services' },
        { name: 'Maintenance & Support', path: '#services' },
      ]
    },
    { name: 'News & Updates', path: '#news' },
    { name: 'Contact Us', path: '#contact' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDropdownEnter = (name: string) => {
    setActiveDropdown(name);
  };

  const handleDropdownLeave = () => {
    setActiveDropdown(null);
  };

  const scrollToSection = (path: string) => {
    const element = document.querySelector(path);
    if (element) {
      const navHeight = 80; // Approximate navbar height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
    setIsOpen(false); // Close mobile menu after clicking
  };

  return (
    <motion.header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-sm shadow-lg py-2' 
          : 'bg-transparent py-4'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <div className="container mx-auto px-4">
        <nav className="flex justify-between items-center">
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isScrolled ? 'bg-blue-900' : 'bg-white/20 backdrop-blur-sm'}`}>
              <span className={`text-xl font-bold ${isScrolled ? 'text-white' : 'text-white'}`}>A</span>
            </div>
            <button 
              onClick={() => scrollToSection('#home')} 
              className={`text-xl font-bold ${isScrolled ? 'text-blue-900' : 'text-white'} transition-colors duration-300`}
            >
              <span className="hidden sm:inline">{companyName}</span>
              <span className="sm:hidden">Al Fatah</span>
            </button>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, index) => (
              <div 
                key={index} 
                className="relative group"
                onMouseEnter={() => handleDropdownEnter(link.name)}
                onMouseLeave={handleDropdownLeave}
              >
                <button 
                  onClick={() => scrollToSection(link.path)}
                  className={`font-medium flex items-center transition-colors duration-300 ${
                    isScrolled ? 'text-gray-800 hover:text-blue-600' : 'text-white hover:text-blue-200'
                  }`}
                >
                  {link.name}
                  {link.dropdown && (
                    <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-300 ${
                      activeDropdown === link.name ? 'rotate-180' : ''
                    }`} />
                  )}
                </button>
                
                {link.dropdown && (
                  <AnimatePresence>
                    {activeDropdown === link.name && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 mt-2 w-48 bg-white shadow-xl rounded-md overflow-hidden z-50"
                      >
                        {link.dropdown.map((item, idx) => (
                          <button 
                            key={idx} 
                            onClick={() => scrollToSection(item.path)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-300"
                          >
                            {item.name}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </div>

          <div className="hidden lg:flex items-center space-x-6">
            <motion.a
              href="tel:+97148856789"
              className={`flex items-center text-sm ${isScrolled ? 'text-gray-600' : 'text-blue-100'} hover:text-blue-600 transition-colors duration-300`}
              whileHover={{ scale: 1.05 }}
            >
              <Phone className="h-4 w-4 mr-2" />
              <span className="hidden xl:inline">+971 4 885 6789</span>
            </motion.a>
            <motion.button 
              onClick={() => scrollToSection('#contact')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Free Quote
            </motion.button>
          </div>

          {/* Mobile menu button */}
          <motion.button 
            className={`md:hidden ${isScrolled ? 'text-gray-800' : 'text-white'}`}
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </motion.button>
        </nav>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="md:hidden bg-white shadow-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link, index) => (
                <div key={index}>
                  <button 
                    onClick={() => scrollToSection(link.path)}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-300"
                  >
                    {link.name}
                  </button>
                  {link.dropdown && (
                    <div className="pl-6 space-y-2 mt-2">
                      {link.dropdown.map((item, idx) => (
                        <button 
                          key={idx} 
                          onClick={() => scrollToSection(item.path)}
                          className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-300"
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="flex items-center justify-center pt-6 border-t border-gray-200 mt-6">
                <motion.button 
                  onClick={() => scrollToSection('#contact')}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get Free Quote
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;