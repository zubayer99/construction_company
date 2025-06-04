import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { projectsService, Project } from '../services/businessService';

const ProductsSection = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Added error state
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true); // Ensure loading is true at the start
      setError(null); // Clear previous errors
      try {
        const data = await projectsService.getPublic();
        setProjects(data.slice(0, 6)); // Show first 6 projects
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects. Displaying sample data.'); // Set error message
        // Fallback to professional product categories, ensuring it matches the new Project interface
        setProjects([
          {
            id: '1',
            title: 'Advanced Manufacturing Hub Automation',
            description: 'Full-scale automation of a major manufacturing hub, incorporating robotics, AI-driven quality control, and IoT-enabled predictive maintenance. Resulted in a 40% increase in production efficiency.',
            shortDesc: 'Robotics & AI for manufacturing.', // Added
            // images: ['https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80'], // Replaced by imageUrl and gallery
            imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80', // Added
            gallery: ['https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1560264280-88b68371db39?auto=format&fit=crop&w=800&q=80'], // Added
            status: 'COMPLETED',
            isFeatured: true,
            client: 'Global Manufacturing Inc.', // Added
            technologies: ['Robotics', 'AI', 'IoT', 'PLC'], // Added
            projectUrl: '/projects/manufacturing-hub-automation', // Added
            isActive: true, // Added
            sortOrder: 1 // Added
          },
          {
            id: '2',
            title: 'City-Wide Smart Grid Implementation',
            description: 'Development and deployment of a smart grid infrastructure for a major metropolitan area, enhancing energy distribution reliability and enabling renewable energy integration.',
            shortDesc: 'Smart grid for urban energy.', // Added
            imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80', // Added
            gallery: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80'], // Added
            status: 'IN_PROGRESS', // Changed
            isFeatured: true,
            client: 'Metro Energy Authority', // Added
            technologies: ['Smart Grid Tech', 'SCADA', 'Renewable Energy Systems'], // Added
            isActive: true, // Added
            sortOrder: 2 // Added
          },
          {
            id: '3',
            title: 'National PPE Supply Chain Optimization',
            description: 'Streamlining the national supply chain for Personal Protective Equipment (PPE) during a health crisis, ensuring timely delivery to frontline workers.',
            shortDesc: 'PPE supply chain logistics.', // Added
            imageUrl: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=800&q=80', // Added
            status: 'COMPLETED',
            isFeatured: true,
            client: 'National Health Service', // Added
            technologies: ['Logistics Software', 'Supply Chain Management', 'Data Analytics'], // Added
            isActive: true, // Added
            sortOrder: 3 // Added
          },
          {
            id: '4',
            title: 'Offshore Oil Rig Safety Systems Upgrade',
            description: 'Comprehensive upgrade of safety and emergency shutdown systems for a major offshore oil platform, meeting the latest international safety standards.',
            shortDesc: 'Offshore rig safety enhancement.', // Added
            imageUrl: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=800&q=80', // Changed image to match oil & gas
            status: 'COMPLETED',
            isFeatured: false, // Changed
            client: 'Oceanic Petroleum Corp.', // Added
            technologies: ['Industrial Safety Systems', 'SIL Compliance', 'Emergency Response Tech'], // Added
            isActive: true, // Added
            sortOrder: 4 // Added
          },
          {
            id: '5',
            title: 'Sustainable HVAC for Commercial Complex',
            description: 'Design and installation of a large-scale, energy-efficient HVAC system for a new commercial complex, reducing carbon footprint by 30%.',
            shortDesc: 'Eco-friendly commercial HVAC.', // Added
            imageUrl: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=800&q=80', // Added
            status: 'COMPLETED',
            isFeatured: true,
            client: 'GreenBuild Developments', // Added
            technologies: ['HVAC Design', 'Building Management Systems (BMS)', 'Geothermal Exchange'], // Added
            isActive: true, // Added
            sortOrder: 5 // Added
          },
          {
            id: '6',
            title: 'Automated Warehouse Logistics Solution',
            description: 'Implementation of an automated storage and retrieval system (AS/RS) for a major logistics provider, significantly increasing throughput and accuracy.',
            shortDesc: 'Automated warehouse systems.', // Added
            // imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=800&q=80', // Placeholder, better image needed
            imageUrl: 'https://images.unsplash.com/photo-1587293852726-70cdb1657168?auto=format&fit=crop&w=800&q=80', // More relevant image
            status: 'IN_PROGRESS', // Changed
            isFeatured: false, // Changed
            client: 'SwiftLogistics International', // Added
            technologies: ['AS/RS', 'WMS Integration', 'Robotics'], // Added
            isActive: true, // Added
            sortOrder: 6 // Added
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);
  
  // Since Project interface doesn't have category, we'll show all projects
  const filteredProjects = projects;

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
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Our Projects</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
          </div>
          <div className="flex justify-center items-center"> {/* Centered loading spinner and text */}
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="ml-4 text-gray-600">Loading projects...</p> {/* Added loading text */}
          </div>
        </div>
      </section>
    );
  }

  // Error display
  if (error) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Our Projects</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
          </div>
          <div className="text-center text-red-600 bg-red-100 p-4 rounded-md">
            <p>{error}</p>
             {/* Display fallback content if projects array has the sample data */}
            {projects.length > 0 && projects[0].client === "Global Manufacturing Inc." && (
                 <p className="text-gray-600 max-w-3xl mx-auto text-lg mt-4">
                    Displaying sample project data.
                 </p>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50" ref={ref}>
      <motion.div 
        className="container mx-auto px-4"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <motion.div 
          className="text-center mb-16"
          variants={itemVariants}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Our Projects</h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Discover our portfolio of successful projects designed to meet the diverse needs of our customers.
          </p>
        </motion.div>
        
        {/* Products Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
        >
          {filteredProjects.map(project => (
            <motion.div 
              key={project.id}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
              variants={itemVariants}
              whileHover={{ y: -10 }}
            >
              <div className="h-64 overflow-hidden">
                <img 
                  src={project.imageUrl || project.gallery?.[0] || 'https://images.pexels.com/photos/2881632/pexels-photo-2881632.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="p-8">
                <h3 className="text-xl font-semibold text-blue-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="text-gray-600 mb-2 text-sm">Client: {project.client || 'N/A'}</p> {/* Added Client */}
                <p className="text-gray-600 mb-1 text-sm">Status: <span className={`font-semibold ${project.status === 'COMPLETED' ? 'text-green-600' : project.status === 'IN_PROGRESS' ? 'text-yellow-600' : 'text-gray-500'}`}>{project.status}</span></p> {/* Added Status with basic styling */}
                <p className="text-gray-600 mb-6 line-clamp-2" title={project.description}>{project.shortDesc || project.description}</p> {/* Use shortDesc, fallback to description */}
                
                {project.technologies && project.technologies.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-gray-500 mb-1">Key Technologies:</h4>
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.slice(0, 3).map(tech => (
                        <span key={tech} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded-full">
                          +{project.technologies.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <motion.a 
                  href={project.projectUrl || `/projects/${project.id}`} 
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium group/link"
                  whileHover={{ x: 5 }}
                >
                  View Details 
                  <ArrowRight className="ml-2 h-4 w-4 transform transition-transform group-hover/link:translate-x-1" />
                </motion.a>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* View All Button */}
        <motion.div 
          className="text-center mt-16"
          variants={itemVariants}
        >
          <motion.a 
            href="/projects" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-md font-medium transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View All Projects
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ProductsSection;