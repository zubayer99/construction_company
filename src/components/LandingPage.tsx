import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  FileText, 
  Users, 
  Gavel, 
  TrendingUp, 
  Award,
  CheckCircle,
  Building,
  ArrowRight,
  Eye,
  DollarSign
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: 'Transparent Process',
      description: 'Ensure complete transparency in government procurement with audit trails and public visibility.'
    },
    {
      icon: FileText,
      title: 'Digital Tender Management',
      description: 'Create, publish, and manage tenders digitally with automated workflows and notifications.'
    },
    {
      icon: Gavel,
      title: 'Fair Bidding System',
      description: 'Competitive bidding platform with equal opportunities for all qualified suppliers.'
    },
    {
      icon: TrendingUp,
      title: 'Analytics & Reporting',
      description: 'Comprehensive analytics and reporting tools for better decision-making and compliance.'
    },
    {
      icon: Users,
      title: 'Multi-Role Support',
      description: 'Dedicated interfaces for procurement officers, suppliers, auditors, and citizens.'
    },
    {
      icon: Award,
      title: 'Compliance Management',
      description: 'Built-in compliance checks and audit capabilities to ensure regulatory adherence.'
    }
  ];

  const stats = [
    { icon: FileText, label: 'Active Tenders', value: '2,450' },
    { icon: Building, label: 'Registered Suppliers', value: '8,750' },
    { icon: DollarSign, label: 'Total Contract Value', value: '$2.5B' },
    { icon: CheckCircle, label: 'Completed Projects', value: '15,200' }
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Ahmed',
      role: 'Director, Ministry of ICT',
      content: 'This platform has revolutionized our procurement process, making it more transparent and efficient.',
      avatar: '/api/placeholder/64/64'
    },
    {
      name: 'Mohammad Rahman',
      role: 'CEO, TechSolutions Ltd.',
      content: 'As a supplier, I appreciate the fair and transparent bidding process. It has leveled the playing field.',
      avatar: '/api/placeholder/64/64'
    },
    {
      name: 'Ms. Fatima Khan',
      role: 'Senior Auditor',
      content: 'The audit capabilities and compliance features make monitoring government spending much easier.',
      avatar: '/api/placeholder/64/64'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Government Procurement System</h1>
                <p className="text-sm text-gray-600">People's Republic of Bangladesh</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/auth" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </Link>
              <Link 
                to="/auth" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Modernizing Government
              <span className="block text-blue-600">Procurement Process</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              A comprehensive digital platform for transparent, efficient, and compliant government procurement. 
              Connecting government agencies with qualified suppliers through a fair and transparent process.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">              <Link 
                to="/auth" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors inline-flex items-center justify-center"
              >
                Access Platform
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/public-tenders"
                className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 rounded-lg text-lg font-medium transition-colors inline-flex items-center justify-center"
              >
                <Eye className="mr-2 h-5 w-5" />
                View Public Tenders
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built specifically for government procurement needs with transparency, 
              efficiency, and compliance at its core.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple, transparent, and efficient procurement process
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Tender Creation', description: 'Government agencies create and publish tender requirements' },
              { step: '2', title: 'Supplier Registration', description: 'Qualified suppliers register and submit their bids' },
              { step: '3', title: 'Evaluation Process', description: 'Transparent evaluation based on predefined criteria' },
              { step: '4', title: 'Contract Award', description: 'Best qualified supplier receives the contract award' }
            ].map((process, index) => (
              <div key={index} className="text-center">
                <div className="h-16 w-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
                  {process.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{process.title}</h3>
                <p className="text-gray-600">{process.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600">
              Trusted by government agencies and suppliers across Bangladesh
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                    <Users className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-600 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of government agencies and suppliers who trust our platform 
            for their procurement needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/auth" 
              className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-3 rounded-lg text-lg font-medium transition-colors inline-flex items-center justify-center"
            >
              Sign Up Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <button className="border border-blue-400 hover:border-blue-300 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-semibold">GPS</span>
              </div>
              <p className="text-gray-400">
                Government Procurement System - Modernizing public procurement for transparency and efficiency.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>              <ul className="space-y-2 text-gray-400">
                <li><Link to="/public-tenders" className="hover:text-white">Public Tenders</Link></li>
                <li><Link to="/auth" className="hover:text-white">Supplier Registration</Link></li>
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Government</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Ministry of ICT</a></li>
                <li><a href="#" className="hover:text-white">Public Procurement</a></li>
                <li><a href="#" className="hover:text-white">Policies</a></li>
                <li><a href="#" className="hover:text-white">Compliance</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Phone: +880-2-123-456-789</li>
                <li>Email: support@gps.gov.bd</li>
                <li>Address: ICT Tower, Agargaon, Dhaka</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Government Procurement System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
