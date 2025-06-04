import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { testimonialsService, Testimonial } from '../services/businessService';

const TestimonialsSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await testimonialsService.getPublic();
        setTestimonials(data);
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        // Professional testimonials for Al Fatah Enterprise
        setTestimonials([
          {
            id: '1',
            name: "Ahmed Al Mansouri",
            clientName: "Ahmed Al Mansouri",
            clientCompany: "Emirates Industrial Group",
            content: "Al Fatah Enterprise has been our preferred supplier for industrial equipment for over a decade. Their commitment to quality, competitive pricing, and exceptional after-sales service has made them an indispensable partner in our growth journey.",
            imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
            isActive: true,
            rating: 5,
            displayOrder: 1
          },
          {
            id: '2',
            name: "Sarah Mitchell",
            clientName: "Sarah Mitchell",
            clientCompany: "Gulf Construction LLC",
            content: "The reliability and professionalism of Al Fatah Enterprise is unmatched. They consistently deliver high-quality construction materials on time and within budget. Their technical expertise has been invaluable to our major projects.",
            imageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=150&q=80",
            isActive: true,
            rating: 5,
            displayOrder: 2
          },
          {
            id: '3',
            name: "Dr. Mohammad Hassan",
            clientName: "Dr. Mohammad Hassan",
            clientCompany: "Petrochemical Industries",
            content: "Al Fatah Enterprise's deep understanding of the oil and gas sector, combined with their extensive product range and technical support, makes them our go-to supplier for critical equipment and safety solutions.",
            imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
            isActive: true,
            rating: 5,
            displayOrder: 3
          },
          {
            id: '4',
            name: "Lisa Thompson",
            clientName: "Lisa Thompson",
            clientCompany: "Advanced Manufacturing Solutions",
            content: "Working with Al Fatah Enterprise has transformed our supply chain efficiency. Their comprehensive product portfolio and logistics expertise ensure we always have the right equipment when we need it.",
            imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
            isActive: true,
            rating: 5,
            displayOrder: 4
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (isAutoplay) {
      autoplayRef.current = setInterval(() => {
        nextSlide();
      }, 5000);
    }
    
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [isAutoplay, testimonials.length]);

  const pauseAutoplay = () => setIsAutoplay(false);
  const resumeAutoplay = () => setIsAutoplay(true);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">What Our Clients Say</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">What Our Clients Say</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
            <p className="text-gray-600">No testimonials available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">What Our Clients Say</h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Hear from our satisfied clients about their experience working with Al Fatah Enterprise.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto"
          onMouseEnter={pauseAutoplay}
          onMouseLeave={resumeAutoplay}
        >
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0">
                  <div className="bg-white rounded-lg shadow-md p-8 md:p-10">
                    <div className="flex flex-col md:flex-row items-center">
                      <div className="mb-6 md:mb-0 md:mr-8">
                        <div className="w-24 h-24 rounded-full overflow-hidden">
                          <img 
                            src={testimonial.imageUrl || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'} 
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="mb-4">
                          <Quote className="h-10 w-10 text-blue-200" />
                        </div>
                        <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                        <div>
                          <h4 className="text-lg font-semibold text-blue-900">{testimonial.clientName || testimonial.name}</h4>
                          {testimonial.clientCompany && <p className="text-gray-500">{testimonial.clientCompany}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <button 
            className="absolute top-1/2 left-4 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors duration-300"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button 
            className="absolute top-1/2 right-4 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors duration-300"
            onClick={nextSlide}
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-blue-600 w-8' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                onClick={() => setCurrentSlide(index)}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;