import { useState, useEffect } from 'react';
import { Award, Users, Clock, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { companyService, CompanyInfo } from '../services/businessService';

const AboutSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      setLoading(true);
      try {
        const data = await companyService.get();
        setCompanyInfo(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching company info:', err);
        setError('Failed to load company information. Displaying default content.');
        setCompanyInfo({
          id: '1',
          name: "Al Fatah Enterprise",
          description: "Al Fatah Enterprise is a leading business conglomerate with over 25 years of experience in providing innovative solutions across multiple industries. We specialize in distribution, supply chain management, and business consulting services.",
          mission: "To be the preferred partner for businesses seeking reliable, innovative, and sustainable solutions that drive growth and operational excellence.",
          vision: "To create lasting value for our stakeholders through excellence, innovation, and ethical business practices.",
          founded: "1998-01-01T00:00:00.000Z", // Corrected to string, assuming ISO date string
          address: "Dubai Industrial Area",
          city: "Dubai",
          state: "Dubai",
          zipCode: "00000",
          country: "United Arab Emirates",
          phone: "+971-4-000-0000",
          email: "info@alfatahenterprise.com",
          logoUrl: "/placeholder-logo.png",
          bannerUrl: "/placeholder-banner.jpg",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyInfo();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">About Al Fatah Enterprise</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 ml-4 text-gray-600">Loading company information...</p>
          </div>
        </div>
      </section>
    );
  }

  // Render error message if companyInfo is null and not loading (implies error)
  // Or if error state is explicitly set
  if (error || !companyInfo) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">About Al Fatah Enterprise</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
          </div>
          <div className="text-center text-red-600 bg-red-100 p-4 rounded-md">
            <p>{error || 'Could not load company information. Please try again later.'}</p>
            {/* Display fallback content if companyInfo is available from fallback */} 
            {companyInfo && companyInfo.name === "Al Fatah Enterprise" && (
                 <p className="text-gray-600 max-w-3xl mx-auto text-lg mt-4">
                    {companyInfo.description}
                 </p>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white" ref={ref}>
      <motion.div 
        className="container mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">About {companyInfo?.name || 'Al Fatah Enterprise'}</h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            {companyInfo.description || "Since our establishment, we have been committed to providing high-quality products and exceptional service to our customers worldwide."}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div className="relative" variants={itemVariants}>
            <div className="relative z-10 rounded-lg overflow-hidden shadow-2xl">
              <img 
                src={companyInfo.bannerUrl || "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"} 
                alt={`About ${companyInfo.name}`} 
                className="w-full h-auto transform hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 md:w-48 md:h-48 bg-blue-600/90 rounded-lg z-0"></div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-semibold text-blue-900 mb-6">Our Story {companyInfo.founded ? `(Founded: ${new Date(companyInfo.founded).getFullYear()})` : ''}</h3>
            <p className="text-gray-600 mb-6 text-lg leading-relaxed">
              {companyInfo.name} was founded with a vision to become a leading supplier of high-quality industrial products and services. With decades of experience and a commitment to excellence, we have established ourselves as a trusted partner for businesses across various industries.
            </p>
            <p className="text-gray-600 mb-4 text-lg leading-relaxed">
              <strong>Mission:</strong> {companyInfo.mission || "Our mission is to provide innovative solutions that help our clients optimize their operations, reduce costs, and achieve sustainable growth. We believe in building long-term relationships based on trust, reliability, and mutual success."}
            </p>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              <strong>Vision:</strong> {companyInfo.vision || "Our vision is to create lasting value for our stakeholders through excellence, innovation, and ethical business practices."}
            </p>

            <div className="grid grid-cols-2 gap-8">
              <motion.div 
                className="flex items-center group"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4 group-hover:bg-blue-200 transition-colors duration-300">
                  <Award className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900">Quality</h4>
                  <p className="text-sm text-gray-600">Premium Products</p>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-center group"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4 group-hover:bg-blue-200 transition-colors duration-300">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900">Expert Team</h4>
                  <p className="text-sm text-gray-600">Skilled Professionals</p>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-center group"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4 group-hover:bg-blue-200 transition-colors duration-300">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900">Timely Delivery</h4>
                  <p className="text-sm text-gray-600">On-time Shipping</p>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-center group"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4 group-hover:bg-blue-200 transition-colors duration-300">
                  <Globe className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900">Global Reach</h4>
                  <p className="text-sm text-gray-600">Worldwide Service</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default AboutSection;