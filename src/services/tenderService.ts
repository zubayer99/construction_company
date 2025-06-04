import api from './api';

export interface Tender {
  id: string;
  title: string;
  description: string;
  estimatedValue: number;
  submissionDeadline: string;
  openingDate: string;
  category: 'GOODS' | 'SERVICES' | 'WORKS' | 'CONSULTANCY';
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'EVALUATED' | 'AWARDED';
  procurementMethod: string;
  eligibilityCriteria: any;
  evaluationCriteria: any;
  termsConditions: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    firstName: string;
    lastName: string;
    organization: {
      name: string;
      type?: string;
    };
  };
  documents?: any[];
  bids?: any[];
  _count?: {
    bids: number;
  };
}

export interface CreateTenderData {
  title: string;
  description: string;
  estimatedValue: number;
  submissionDeadline: string;
  category: 'GOODS' | 'SERVICES' | 'WORKS' | 'CONSULTANCY';
  procurementMethod?: string;
  eligibilityCriteria?: any;
  evaluationCriteria?: any;
  termsConditions: string;
}

export interface TenderFilters {
  status?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export interface TenderResponse {
  status: string;
  results: number;
  totalResults: number;
  totalPages: number;
  currentPage: number;
  data: {
    tenders: Tender[];
  };
}

class TenderService {
  // Get all tenders with filters
  async getTenders(filters: TenderFilters = {}): Promise<TenderResponse> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/tenders?${params.toString()}`);
    return response.data;
  }

  // Get tender by ID
  async getTenderById(id: string): Promise<{ status: string; data: { tender: Tender } }> {
    const response = await api.get(`/tenders/${id}`);
    return response.data;
  }

  // Create new tender
  async createTender(tenderData: CreateTenderData): Promise<{ status: string; data: { tender: Tender } }> {
    const response = await api.post('/tenders', tenderData);
    return response.data;
  }

  // Update tender
  async updateTender(id: string, tenderData: Partial<CreateTenderData>): Promise<{ status: string; data: { tender: Tender } }> {
    const response = await api.patch(`/tenders/${id}`, tenderData);
    return response.data;
  }

  // Publish tender
  async publishTender(id: string): Promise<{ status: string; message: string; data: { tender: Tender } }> {
    const response = await api.patch(`/tenders/${id}/publish`);
    return response.data;
  }

  // Cancel tender
  async cancelTender(id: string): Promise<{ status: string; message: string; data: { tender: Tender } }> {
    const response = await api.patch(`/tenders/${id}/cancel`);
    return response.data;
  }

  // Delete tender (only drafts)
  async deleteTender(id: string): Promise<{ status: string; data: null }> {
    const response = await api.delete(`/tenders/${id}`);
    return response.data;
  }

  // Get public tenders (no auth required)
  async getPublicTenders(): Promise<{ status: string; results: number; data: { tenders: Tender[] } }> {
    const response = await api.get('/public/tenders');
    return response.data;
  }

  // Search public tenders
  async searchPublicTenders(query: string, filters: { category?: string; minValue?: number; maxValue?: number } = {}): Promise<{ status: string; results: number; data: { tenders: Tender[] } }> {
    const params = new URLSearchParams();
    params.append('q', query);
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/public/search/tenders?${params.toString()}`);
    return response.data;
  }
}

export const tenderService = new TenderService();
export default tenderService;
