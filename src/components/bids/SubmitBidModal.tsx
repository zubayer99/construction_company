import React, { useState } from 'react';
import { X, DollarSign, FileText, Clock, AlertCircle, Upload, Trash2 } from 'lucide-react';
import { bidService } from '../../services/bidService';
import toast from 'react-hot-toast';

interface SubmitBidModalProps {
  tender: {
    id: string;
    title: string;
    estimatedValue: number;
    submissionDeadline: string;
    category: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface BidFormData {
  proposedPrice: string;
  technicalProposal: string;
  deliveryTimeframe: string;
  validityPeriod: string;
  terms: string;
  comments: string;
}

const SubmitBidModal: React.FC<SubmitBidModalProps> = ({
  tender,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState<BidFormData>({
    proposedPrice: '',
    technicalProposal: '',
    deliveryTimeframe: '',
    validityPeriod: '90',
    terms: '',
    comments: ''
  });
  
  const [documents, setDocuments] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof BidFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setDocuments(prev => [...prev, ...files]);
  };

  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.proposedPrice) {
      newErrors.proposedPrice = 'Proposed price is required';
    } else if (isNaN(Number(formData.proposedPrice)) || Number(formData.proposedPrice) <= 0) {
      newErrors.proposedPrice = 'Please enter a valid price';
    }

    if (!formData.technicalProposal || formData.technicalProposal.length < 50) {
      newErrors.technicalProposal = 'Technical proposal must be at least 50 characters';
    }

    if (!formData.deliveryTimeframe) {
      newErrors.deliveryTimeframe = 'Delivery timeframe is required';
    }

    if (!formData.validityPeriod || isNaN(Number(formData.validityPeriod)) || Number(formData.validityPeriod) < 1) {
      newErrors.validityPeriod = 'Please enter a valid validity period';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    try {
      const bidData = {
        tenderId: tender.id,
        proposedPrice: Number(formData.proposedPrice),
        technicalProposal: formData.technicalProposal,
        deliveryTimeframe: formData.deliveryTimeframe,
        validityPeriod: Number(formData.validityPeriod),
        terms: formData.terms || undefined,
        comments: formData.comments || undefined
      };

      await bidService.createBid(bidData);
      
      toast.success('Bid submitted successfully!');
      onSuccess();
      onClose();
      
      // Reset form
      setFormData({
        proposedPrice: '',
        technicalProposal: '',
        deliveryTimeframe: '',
        validityPeriod: '90',
        terms: '',
        comments: ''
      });
      setDocuments([]);
      setErrors({});
      
    } catch (error: any) {
      console.error('Bid submission error:', error);
      toast.error(error.response?.data?.message || 'Failed to submit bid');
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

  if (!isOpen) return null;

  const daysRemaining = getDaysRemaining(tender.submissionDeadline);
  const isUrgent = daysRemaining <= 3;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Submit Bid</h2>
            <p className="text-gray-600 mt-1">{tender.title}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Deadline Warning */}
        {isUrgent && (
          <div className="bg-orange-50 border-l-4 border-orange-400 p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-orange-400 mr-3" />
              <div>
                <p className="text-orange-800 font-medium">
                  Urgent: Only {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} remaining to submit your bid!
                </p>
                <p className="text-orange-700 text-sm">
                  Deadline: {new Date(tender.submissionDeadline).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="p-6 space-y-6">
            {/* Tender Info */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Category:</span>
                  <div className="text-gray-900">{tender.category}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Estimated Value:</span>
                  <div className="text-gray-900 font-semibold">
                    {formatCurrency(tender.estimatedValue)}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Deadline:</span>
                  <div className={`font-semibold ${isUrgent ? 'text-orange-600' : 'text-gray-900'}`}>
                    {daysRemaining > 0 ? `${daysRemaining} days` : 'Expired'}
                  </div>
                </div>
              </div>
            </div>

            {/* Proposed Price */}
            <div>
              <label htmlFor="proposedPrice" className="block text-sm font-medium text-gray-700 mb-2">
                Proposed Price (BDT) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="proposedPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.proposedPrice}
                  onChange={(e) => handleInputChange('proposedPrice', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.proposedPrice ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your proposed price"
                />
              </div>
              {errors.proposedPrice && (
                <p className="mt-1 text-sm text-red-600">{errors.proposedPrice}</p>
              )}
            </div>

            {/* Technical Proposal */}
            <div>
              <label htmlFor="technicalProposal" className="block text-sm font-medium text-gray-700 mb-2">
                Technical Proposal *
              </label>
              <textarea
                id="technicalProposal"
                rows={6}
                value={formData.technicalProposal}
                onChange={(e) => handleInputChange('technicalProposal', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.technicalProposal ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Describe your technical approach, methodology, and qualifications. Include details about your team, experience, and how you plan to deliver the project requirements."
              />
              <div className="flex justify-between mt-1">
                {errors.technicalProposal && (
                  <p className="text-sm text-red-600">{errors.technicalProposal}</p>
                )}
                <p className="text-sm text-gray-500 ml-auto">
                  {formData.technicalProposal.length}/50 minimum characters
                </p>
              </div>
            </div>

            {/* Delivery Timeframe and Validity Period */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="deliveryTimeframe" className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Timeframe *
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="deliveryTimeframe"
                    type="text"
                    value={formData.deliveryTimeframe}
                    onChange={(e) => handleInputChange('deliveryTimeframe', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.deliveryTimeframe ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., 30 days, 3 months"
                  />
                </div>
                {errors.deliveryTimeframe && (
                  <p className="mt-1 text-sm text-red-600">{errors.deliveryTimeframe}</p>
                )}
              </div>

              <div>
                <label htmlFor="validityPeriod" className="block text-sm font-medium text-gray-700 mb-2">
                  Bid Validity (Days) *
                </label>
                <input
                  id="validityPeriod"
                  type="number"
                  min="1"
                  max="365"
                  value={formData.validityPeriod}
                  onChange={(e) => handleInputChange('validityPeriod', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.validityPeriod ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="90"
                />
                {errors.validityPeriod && (
                  <p className="mt-1 text-sm text-red-600">{errors.validityPeriod}</p>
                )}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div>
              <label htmlFor="terms" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Terms & Conditions
              </label>
              <textarea
                id="terms"
                rows={3}
                value={formData.terms}
                onChange={(e) => handleInputChange('terms', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Any additional terms, conditions, or requirements you want to include with your bid"
              />
            </div>

            {/* Comments */}
            <div>
              <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Comments
              </label>
              <textarea
                id="comments"
                rows={3}
                value={formData.comments}
                onChange={(e) => handleInputChange('comments', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Any additional information or clarifications"
              />
            </div>

            {/* Document Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supporting Documents
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <label htmlFor="documents" className="cursor-pointer">
                  <span className="text-blue-600 hover:text-blue-700 font-medium">
                    Click to upload files
                  </span>
                  <span className="text-gray-500"> or drag and drop</span>
                  <input
                    id="documents"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-gray-500 text-sm mt-2">
                  PDF, DOC, DOCX, XLS, XLSX files up to 10MB each
                </p>
              </div>

              {/* Uploaded Documents */}
              {documents.length > 0 && (
                <div className="mt-4 space-y-2">
                  {documents.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-3 text-gray-400" />
                        <span className="text-gray-700 text-sm">{file.name}</span>
                        <span className="text-gray-500 text-xs ml-2">
                          ({(file.size / 1024 / 1024).toFixed(1)} MB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDocument(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Disclaimer */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">Important Notice:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Ensure all information provided is accurate and complete</li>
                    <li>Once submitted, bids cannot be modified</li>
                    <li>Late submissions will not be accepted</li>
                    <li>All bids will be evaluated based on the published criteria</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || daysRemaining <= 0}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Submitting...
              </>
            ) : (
              'Submit Bid'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmitBidModal;
