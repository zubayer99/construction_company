import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import TenderDetailsModal from './tenders/TenderDetailsModal';
import SubmitBidModal from './bids/SubmitBidModal';
import { 
  Search, 
  Filter, 
  Calendar, 
  DollarSign, 
  Clock, 
  Eye,
  Building,
  FileText,
  ArrowRight,
  Shield
} from 'lucide-react';
// import { publicTenderService } from '../services/publicTenderService';

// Temporary fallback for public tender service
const publicTenderService = {
  getPublicTenders: async (query: any = {}) => {
    // This will use the backend API directly for now
    const params = new URLSearchParams();
    if (query.page) params.append('page', query.page.toString());
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.category) params.append('category', query.category);
    if (query.search) params.append('search', query.search);

    const queryString = params.toString();
    const url = `http://localhost:5000/public/tenders${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
};

interface PublicTender {
  id: string;
  title: string;
  description: string;
  category: string;
  estimatedValue: number;
  publishedAt: string;
  submissionDeadline: string;
  organization: {
    name: string;
    type: string;
  };
  status: string;
}

const PublicTendersPage: React.FC = () => {
  const { user } = useAuth();
  const [tenders, setTenders] = useState<PublicTender[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedTender, setSelectedTender] = useState<PublicTender | null>(null);

  const categories = [
    'GOODS',
    'SERVICES', 
    'WORKS',
    'CONSULTANCY'
  ];

  useEffect(() => {
    fetchTenders();
  }, [currentPage, selectedCategory, searchTerm]);

  const fetchTenders = async () => {
    try {
      setLoading(true);
      const response = await publicTenderService.getPublicTenders({
        page: currentPage,
        limit: 12,
        category: selectedCategory || undefined,
        search: searchTerm || undefined
      });
      
      setTenders(response.data.tenders || []);
      setTotalPages(Math.ceil((response.data.total || 0) / 12));
    } catch (error) {
      console.error('Error fetching public tenders:', error);
      setTenders([]);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysRemaining = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchTenders();
  };

  const handleViewDetails = (tender: PublicTender) => {
    setSelectedTender(tender);
    setShowDetailsModal(true);
  };

  const handleSubmitBid = (tender: PublicTender) => {
    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = '/auth';
      return;
    }
    setSelectedTender(tender);
    setShowBidModal(true);
  };

  const handleBidSuccess = () => {
    setShowBidModal(false);
    setSelectedTender(null);
    // You could show a success message or refresh data here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Government Procurement System</h1>
                <p className="text-sm text-gray-600">Public Tender Portal</p>
              </div>
            </Link>
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
                Register as Supplier
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Public Tender Portal
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Browse all published government tenders. Transparent, accessible, and open to all qualified suppliers.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="bg-white shadow-sm py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tenders by title, description, or organization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0) + category.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center"
              >
                <Filter className="h-5 w-5 mr-2" />
                Filter
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Tenders Grid */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : tenders.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tenders found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or check back later for new tenders.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tenders.map((tender) => {
                const daysRemaining = getDaysRemaining(tender.submissionDeadline);
                return (
                  <div key={tender.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
                    <div className="flex justify-between items-start mb-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        tender.category === 'GOODS' ? 'bg-blue-100 text-blue-800' :
                        tender.category === 'SERVICES' ? 'bg-green-100 text-green-800' :
                        tender.category === 'WORKS' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {tender.category}
                      </span>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        daysRemaining > 7 ? 'bg-green-100 text-green-800' :
                        daysRemaining > 3 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {daysRemaining > 0 ? `${daysRemaining} days left` : 'Expired'}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {tender.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {tender.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Building className="h-4 w-4 mr-2" />
                        <span className="truncate">{tender.organization.name}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <DollarSign className="h-4 w-4 mr-2" />
                        <span>Est. Value: {formatCurrency(tender.estimatedValue)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Deadline: {formatDate(tender.submissionDeadline)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>Published: {formatDate(tender.publishedAt)}</span>
                      </div>
                    </div>                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleViewDetails(tender)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </button>
                      {user ? (
                        <button 
                          onClick={() => handleSubmitBid(tender)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                        >
                          <ArrowRight className="h-4 w-4 mr-2" />
                          Submit Bid
                        </button>
                      ) : (
                        <Link 
                          to="/auth"
                          className="flex-1 border border-gray-300 hover:border-gray-400 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                        >
                          <ArrowRight className="h-4 w-4 mr-2" />
                          Login to Bid
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50"
              >
                Previous
              </button>
              
              {[...Array(Math.min(5, totalPages))].map((_, index) => {
                const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + index;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 text-sm rounded ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Want to Participate in Government Tenders?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Register as a supplier to submit bids, track your applications, 
            and get notified about new opportunities in your industry.
          </p>          <Link 
            to="/auth" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors inline-flex items-center"
          >
            Register Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>      {/* Modals */}
      {selectedTender && (
        <>
          <TenderDetailsModal
            tenderId={selectedTender.id}
            isOpen={showDetailsModal}
            onClose={() => {
              setShowDetailsModal(false);
              setSelectedTender(null);
            }}
            onSubmitBid={() => {
              setShowDetailsModal(false);
              if (user) {
                setShowBidModal(true);
              } else {
                window.location.href = '/auth';
              }
            }}
            userRole={user?.role}
          />
          
          {user && (
            <SubmitBidModal
              tender={{
                id: selectedTender.id,
                title: selectedTender.title,
                estimatedValue: selectedTender.estimatedValue,
                submissionDeadline: selectedTender.submissionDeadline,
                category: selectedTender.category
              }}
              isOpen={showBidModal}
              onClose={() => {
                setShowBidModal(false);
                setSelectedTender(null);
              }}
              onSuccess={handleBidSuccess}
            />
          )}
        </>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold">Government Procurement System</span>
            </div>
            <p className="text-gray-400 mb-4">
              Transparent, efficient, and fair government procurement for all.
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <Link to="/" className="hover:text-white">Home</Link>
              <a href="#" className="hover:text-white">About</a>
              <a href="#" className="hover:text-white">Contact</a>
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicTendersPage;
