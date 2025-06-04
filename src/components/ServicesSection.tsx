import { useState, useEffect } from 'react';
import { Truck, Package, Settings, BarChart } from 'lucide-react';
import { servicesService, Service } from '../services/businessService';

const ServicesSection = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await servicesService.getPublic();
        setServices(data);
      } catch (err) {
        console.error('Error fetching services:', err);
        // Fallback to static data if API fails
        setServices([
          {
            id: '1',
            title: 'Industrial Distribution',
            description: 'Comprehensive distribution network for industrial equipment, components, and materials across multiple sectors including manufacturing, construction, and energy.',
            icon: 'truck',
            isActive: true
          },
          {
            id: '2',
            title: 'Supply Chain Management',
            description: 'End-to-end supply chain solutions including procurement, inventory management, logistics, and vendor management services.',
            icon: 'package',
            isActive: true
          },
          {
            id: '3',
            title: 'Technical Consulting',
            description: 'Expert technical consulting services for equipment selection, system optimization, and operational efficiency improvements.',
            icon: 'settings',
            isActive: true
          },
          {
            id: '4',
            title: 'After-Sales Support',
            description: 'Comprehensive after-sales support including maintenance, repair services, spare parts supply, and technical training programs.',
            icon: 'chart',
            isActive: true
          },
          {
            id: '5',
            title: 'Quality Assurance',
            description: 'Rigorous quality control processes ensuring all products meet international standards and customer specifications.',
            icon: 'award',
            isActive: true
          },
          {
            id: '6',
            title: 'Global Logistics',
            description: 'Worldwide shipping and logistics services with real-time tracking and customs clearance support.',
            icon: 'globe',
            isActive: true
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const getServiceIcon = (title: string) => {
    switch (title.toLowerCase()) {
      case 'distribution & supply':
        return <Truck className="h-10 w-10 text-blue-600" />;
      case 'product packaging':
        return <Package className="h-10 w-10 text-blue-600" />;
      case 'equipment maintenance':
        return <Settings className="h-10 w-10 text-blue-600" />;
      case 'business consulting':
        return <BarChart className="h-10 w-10 text-blue-600" />;
      default:
        return <Package className="h-10 w-10 text-blue-600" />;
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
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
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Our Services</h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-3xl mx-auto">
            We offer a comprehensive range of services designed to meet the diverse needs of our clients and help them achieve their business goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <div 
              key={service.id}
              className="bg-gray-50 rounded-lg p-8 text-center hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                  {getServiceIcon(service.title)}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-blue-900 mb-3">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-blue-600 rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-10 md:p-16">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Need Custom Solutions?</h3>
              <p className="text-blue-100 mb-8">
                We specialize in developing customized solutions tailored to meet your specific business requirements.
              </p>
              <ul className="space-y-3 mb-8">
                {['Customized product development', 'Specialized industrial services', 'Project management', 'Technical consultancy'].map((item, index) => (
                  <li key={index} className="flex items-center text-blue-100">
                    <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                    {item}
                  </li>
                ))}
              </ul>
              <a 
                href="/contact" 
                className="inline-block bg-white text-blue-600 px-8 py-3 rounded-md font-medium hover:bg-blue-50 transition duration-300"
              >
                Contact Us
              </a>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Custom Solutions" 
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;