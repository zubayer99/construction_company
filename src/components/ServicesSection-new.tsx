import React, { useState, useEffect } from 'react';
import { Truck, Package, Settings, BarChart, Award, Globe, CheckCircle, Briefcase, Zap, ShieldCheck, ArrowRight } from 'lucide-react'; // Added Briefcase, Zap, ShieldCheck, ArrowRight
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { servicesService, Service } from '../services/businessService';

const ServicesSection = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await servicesService.getPublic();
        setServices(data);
      } catch (err) {
        setError('Failed to load services. Displaying sample data.');
        console.error('Error fetching services:', err);
        // Fallback to static data if API fails, ensuring it matches the new Service interface
        setServices([
          {
            id: '1',
            title: 'Industrial Equipment Supply',
            description: 'Comprehensive supply of heavy machinery, power tools, and specialized industrial equipment tailored to your project needs.',
            shortDesc: 'Heavy machinery and power tools.',
            iconName: 'truck', // Was icon
            features: ['Wide Product Range', 'Competitive Pricing', 'Reliable Delivery'],
            isActive: true,
            sortOrder: 1
          },
          {
            id: '2',
            title: 'Project Logistics & Management',
            description: 'End-to-end logistics solutions, including planning, execution, and management of material and equipment transportation for large-scale projects.',
            shortDesc: 'Full-cycle project logistics.',
            iconName: 'package',
            features: ['Global Freight Forwarding', 'Customs Clearance', 'Warehouse Solutions'],
            isActive: true,
            sortOrder: 2
          },
          {
            id: '3',
            title: 'Technical Consulting & Support',
            description: 'Expert advice on equipment selection, process optimization, and on-site technical support to ensure maximum operational efficiency.',
            shortDesc: 'Expert advice and on-site support.',
            iconName: 'settings',
            features: ['Feasibility Studies', 'Equipment Audits', 'Maintenance Planning'],
            isActive: true,
            sortOrder: 3
          },
          {
            id: '4',
            title: 'Safety & Compliance Solutions',
            description: 'Providing a full range of safety equipment (PPE) and consulting services to meet stringent industry safety standards and regulations.',
            shortDesc: 'PPE and safety compliance.',
            iconName: 'shield-check', // Changed icon
            features: ['Safety Audits', 'PPE Supply', 'Training Programs'],
            isActive: true,
            sortOrder: 4
          },
          {
            id: '5',
            title: 'Automation & Control Systems',
            description: 'Design and implementation of industrial automation systems to enhance productivity and reduce operational costs.',
            shortDesc: 'Industrial automation solutions.',
            iconName: 'zap', // Changed icon
            features: ['PLC Programming', 'SCADA Systems', 'Robotics Integration'],
            isActive: true,
            sortOrder: 5
          },
          {
            id: '6',
            title: 'Global Sourcing & Procurement',
            description: 'Leveraging our global network to source and procure high-quality industrial products at competitive prices.',
            shortDesc: 'Worldwide product sourcing.',
            iconName: 'globe',
            features: ['Supplier Vetting', 'Quality Control', 'Strategic Sourcing'],
            isActive: true,
            sortOrder: 6
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const getServiceIcon = (iconName: string | undefined, title: string) => {
    const iconClass = "h-12 w-12 text-blue-600";
    
    // Prioritize iconName from data
    if (iconName) {
      switch (iconName.toLowerCase()) {
        case 'truck': return <Truck className={iconClass} />;
        case 'package': return <Package className={iconClass} />;
        case 'settings': return <Settings className={iconClass} />;
        case 'barchart': // Keep old 'chart' mapping if needed, or use barchart
        case 'chart': 
          return <BarChart className={iconClass} />;
        case 'award': return <Award className={iconClass} />;
        case 'globe': return <Globe className={iconClass} />;
        case 'briefcase': return <Briefcase className={iconClass} />;
        case 'zap': return <Zap className={iconClass} />;
        case 'shieldcheck':
        case 'shield-check': // Allow for variations
          return <ShieldCheck className={iconClass} />;
        default: 
          console.warn(`Unknown iconName: ${iconName}, falling back for title: ${title}`);
          // Fall through to title-based matching if specific iconName not found
      }
    }

    // Fallback based on title keywords if iconName is missing or not matched
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('distribution') || lowerTitle.includes('supply') || lowerTitle.includes('equipment')) return <Truck className={iconClass} />;
    if (lowerTitle.includes('logistics') || lowerTitle.includes('packaging')) return <Package className={iconClass} />;
    if (lowerTitle.includes('technical') || lowerTitle.includes('consulting') || lowerTitle.includes('maintenance') || lowerTitle.includes('support')) return <Settings className={iconClass} />;
    if (lowerTitle.includes('sales') || lowerTitle.includes('business')) return <BarChart className={iconClass} />;
    if (lowerTitle.includes('quality') || lowerTitle.includes('assurance')) return <Award className={iconClass} />;
    if (lowerTitle.includes('global') || lowerTitle.includes('sourcing')) return <Globe className={iconClass} />;
    if (lowerTitle.includes('automation') || lowerTitle.includes('control')) return <Zap className={iconClass} />;
    if (lowerTitle.includes('safety') || lowerTitle.includes('compliance')) return <ShieldCheck className={iconClass} />;
    
    return <Briefcase className={iconClass} />; // Default fallback icon
  };

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

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading services...</p>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-20 bg-gray-50" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          variants={itemVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
            Our Core Services
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Delivering Excellence in Industrial Solutions
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Al Fatah Enterprise offers a diverse range of specialized services, from equipment supply and logistics to technical consulting and safety compliance, ensuring your operational success.
          </p>
        </motion.div>

        {error && (
          <div className="text-center mb-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {services.map((service) => (
            <motion.div
              key={service.id || service.title} // Use title as fallback key if id is missing
              variants={itemVariants}
              className="group h-full" // Ensure motion.div takes full height for consistent card sizing
            >
              <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 h-full flex flex-col border border-gray-100 hover:border-blue-200 group-hover:-translate-y-2">
                <div className="flex items-center justify-center w-20 h-20 bg-blue-50 rounded-xl mb-6 group-hover:bg-blue-100 transition-colors duration-300 flex-shrink-0">
                  {getServiceIcon(service.iconName, service.title)} {/* Use iconName */}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  {service.title}
                </h3>
                
                <p className="text-gray-500 text-sm mb-4">
                  {service.shortDesc || service.description.substring(0, 100) + '...'} {/* Display shortDesc or truncated description */}
                </p>

                {service.features && service.features.length > 0 && (
                  <ul className="space-y-2 mb-6 text-sm text-gray-600 flex-grow">
                    {service.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}
                
                <a href={`/services/${service.id}`} className="mt-auto inline-flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors duration-300 self-start">
                  Learn More
                  <ArrowRight className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="text-center mt-16"
          variants={itemVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <div className="bg-blue-600 text-white rounded-xl p-8 max-w-4xl mx-auto shadow-xl">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Optimize Your Operations?
            </h3>
            <p className="text-blue-100 mb-6 text-lg">
              Discover how Al Fatah Enterprise can tailor solutions to meet your specific industrial needs. 
              Contact us for a consultation or quote.
            </p>
            <a href="/contact" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300 shadow-lg hover:scale-105 inline-block">
              Request a Quote
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
