import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { newsletterService } from '../services/businessService';

const NewsletterSection = () => {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await newsletterService.subscribe(formData.email, formData.firstName, formData.lastName);
      setSubmitStatus({ 
        type: 'success', 
        message: 'Thank you for subscribing! You\'ll receive updates about our latest products and industry insights.' 
      });
      setFormData({ email: '', firstName: '', lastName: '' });
    } catch (err: any) {
      console.error('Error subscribing to newsletter:', err);
      const errorMessage = err.response?.data?.error || 'Sorry, there was an error processing your subscription. Please try again.';
      setSubmitStatus({ type: 'error', message: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Stay <span className="text-blue-300">Informed</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-blue-300 mx-auto mb-8"></div>
            <p className="text-blue-100 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
              Get the latest updates on industrial equipment, new product launches, industry insights, 
              and exclusive offers delivered straight to your inbox. Join thousands of professionals 
              who trust Al Fatah Enterprise for their industrial needs.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 text-gray-900">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-bold text-blue-900">Newsletter Subscription</h3>
                <p className="text-gray-600">Join our community of industry professionals</p>
              </div>
            </div>

            {submitStatus && (
              <div className={`mb-6 p-4 rounded-lg border ${
                submitStatus.type === 'success' 
                  ? 'bg-green-50 text-green-700 border-green-200' 
                  : 'bg-red-50 text-red-700 border-red-200'
              }`}>
                <div className="flex items-center">
                  {submitStatus.type === 'success' ? (
                    <CheckCircle className="h-5 w-5 mr-3" />
                  ) : (
                    <AlertCircle className="h-5 w-5 mr-3" />
                  )}
                  {submitStatus.message}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-gray-700 font-semibold mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-gray-700 font-semibold mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    placeholder="Smith"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  placeholder="john.smith@company.com"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-300 disabled:to-blue-400 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 disabled:transform-none disabled:hover:shadow-lg"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                    Subscribing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Mail className="h-5 w-5 mr-2" />
                    Subscribe to Newsletter
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </div>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Industry Updates</h4>
                  <p className="text-gray-600 text-sm">Latest trends and news in industrial equipment</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Exclusive Offers</h4>
                  <p className="text-gray-600 text-sm">Special discounts and early access to new products</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                    <ArrowRight className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">No Spam</h4>
                  <p className="text-gray-600 text-sm">Unsubscribe anytime with one click</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
