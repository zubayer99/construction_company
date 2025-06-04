import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { bidService, Bid, BidFilters } from '../../services/bidService';
import { 
  FileText, 
  DollarSign, 
  Calendar, 
  Eye, 
  Edit, 
  Trash2, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  X,
  TrendingUp,
  Building
} from 'lucide-react';
import toast from 'react-hot-toast';

const BidList: React.FC = () => {
  const { user } = useAuth();
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<BidFilters>({
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({
    totalResults: 0,
    totalPages: 0,
    currentPage: 1
  });

  const statusOptions = [
    { value: 'DRAFT', label: 'Draft' },
    { value: 'SUBMITTED', label: 'Submitted' },
    { value: 'UNDER_REVIEW', label: 'Under Review' },
    { value: 'ACCEPTED', label: 'Accepted' },
    { value: 'REJECTED', label: 'Rejected' }
  ];

  useEffect(() => {
    fetchBids();
  }, [filters]);

  const fetchBids = async () => {
    try {
      setLoading(true);
      const response = await bidService.getBids(filters);
      setBids(response.data.bids);
      setPagination({
        totalResults: response.totalResults,
        totalPages: response.totalPages,
        currentPage: response.currentPage
      });
    } catch (error) {
      console.error('Error fetching bids:', error);
      toast.error('Failed to fetch bids');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof BidFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleWithdrawBid = async (id: string) => {
    if (!confirm('Are you sure you want to withdraw this bid? This action cannot be undone.')) {
      return;
    }

    try {
      await bidService.withdrawBid(id);
      toast.success('Bid withdrawn successfully');
      fetchBids();
    } catch (error) {
      console.error('Error withdrawing bid:', error);
      toast.error('Failed to withdraw bid');
    }
  };

  const handleDeleteBid = async (id: string) => {
    if (!confirm('Are you sure you want to delete this bid? This action cannot be undone.')) {
      return;
    }

    try {
      await bidService.deleteBid(id);
      toast.success('Bid deleted successfully');
      fetchBids();
    } catch (error) {
      console.error('Error deleting bid:', error);
      toast.error('Failed to delete bid');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'SUBMITTED':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'UNDER_REVIEW':
        return <Eye className="h-4 w-4 text-purple-500" />;
      case 'ACCEPTED':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'REJECTED':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800';
      case 'SUBMITTED':
        return 'bg-blue-100 text-blue-800';
      case 'UNDER_REVIEW':
        return 'bg-purple-100 text-purple-800';
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isDeadlinePassed = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {user?.role === 'SUPPLIER' ? 'My Bids' : 'Tender Bids'}
          </h1>
          <p className="text-gray-600 mt-1">
            {user?.role === 'SUPPLIER' 
              ? 'Track your submitted bids and their status'
              : 'Review and evaluate bids submitted for your tenders'
            }
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

          <div className="sm:col-span-2 flex items-end">
            <button
              onClick={() => setFilters({ page: 1, limit: 10 })}
              className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>
          Showing {pagination.totalResults > 0 ? ((pagination.currentPage - 1) * (filters.limit || 10)) + 1 : 0} to{' '}
          {Math.min(pagination.currentPage * (filters.limit || 10), pagination.totalResults)} of{' '}
          {pagination.totalResults} bids
        </span>
      </div>

      {/* Bid List */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading bids...</p>
        </div>
      ) : bids.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bids found</h3>
          <p className="text-gray-600">
            {user?.role === 'SUPPLIER' 
              ? 'You haven\'t submitted any bids yet. Browse available tenders to get started.'
              : 'No bids have been submitted for your tenders yet.'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bids.map((bid) => (
            <div key={bid.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{bid.tender.title}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(bid.status)}`}>
                      {getStatusIcon(bid.status)}
                      <span className="ml-1">{bid.status.replace('_', ' ')}</span>
                    </span>
                    {isDeadlinePassed(bid.tender.submissionDeadline) && bid.status === 'DRAFT' && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Deadline Passed
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-4">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Bid Amount:</span>
                      <span className="font-medium">{formatCurrency(bid.totalAmount)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Est. Value:</span>
                      <span className="font-medium">{formatCurrency(bid.tender.estimatedValue)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Deadline:</span>
                      <span className="font-medium">{formatDate(bid.tender.submissionDeadline)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Submitted:</span>
                      <span className="font-medium">{formatDate(bid.submittedAt)}</span>
                    </div>
                  </div>

                  {/* Scores (if available) */}
                  {(bid.technicalScore !== null || bid.financialScore !== null) && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Evaluation Scores</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {bid.technicalScore !== null && (
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="h-4 w-4 text-blue-500" />
                            <span className="text-gray-600">Technical:</span>
                            <span className="font-medium">{bid.technicalScore}/100</span>
                          </div>
                        )}
                        {bid.financialScore !== null && (
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-green-500" />
                            <span className="text-gray-600">Financial:</span>
                            <span className="font-medium">{bid.financialScore}/100</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Proposal Preview */}
                  <div className="text-sm text-gray-600">
                    <p className="line-clamp-2">{bid.proposal}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  
                  {user?.role === 'SUPPLIER' && (
                    <>
                      {bid.status === 'DRAFT' && !isDeadlinePassed(bid.tender.submissionDeadline) && (
                        <button
                          className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                          title="Edit Bid"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      )}
                      
                      {(bid.status === 'SUBMITTED' || bid.status === 'UNDER_REVIEW') && (
                        <button
                          onClick={() => handleWithdrawBid(bid.id)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                          title="Withdraw Bid"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                      
                      {bid.status === 'DRAFT' && (
                        <button
                          onClick={() => handleDeleteBid(bid.id)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                          title="Delete Bid"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Additional Info */}
              <div className="border-t pt-4 flex justify-between items-center text-sm text-gray-500">
                <span className="flex items-center space-x-2">
                  <Building className="h-4 w-4" />
                  <span>{bid.organization.name}</span>
                </span>
                <span>Updated {formatDate(bid.updatedAt)}</span>
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
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default BidList;
