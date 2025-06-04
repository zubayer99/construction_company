import { PhoneCall, Mail, ArrowRight, Award } from 'lucide-react';

const CtaSection = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxIiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')]"></div>
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-blue-800/30 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
            <Award className="h-5 w-5 mr-2 text-yellow-400" />
            <span className="text-blue-100 font-medium">25+ Years of Excellence in Industrial Solutions</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Ready to Partner with the
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
              Leading Industrial Supplier?
            </span>
          </h2>
          <p className="text-blue-100 text-xl max-w-4xl mx-auto leading-relaxed">
            Join over 500+ satisfied clients across the UAE and GCC region. Al Fatah Enterprise delivers 
            premium industrial machinery, equipment, and unmatched service excellence. Get your personalized 
            quote today and experience the difference quality makes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <h3 className="font-bold text-xl mb-2 text-yellow-400">Instant Quote</h3>
            <p className="text-blue-100">Get competitive pricing within 24 hours</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <h3 className="font-bold text-xl mb-2 text-yellow-400">Expert Consultation</h3>
            <p className="text-blue-100">Professional guidance from industry specialists</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <h3 className="font-bold text-xl mb-2 text-yellow-400">Nationwide Delivery</h3>
            <p className="text-blue-100">Fast and reliable delivery across UAE</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
          <a 
            href="/contact"
            className="group bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-blue-900 px-10 py-5 rounded-xl font-bold text-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl flex items-center"
          >
            <Mail className="mr-3 h-6 w-6" />
            Get Free Quote Now
            <ArrowRight className="ml-3 h-6 w-6 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
          
          <div className="text-center lg:text-left">
            <p className="text-blue-200 text-sm mb-2">Or call us directly:</p>
            <a 
              href="tel:+97148856789"
              className="group border-2 border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:border-white/50 px-8 py-5 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center lg:justify-start"
            >
              <PhoneCall className="mr-3 h-6 w-6 group-hover:animate-bounce" />
              +971 4 885 6789
            </a>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-blue-200">
            <span className="inline-flex items-center">
              <Award className="h-4 w-4 mr-2 text-yellow-400" />
              ISO 9001:2015 Certified
            </span>
            <span className="mx-4">•</span>
            <span>500+ Satisfied Clients</span>
            <span className="mx-4">•</span>
            <span>25+ Years Experience</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;