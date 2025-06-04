import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface Client {
  id: number;
  name: string;
  logo: string;
}

const ClientsSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

  const clients: Client[] = [
    {
      id: 1,
      name: "ADNOC",
      logo: "https://images.unsplash.com/photo-1558618978-e90b46cdc4bb?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: 2,
      name: "Emirates Steel",
      logo: "https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: 3,
      name: "Al Ghurair",
      logo: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: 4,
      name: "Dubai Municipality",
      logo: "https://images.unsplash.com/photo-1554223090-74ca43d7c613?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: 5,
      name: "Petrofac",
      logo: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: 6,
      name: "Emaar Properties",
      logo: "https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: 7,
      name: "Aramco",
      logo: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: 8,
      name: "Al Naboodah",
      logo: "https://images.unsplash.com/photo-1503387837-b154d5074bd2?auto=format&fit=crop&w=200&q=80"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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
    <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50" ref={ref}>
      <motion.div 
        className="container mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <motion.div 
          className="text-center mb-20"
          variants={itemVariants}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">
            Trusted by <span className="text-blue-600">Industry Leaders</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-800 mx-auto mb-8"></div>
          <p className="text-gray-600 max-w-4xl mx-auto text-lg leading-relaxed">
            For over 25 years, Al Fatah Enterprise has been the preferred partner for major corporations, 
            government entities, and industrial giants across the UAE and GCC region. Our commitment to quality 
            and reliability has earned the trust of industry leaders.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8 mb-16"
          variants={containerVariants}
        >
          {clients.map((client, index) => (
            <motion.div 
              key={client.id}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 flex items-center justify-center min-h-[120px] border border-gray-100 hover:border-blue-200"
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                transition: { type: "spring", stiffness: 300 }
              }}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative w-full h-16 flex items-center justify-center">
                <img 
                  src={client.logo} 
                  alt={`${client.name} - Al Fatah Enterprise Client`}
                  className="max-h-12 w-auto object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-blue-600/0 group-hover:from-blue-600/5 group-hover:to-blue-600/10 transition-all duration-500 rounded-lg"></div>
              </div>
              
              {/* Hover overlay with client name */}
              <div className="absolute inset-0 bg-blue-900/95 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                <h3 className="text-white font-bold text-center">{client.name}</h3>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="text-center bg-white rounded-2xl shadow-lg p-10"
          variants={itemVariants}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <p className="text-gray-600 font-medium">Satisfied Clients</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">25+</div>
              <p className="text-gray-600 font-medium">Years of Excellence</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">99%</div>
              <p className="text-gray-600 font-medium">Client Satisfaction</p>
            </div>
          </div>
          
          <p className="text-gray-600 text-lg mb-6">
            Join our growing family of satisfied clients and experience the Al Fatah Enterprise difference.
          </p>
          <motion.a
            href="#contact"
            className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Become Our Next Success Story
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ClientsSection;