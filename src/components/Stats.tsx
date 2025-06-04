import React from 'react';
import { Award, Users, Globe, Package, Clock, Shield, TrendingUp, Building } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface Stat {
  id: number;
  value: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const Stats = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

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
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const stats: Stat[] = [
    {
      id: 1,
      value: "25+",
      label: "Years of Excellence",
      description: "Established in 1999",
      icon: <Award className="h-10 w-10 text-yellow-500" />
    },
    {
      id: 2,
      value: "500+",
      label: "Satisfied Clients",
      description: "Across UAE & GCC",
      icon: <Users className="h-10 w-10 text-blue-500" />
    },
    {
      id: 3,
      value: "15+",
      label: "Countries Served",
      description: "Global supply network",
      icon: <Globe className="h-10 w-10 text-green-500" />
    },
    {
      id: 4,
      value: "10,000+",
      label: "Products Delivered",
      description: "Industrial equipment",
      icon: <Package className="h-10 w-10 text-purple-500" />
    },
    {
      id: 5,
      value: "24/7",
      label: "Customer Support",
      description: "Round-the-clock service",
      icon: <Clock className="h-10 w-10 text-red-500" />
    },
    {
      id: 6,
      value: "ISO 9001",
      label: "Quality Certified",
      description: "International standards",
      icon: <Shield className="h-10 w-10 text-indigo-500" />
    },
    {
      id: 7,
      value: "99%",
      label: "Client Satisfaction",
      description: "Proven track record",
      icon: <TrendingUp className="h-10 w-10 text-emerald-500" />
    },
    {
      id: 8,
      value: "5,000+",
      label: "Projects Completed",
      description: "Successful installations",
      icon: <Building className="h-10 w-10 text-orange-500" />
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white relative overflow-hidden" ref={ref}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxIiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')]"></div>
      </div>

      <motion.div 
        className="container mx-auto px-4 relative"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <motion.div 
          className="text-center mb-20"
          variants={itemVariants}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">Achievement</span> in Numbers
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 mx-auto mb-8"></div>
          <p className="text-blue-100 max-w-4xl mx-auto text-lg leading-relaxed">
            These numbers represent more than statistics – they reflect our unwavering commitment to excellence, 
            quality, and customer satisfaction in the industrial equipment supply sector.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div 
              key={stat.id}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                transition: { type: "spring", stiffness: 300 }
              }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-white/15 transition-all duration-500 relative overflow-hidden group border border-white/20"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-500 border border-white/30">
                    {stat.icon}
                  </div>
                </div>
                <motion.h3 
                  className="text-4xl md:text-5xl font-bold mb-2 text-white"
                  initial={{ scale: 0 }}
                  animate={inView ? { scale: 1 } : { scale: 0 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 100,
                    delay: 0.3 + (index * 0.1)
                  }}
                >
                  {stat.value}
                </motion.h3>
                <p className="text-blue-100 font-semibold text-lg mb-2">{stat.label}</p>
                <p className="text-blue-200 text-sm opacity-80">{stat.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="mt-20 text-center"
          variants={itemVariants}
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-4">Why Choose Al Fatah Enterprise?</h3>
            <p className="text-blue-100 text-lg max-w-3xl mx-auto">
              With a quarter-century of experience and an unwavering commitment to quality, we have established 
              ourselves as the premier industrial equipment supplier in the UAE. Our success is measured not 
              just in numbers, but in the lasting relationships we build with every client.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Stats;