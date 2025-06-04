import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { tenderService, CreateTenderData } from '../../services/tenderService';
import { X, FileText, DollarSign, Calendar, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const tenderSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200, 'Title must be less than 200 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(5000, 'Description must be less than 5000 characters'),
  estimatedValue: z.number().min(1, 'Estimated value must be greater than 0'),
  submissionDeadline: z.string().min(1, 'Submission deadline is required'),
  category: z.enum(['GOODS', 'SERVICES', 'WORKS', 'CONSULTANCY']),
  procurementMethod: z.string().optional(),
  termsConditions: z.string().min(10, 'Terms and conditions must be at least 10 characters'),
  eligibilityCriteria: z.string().optional(),
  evaluationCriteria: z.string().optional(),
});

type TenderFormData = z.infer<typeof tenderSchema>;

interface CreateTenderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateTenderModal: React.FC<CreateTenderModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<TenderFormData>({
    resolver: zodResolver(tenderSchema),
    defaultValues: {
      procurementMethod: 'OPEN_TENDER',
      category: 'SERVICES'
    }
  });

  const categories = [
    { value: 'GOODS', label: 'Goods' },
    { value: 'SERVICES', label: 'Services' },
    { value: 'WORKS', label: 'Works' },
    { value: 'CONSULTANCY', label: 'Consultancy' }
  ];

  const procurementMethods = [
    { value: 'OPEN_TENDER', label: 'Open Tender' },
    { value: 'RESTRICTED_TENDER', label: 'Restricted Tender' },
    { value: 'DIRECT_PROCUREMENT', label: 'Direct Procurement' },
    { value: 'FRAMEWORK_AGREEMENT', label: 'Framework Agreement' }
  ];

  // Get minimum date (7 days from now as per backend validation)
  const getMinDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().split('T')[0];
  };

  const onSubmit = async (data: TenderFormData) => {
    try {
      setIsSubmitting(true);
      
      // Convert form data to API format
      const tenderData: CreateTenderData = {
        title: data.title,
        description: data.description,
        estimatedValue: data.estimatedValue,
        submissionDeadline: data.submissionDeadline,
        category: data.category,
        procurementMethod: data.procurementMethod,
        termsConditions: data.termsConditions,
        eligibilityCriteria: data.eligibilityCriteria ? JSON.parse(data.eligibilityCriteria) : {},
        evaluationCriteria: data.evaluationCriteria ? JSON.parse(data.evaluationCriteria) : {},
      };

      await tenderService.createTender(tenderData);
      toast.success('Tender created successfully');
      reset();
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error creating tender:', error);
      toast.error(error.response?.data?.message || 'Failed to create tender');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Create New Tender</h2>
              <p className="text-sm text-gray-600">Fill in the details to create a new procurement tender</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tender Title *
                </label>
                <input
                  type="text"
                  {...register('title')}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter a descriptive title for the tender"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  {...register('category')}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.category.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Procurement Method
                </label>
                <select
                  {...register('procurementMethod')}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {procurementMethods.map(method => (
                    <option key={method.value} value={method.value}>{method.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="h-4 w-4 inline mr-1" />
                  Estimated Value *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  {...register('estimatedValue', { valueAsNumber: true })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter estimated value in USD"
                />
                {errors.estimatedValue && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.estimatedValue.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Submission Deadline *
                </label>
                <input
                  type="date"
                  min={getMinDate()}
                  {...register('submissionDeadline')}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.submissionDeadline && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.submissionDeadline.message}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Deadline must be at least 7 days from today
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                {...register('description')}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Provide a detailed description of the procurement requirements..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          {/* Terms and Criteria */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              Terms and Criteria
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Terms and Conditions *
              </label>
              <textarea
                {...register('termsConditions')}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Specify the terms and conditions for this tender..."
              />
              {errors.termsConditions && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.termsConditions.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Eligibility Criteria (JSON format)
                </label>
                <textarea
                  {...register('eligibilityCriteria')}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  placeholder='{"minimumExperience": "3 years", "certifications": ["ISO 9001"]}'
                />
                {errors.eligibilityCriteria && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.eligibilityCriteria.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Evaluation Criteria (JSON format)
                </label>
                <textarea
                  {...register('evaluationCriteria')}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  placeholder='{"technical": "60%", "financial": "40%"}'
                />
                {errors.evaluationCriteria && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.evaluationCriteria.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <span>Create Tender</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTenderModal;
