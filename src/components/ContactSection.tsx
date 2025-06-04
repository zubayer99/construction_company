import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { contactService, companyService, CompanyInfo, ContactInquiry } from '../services/businessService';

const ContactSection = () => {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [formData, setFormData] = useState<Omit<ContactInquiry, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'assignedTo' | 'response' | 'notes' | 'respondedAt' | 'source'>>({
    name: '',
    email: '',
    phone: '', // Added from interface
    company: '', // Added from interface
    subject: '',
    message: '',
    serviceInterest: '' // Added from interface
  });

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const data = await companyService.get();
        setCompanyInfo(data);
      } catch (err) {
        console.error('Error fetching company info:', err);
        // Fallback to default data - consider removing if API is reliable
        setCompanyInfo({
          name: "Al Fatah Enterprise",
          address: "Dubai Industrial City, Plot 598-639, Dubai, United Arab Emirates", // was headquarters
          city: "Dubai",
          state: "Dubai",
          zipCode: "00000",
          country: "UAE",
          phone: "+971 4 885 6789",
          email: "info@alfatahenterprise.com",
          description: "Leading supplier of industrial machinery and equipment in the UAE"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyInfo();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus(null);

    try {
      // Ensure all required fields from the service are present
      // The service expects: name, email, subject, message.
      // Optional fields from schema: phone, company, serviceInterest
      const submissionData: Omit<ContactInquiry, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'assignedTo' | 'response' | 'notes' | 'respondedAt' | 'source'> = {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        phone: formData.phone || undefined, // Send undefined if empty
        company: formData.company || undefined,
        serviceInterest: formData.serviceInterest || undefined,
      };
      await contactService.submit(submissionData);
      
      setSubmitStatus({ type: 'success', message: 'Thank you for your message! We will get back to you soon.' });
      setFormData({ name: '', email: '', phone: '', company: '', subject: '', message: '', serviceInterest: '' });
    } catch (err) {
      console.error('Error submitting contact form:', err);
      setSubmitStatus({ type: 'error', message: 'Sorry, there was an error sending your message. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">
            Get In <span className="text-blue-600">Touch</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-800 mx-auto mb-8"></div>
          <p className="text-gray-600 max-w-4xl mx-auto text-lg leading-relaxed">
            Ready to discuss your industrial equipment needs? Our expert team is here to provide personalized solutions, 
            competitive quotes, and exceptional service. Contact Al Fatah Enterprise today.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10">
            <h3 className="text-3xl font-bold text-blue-900 mb-8 flex items-center">
              <Mail className="h-8 w-8 mr-3 text-blue-600" />
              Send Us a Message
            </h3>
            {submitStatus && (
              <div className={`mb-6 p-4 rounded-lg ${submitStatus.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-3 ${submitStatus.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  {submitStatus.message}
                </div>
              </div>
            )}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    placeholder="john@company.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-gray-700 font-semibold mb-2">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label htmlFor="company" className="block text-gray-700 font-semibold mb-2">Company</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    placeholder="Your Company Inc."
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-gray-700 font-semibold mb-2">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  placeholder="Equipment Inquiry / Quote Request"
                />
              </div>
              <div>
                <label htmlFor="serviceInterest" className="block text-gray-700 font-semibold mb-2">Service of Interest</label>
                <select 
                  name="serviceInterest" 
                  id="serviceInterest" 
                  value={formData.serviceInterest}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white"
                >
                  <option value="">Select a service (optional)</option>
                  <option value="heavy_machinery">Heavy Machinery</option>
                  <option value="power_tools">Power Tools</option>
                  <option value="safety_equipment">Safety Equipment</option>
                  <option value="industrial_automation">Industrial Automation</option>
                  <option value="consulting_services">Consulting Services</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-gray-700 font-semibold mb-2">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 resize-none"
                  placeholder="Please describe your requirements, project specifications, or any questions you have..."
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-300 disabled:to-blue-400 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 disabled:transform-none disabled:hover:shadow-lg"
              >
                {submitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                    Sending Message...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Mail className="h-5 w-5 mr-2" />
                    Send Message
                  </div>
                )}
              </button>
            </form>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10">
              <h3 className="text-3xl font-bold text-blue-900 mb-8 flex items-center">
                <MapPin className="h-8 w-8 mr-3 text-blue-600" />
                Contact Information
              </h3>
              {loading ? (
                <div className="space-y-6">
                  <div className="animate-pulse space-y-6">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="flex items-start group hover:bg-blue-50 p-4 rounded-lg transition-colors duration-300">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center mr-6 group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300">
                      <MapPin className="h-7 w-7 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-blue-900 mb-2 text-lg">Our Office</h4>
                      <p className="text-gray-600 leading-relaxed">
                        {companyInfo?.address || "Address not available"}{companyInfo?.city && `, ${companyInfo.city}`}{companyInfo?.state && `, ${companyInfo.state}`}{companyInfo?.zipCode && ` ${companyInfo.zipCode}`}{companyInfo?.country && `, ${companyInfo.country}`}
                      </p>
                      <p className="text-blue-600 text-sm mt-1 font-medium">Visit us during business hours</p>
                    </div>
                  </div>

                  <div className="flex items-start group hover:bg-blue-50 p-4 rounded-lg transition-colors duration-300">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center mr-6 group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300">
                      <Phone className="h-7 w-7 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-blue-900 mb-2 text-lg">Phone & WhatsApp</h4>
                      <p className="text-gray-600 text-lg font-medium">{companyInfo?.phone || "Phone not available"}</p>
                      <p className="text-blue-600 text-sm mt-1">Available for urgent inquiries</p>
                    </div>
                  </div>

                  <div className="flex items-start group hover:bg-blue-50 p-4 rounded-lg transition-colors duration-300">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center mr-6 group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300">
                      <Mail className="h-7 w-7 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-blue-900 mb-2 text-lg">Email Address</h4>
                      <p className="text-gray-600 text-lg">{companyInfo?.email || "Email not available"}</p>
                      <p className="text-blue-600 text-sm mt-1">Professional business inquiries</p>
                    </div>
                  </div>

                  <div className="flex items-start group hover:bg-blue-50 p-4 rounded-lg transition-colors duration-300">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center mr-6 group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300">
                      <Clock className="h-7 w-7 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-blue-900 mb-2 text-lg">Business Hours</h4>
                      {companyInfo?.businessHours ? (
                        <div className="space-y-1 text-gray-600">
                          {Object.entries(companyInfo.businessHours).map(([day, hours]) => (
                            <p key={day}><span className="font-medium">{day.charAt(0).toUpperCase() + day.slice(1)}:</span> {hours}</p>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-1 text-gray-600">
                          <p><span className="font-medium">Sunday - Thursday:</span> 8:00 AM - 6:00 PM</p>
                          <p><span className="font-medium">Saturday:</span> 9:00 AM - 2:00 PM</p>
                          <p><span className="font-medium">Friday:</span> Closed</p>
                        </div>
                      )}
                      <p className="text-blue-600 text-sm mt-2">{companyInfo?.country || "Local"} business hours</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Map Section - No changes needed here based on current task */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="h-80 relative">
                <img 
                  src="https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&w=1200&q=80" 
                  alt="Dubai Industrial City Location" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-blue-900/20"></div>
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-4">
                  <h4 className="font-bold text-blue-900 mb-1">{companyInfo?.name || "Al Fatah Enterprise"}</h4>
                  <p className="text-gray-600 text-sm">{companyInfo?.city || "Dubai"}, {companyInfo?.country || "UAE"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;