import { api } from './api';

export interface PublicTenderQuery {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PublicTenderResponse {
  status: string;
  data: {
    tenders: any[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface TenderDetailsResponse {
  status: string;
  data: {
    tender: any;
  };
}

export const publicTenderService = {
  // Get all public tenders (no authentication required)
  getPublicTenders: async (query: PublicTenderQuery = {}): Promise<PublicTenderResponse> => {
    const params = new URLSearchParams();
    
    if (query.page) params.append('page', query.page.toString());
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.category) params.append('category', query.category);
    if (query.search) params.append('search', query.search);
    if (query.sortBy) params.append('sortBy', query.sortBy);
    if (query.sortOrder) params.append('sortOrder', query.sortOrder);

    const queryString = params.toString();
    const url = `/public/tenders${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(`${api.baseURL}${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  // Get tender details by ID (no authentication required for public tenders)
  getTenderDetails: async (id: string): Promise<TenderDetailsResponse> => {
    const response = await fetch(`${api.baseURL}/public/tenders/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  // Get tender statistics (no authentication required)
  getTenderStats: async () => {
    const response = await fetch(`${api.baseURL}/public/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },
};

export default publicTenderService;
