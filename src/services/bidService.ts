import api from './api';

export interface Bid {
  id: string;
  tenderId: string;
  organizationId: string;
  totalAmount: number;
  proposal: string;
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'ACCEPTED' | 'REJECTED';
  technicalScore?: number;
  financialScore?: number;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
  tender: {
    id: string;
    title: string;
    submissionDeadline: string;
    estimatedValue: number;
  };
  organization: {
    name: string;
    taxId?: string;
  };
  documents?: any[];
}

export interface CreateBidData {
  tenderId: string;
  proposedPrice: number;
  technicalProposal: string;
  deliveryTimeframe?: string;
  validityPeriod?: number;
  terms?: string;
  comments?: string;
}

export interface BidFilters {
  status?: string;
  tenderId?: string;
  page?: number;
  limit?: number;
}

export interface BidResponse {
  status: string;
  results: number;
  totalResults: number;
  totalPages: number;
  currentPage: number;
  data: {
    bids: Bid[];
  };
}

class BidService {
  // Get all bids with filters
  async getBids(filters: BidFilters = {}): Promise<BidResponse> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/bids?${params.toString()}`);
    return response.data;
  }

  // Get bid by ID
  async getBidById(id: string): Promise<{ status: string; data: { bid: Bid } }> {
    const response = await api.get(`/bids/${id}`);
    return response.data;
  }

  // Create new bid
  async createBid(bidData: CreateBidData): Promise<{ status: string; data: { bid: Bid } }> {
    const response = await api.post('/bids', bidData);
    return response.data;
  }

  // Update bid
  async updateBid(id: string, bidData: Partial<CreateBidData>): Promise<{ status: string; data: { bid: Bid } }> {
    const response = await api.patch(`/bids/${id}`, bidData);
    return response.data;
  }

  // Withdraw bid
  async withdrawBid(id: string): Promise<{ status: string; message: string; data: { bid: Bid } }> {
    const response = await api.patch(`/bids/${id}/withdraw`);
    return response.data;
  }

  // Evaluate bid (procurement officers only)
  async evaluateBid(id: string, evaluation: { technicalScore?: number; financialScore?: number; status?: string }): Promise<{ status: string; message: string; data: { bid: Bid } }> {
    const response = await api.patch(`/bids/${id}/evaluate`, evaluation);
    return response.data;
  }

  // Delete bid (only drafts)
  async deleteBid(id: string): Promise<{ status: string; data: null }> {
    const response = await api.delete(`/bids/${id}`);
    return response.data;
  }
}

export const bidService = new BidService();
export default bidService;
