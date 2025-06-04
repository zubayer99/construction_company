import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { tenderService, Tender, TenderFilters } from '../../services/tenderService';
import CreateTenderModal from './CreateTenderModal';
import TenderDetailsModal from './TenderDetailsModal';
import { 
  Plus, 
  Filter, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar, 
  DollarSign, 
  Users, 
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

const TenderList: React.FC = () => {
  const { user } = useAuth();  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null);
  const [filters, setFilters] = useState<TenderFilters>({
    page: 1,
    limit: 10
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    totalResults: 0,
    totalPages: 0,
    currentPage: 1
  });

  const categories = [
    { value: 'GOODS', label: 'Goods' },
    { value: 'SERVICES', label: 'Services' },
    { value: 'WORKS', label: 'Works' },
    { value: 'CONSULTANCY', label: 'Consultancy' }
  ];

  const statusOptions = user?.role === 'PROCUREMENT_OFFICER' 
    ? [
        { value: 'DRAFT', label: 'Draft' },
        { value: 'PUBLISHED', label: 'Published' },
        { value: 'CANCELLED', label: 'Cancelled' },
        { value: 'EVALUATED', label: 'Evaluated' },
        { value: 'AWARDED', label: 'Awarded' }
      ]
    : [
        { value: 'PUBLISHED', label: 'Published' }
      ];

  useEffect(() => {
    fetchTenders();
  }, [filters]);

  const fetchTenders = async () => {
    try {
      setLoading(true);
      const response = await tenderService.getTenders(filters);
      setTenders(response.data.tenders);
      setPagination({
        totalResults: response.totalResults,
        totalPages: response.totalPages,
        currentPage: response.currentPage
      });
    } catch (error) {
      console.error('Error fetching tenders:', error);
      toast.error('Failed to fetch tenders');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, we'll just refetch with current filters
    // In a real implementation, you'd add search to the API
    fetchTenders();
  };

  const handleFilterChange = (key: keyof TenderFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };
  const handlePublishTender = async (id: string) => {
    try {
      await tenderService.publishTender(id);
      toast.success('Tender published successfully');
      fetchTenders();
    } catch (error) {
      console.error('Error publishing tender:', error);
      toast.error('Failed to publish tender');
    }
  };

  const handleViewDetails = (tender: Tender) => {
    setSelectedTender(tender);
    setShowDetailsModal(true);
  };

  const handleCancelTender = async (id: string) => {
    try {
      await tenderService.cancelTender(id);
      toast.success('Tender cancelled successfully');
      fetchTenders();
    } catch (error) {
      console.error('Error cancelling tender:', error);
      toast.error('Failed to cancel tender');
    }
  };

  const handleDeleteTender = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tender? This action cannot be undone.')) {
      return;
    }

    try {
      await tenderService.deleteTender(id);
      toast.success('Tender deleted successfully');
      fetchTenders();
    } catch (error) {
      console.error('Error deleting tender:', error);
      toast.error('Failed to delete tender');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'PUBLISHED':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'CANCELLED':
        return <X className="h-4 w-4 text-red-500" />;
      case 'EVALUATED':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'AWARDED':
        return <CheckCircle className="h-4 w-4 text-purple-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800';
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'EVALUATED':
        return 'bg-blue-100 text-blue-800';
      case 'AWARDED':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tenders</h1>
          <p className="text-gray-600 mt-1">
            {user?.role === 'PROCUREMENT_OFFICER' 
              ? 'Manage your tenders and track submissions'
              : 'Browse available tenders and submit proposals'
            }
          </p>
        </div>        {user?.role === 'PROCUREMENT_OFFICER' && (
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            <span>Create Tender</span>
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search tenders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Search
          </button>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
        </form>

        {/* Filters Panel */}
        {showFilters && (
          <div className="border-t pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={filters.category || ''}
                onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                {statusOptions.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Per Page</label>
              <select
                value={filters.limit || 10}
                onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setFilters({ page: 1, limit: 10 })}
                className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>
          Showing {pagination.totalResults > 0 ? ((pagination.currentPage - 1) * (filters.limit || 10)) + 1 : 0} to{' '}
          {Math.min(pagination.currentPage * (filters.limit || 10), pagination.totalResults)} of{' '}
          {pagination.totalResults} tenders
        </span>
      </div>

      {/* Tender List */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading tenders...</p>
        </div>
      ) : tenders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tenders found</h3>
          <p className="text-gray-600">
            {user?.role === 'PROCUREMENT_OFFICER' 
              ? 'Create your first tender to get started.'
              : 'No tenders match your current filters.'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {tenders.map((tender) => (
            <div key={tender.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{tender.title}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(tender.status)}`}>
                      {getStatusIcon(tender.status)}
                      <span className="ml-1">{tender.status}</span>
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3 line-clamp-2">{tender.description}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Est. Value:</span>
                      <span className="font-medium">{formatCurrency(tender.estimatedValue)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Deadline:</span>
                      <span className="font-medium">{formatDate(tender.submissionDeadline)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium">{tender.category}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Bids:</span>
                      <span className="font-medium">{tender._count?.bids || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 ml-4">                  <button
                    onClick={() => handleViewDetails(tender)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  
                  {user?.role === 'PROCUREMENT_OFFICER' && (
                    <>
                      {tender.status === 'DRAFT' && (
                        <>
                          <button
                            onClick={() => handlePublishTender(tender.id)}
                            className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg"
                            title="Publish Tender"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                            title="Edit Tender"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTender(tender.id)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                            title="Delete Tender"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      
                      {tender.status === 'PUBLISHED' && (
                        <button
                          onClick={() => handleCancelTender(tender.id)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                          title="Cancel Tender"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Additional Info */}
              <div className="border-t pt-4 flex justify-between items-center text-sm text-gray-500">
                <span>
                  Created by {tender.createdBy.firstName} {tender.createdBy.lastName} 
                  ({tender.createdBy.organization.name})
                </span>
                <span>Created {formatDate(tender.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-between items-center">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="flex space-x-2">
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    page === pagination.currentPage
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next          </button>
        </div>
      )}      {/* Create Tender Modal */}
      <CreateTenderModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          fetchTenders(); // Refresh the tender list
        }}
      />      {/* Tender Details Modal */}
      {selectedTender && (
        <TenderDetailsModal
          tenderId={selectedTender.id}
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedTender(null);
          }}
          userRole={user?.role}
        />
      )}
    </div>
  );
};

export default TenderList;
