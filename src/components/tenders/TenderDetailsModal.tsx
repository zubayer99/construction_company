import React, { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, Building, FileText, Clock, Users } from 'lucide-react';
import { format } from 'date-fns';

interface TenderDetailsModalProps {
  tenderId: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmitBid?: () => void;
  userRole?: string;
}

interface TenderDetails {
  id: string;
  title: string;
  description: string;
  category: string;
  estimatedValue: number;
  publishedAt: string;
  submissionDeadline: string;
  technicalRequirements: string;
  evaluationCriteria: string;
  termsConditions: string;
  contactInfo?: string;
  organization: {
    name: string;
    type: string;
    contactEmail?: string;
    contactPhone?: string;
  };
  status: string;
  documents?: any[];
  bidsCount?: number;
}

const TenderDetailsModal: React.FC<TenderDetailsModalProps> = ({
  tenderId,
  isOpen,
  onClose,
  onSubmitBid,
  userRole
}) => {
  const [tender, setTender] = useState<TenderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && tenderId) {
      fetchTenderDetails();
    }
  }, [isOpen, tenderId]);

  const fetchTenderDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use public API for non-authenticated users or suppliers
      const endpoint = userRole === 'PROCUREMENT_OFFICER' 
        ? `/tenders/${tenderId}`
        : `/public/tenders/${tenderId}`;
      
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token && userRole !== 'guest') {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`http://localhost:5000${endpoint}`, {
        headers
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tender details');
      }

      const data = await response.json();
      setTender(data.data.tender);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tender details');
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

  const getDaysRemaining = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800';
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800';
      case 'CLOSED':
        return 'bg-red-100 text-red-800';
      case 'AWARDED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Tender Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="p-6 text-center">
              <div className="text-red-600 mb-4">{error}</div>
              <button
                onClick={fetchTenderDetails}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Try Again
              </button>
            </div>
          ) : tender ? (
            <div className="p-6 space-y-6">
              {/* Title and Status */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {tender.title}
                  </h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(tender.status)}`}>
                    {tender.status}
                  </span>
                </div>
                {tender.status === 'PUBLISHED' && userRole === 'SUPPLIER' && (
                  <button
                    onClick={onSubmitBid}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Submit Bid
                  </button>
                )}
              </div>

              {/* Key Information Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center text-gray-700">
                    <Building className="h-5 w-5 mr-3 text-gray-400" />
                    <div>
                      <div className="font-medium">{tender.organization.name}</div>
                      <div className="text-sm text-gray-500">{tender.organization.type}</div>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-700">
                    <DollarSign className="h-5 w-5 mr-3 text-gray-400" />
                    <div>
                      <div className="font-medium">Estimated Value</div>
                      <div className="text-lg font-semibold text-green-600">
                        {formatCurrency(tender.estimatedValue)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-700">
                    <FileText className="h-5 w-5 mr-3 text-gray-400" />
                    <div>
                      <div className="font-medium">Category</div>
                      <div className="text-sm">{tender.category}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center text-gray-700">
                    <Calendar className="h-5 w-5 mr-3 text-gray-400" />
                    <div>
                      <div className="font-medium">Published Date</div>
                      <div className="text-sm">
                        {format(new Date(tender.publishedAt), 'PPP')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-700">
                    <Clock className="h-5 w-5 mr-3 text-gray-400" />
                    <div>
                      <div className="font-medium">Submission Deadline</div>
                      <div className="text-sm">
                        {format(new Date(tender.submissionDeadline), 'PPP p')}
                      </div>
                      <div className={`text-sm font-medium ${
                        getDaysRemaining(tender.submissionDeadline) > 7 
                          ? 'text-green-600' 
                          : getDaysRemaining(tender.submissionDeadline) > 0 
                            ? 'text-orange-600' 
                            : 'text-red-600'
                      }`}>
                        {getDaysRemaining(tender.submissionDeadline) > 0 
                          ? `${getDaysRemaining(tender.submissionDeadline)} days remaining`
                          : 'Deadline passed'
                        }
                      </div>
                    </div>
                  </div>

                  {tender.bidsCount !== undefined && (
                    <div className="flex items-center text-gray-700">
                      <Users className="h-5 w-5 mr-3 text-gray-400" />
                      <div>
                        <div className="font-medium">Bids Received</div>
                        <div className="text-sm">{tender.bidsCount} bids</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Description</h4>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {tender.description}
                </p>
              </div>

              {/* Technical Requirements */}
              {tender.technicalRequirements && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Technical Requirements</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {tender.technicalRequirements}
                    </p>
                  </div>
                </div>
              )}

              {/* Evaluation Criteria */}
              {tender.evaluationCriteria && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Evaluation Criteria</h4>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {tender.evaluationCriteria}
                    </p>
                  </div>
                </div>
              )}

              {/* Terms and Conditions */}
              {tender.termsConditions && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Terms and Conditions</h4>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {tender.termsConditions}
                    </p>
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  {tender.organization.contactEmail && (
                    <div className="text-gray-700">
                      <span className="font-medium">Email:</span> {tender.organization.contactEmail}
                    </div>
                  )}
                  {tender.organization.contactPhone && (
                    <div className="text-gray-700">
                      <span className="font-medium">Phone:</span> {tender.organization.contactPhone}
                    </div>
                  )}
                  {tender.contactInfo && (
                    <div className="text-gray-700">
                      <span className="font-medium">Additional Info:</span> {tender.contactInfo}
                    </div>
                  )}
                </div>
              </div>

              {/* Documents */}
              {tender.documents && tender.documents.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Documents</h4>
                  <div className="space-y-2">
                    {tender.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 mr-3 text-gray-400" />
                          <span className="text-gray-700">{doc.name || `Document ${index + 1}`}</span>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          {tender?.status === 'PUBLISHED' && userRole === 'SUPPLIER' && (
            <button
              onClick={onSubmitBid}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Submit Bid
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TenderDetailsModal;
