import { useState, useEffect } from 'react';
import { ChevronRight, Play } from 'lucide-react';

interface SlideData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  cta: string;
  image: string;
}

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides: SlideData[] = [
    {
      id: 1,
      title: "AL FATAH ENTERPRISE",
      subtitle: "Your Trusted Business Partner",
      description: "Leading provider of industrial solutions, distribution services, and business consulting across the Middle East and beyond.",
      cta: "Explore Our Services",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
      id: 2,
      title: "GLOBAL DISTRIBUTION",
      subtitle: "Worldwide Supply Chain Solutions",
      description: "Comprehensive distribution network serving industries across multiple sectors with reliable and efficient delivery systems.",
      cta: "View Our Network",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
      id: 3,
      title: "BUSINESS EXCELLENCE",
      subtitle: "Innovation & Quality",
      description: "Committed to delivering exceptional business solutions through innovation, quality products, and outstanding customer service.",
      cta: "Get Started",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2126&q=80"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section className="relative h-screen overflow-hidden bg-gray-900">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/70 to-transparent z-10"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center z-0"
            style={{ 
              backgroundImage: `url(${slide.image})`,
            }}
          ></div>
          
          {/* Content */}
          <div className="relative h-full flex items-center z-20">
            <div className="container mx-auto px-6 lg:px-12">
              <div className="max-w-4xl">
                <div className="mb-6">
                  <span className="inline-block px-4 py-2 bg-blue-600/20 backdrop-blur-sm rounded-full text-blue-200 text-sm font-medium border border-blue-400/30">
                    Welcome to Al Fatah Enterprise
                  </span>
                </div>
                
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                  {slide.title}
                </h1>
                
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-blue-200 mb-6">
                  {slide.subtitle}
                </h2>
                
                <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl leading-relaxed">
                  {slide.description}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition duration-300 flex items-center justify-center group shadow-lg">
                    {slide.cta}
                    <ChevronRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition duration-300 flex items-center justify-center">
                    <Play className="mr-2 h-5 w-5" />
                    Watch Video
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button 
        onClick={() => setCurrentSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1)}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-30 bg-white/10 backdrop-blur-sm border border-white/20 text-white p-3 rounded-full hover:bg-white/20 transition duration-300"
      >
        <ChevronRight className="h-6 w-6 rotate-180" />
      </button>
      
      <button 
        onClick={() => setCurrentSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1)}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-30 bg-white/10 backdrop-blur-sm border border-white/20 text-white p-3 rounded-full hover:bg-white/20 transition duration-300"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center z-30">
        <div className="flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-blue-400 w-12' 
                  : 'bg-white/50 w-2 hover:bg-white/80'
              }`}
              onClick={() => setCurrentSlide(index)}
            ></button>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 animate-bounce">
        <div className="flex flex-col items-center text-white/70">
          <span className="text-sm mb-2">Scroll Down</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;