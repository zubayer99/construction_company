import api from './api';
import { API_CONFIG } from '../config/env';

// Company Information
export interface CompanyInfo {
  id?: string;
  name: string;
  tagline?: string;
  description: string;
  mission?: string;
  vision?: string;
  founded?: string; // Keep as string for now, will be ISO date string
  address: string; // Was 'headquarters'
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
  website?: string;
  logoUrl?: string; // Was 'logo'
  bannerUrl?: string;
  socialMedia?: Record<string, string>; // Assuming JSON object
  businessHours?: Record<string, string>; // Assuming JSON object
  isActive?: boolean; // Added from schema, assuming default true is handled by backend
  createdAt?: string;
  updatedAt?: string;
}

// Service
export interface Service {
  id?: string;
  title: string;
  description: string;
  shortDesc?: string; // Was 'shortDescription'
  imageUrl?: string;
  iconName?: string;
  features?: string[]; // Assuming JSON array of strings
  price?: number; // Assuming Decimal maps to number
  currency?: string;
  isActive: boolean;
  sortOrder?: number; // Was 'order'
  createdAt?: string;
  updatedAt?: string;
}

// Project
export interface Project {
  id?: string;
  title: string;
  description: string;
  shortDesc?: string; // Was 'shortDescription'
  serviceId?: string;
  client?: string; // Was 'clientName'
  startDate?: string; // Keep as string
  endDate?: string; // Keep as string
  status: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED'; // Aligned with schema enum
  imageUrl?: string;
  gallery?: string[]; // Assuming JSON array of image URLs, was 'images'
  technologies?: string[]; // Assuming JSON array of strings
  projectUrl?: string;
  githubUrl?: string;
  isFeatured: boolean;
  isActive?: boolean; // Added from schema
  sortOrder?: number; // Was 'order'
  createdAt?: string;
  updatedAt?: string;
}

// Team Member
export interface TeamMember {
  id?: string;
  name: string;
  position: string;
  bio?: string;
  image?: string; // From schema
  imageUrl?: string; // Was 'avatar', schema also has imageUrl
  email?: string;
  phone?: string;
  linkedinUrl?: string; // Specific field from schema
  twitterUrl?: string; // Specific field from schema
  // socialLinks?: Record<string, string>; // Replaced by specific links for now
  skills?: string[]; // Assuming JSON array of strings
  isActive: boolean;
  sortOrder?: number; // Was 'order', schema also has displayOrder
  displayOrder?: number; // From schema
  createdAt?: string;
  updatedAt?: string;
}

// Testimonial
export interface Testimonial {
  id?: string;
  name: string;
  clientName?: string; // From schema
  clientCompany?: string; // From schema
  position?: string;
  company?: string;
  content: string;
  rating?: number; // Schema is Int, number is fine
  imageUrl?: string; // Was 'avatar'
  isActive: boolean;
  // isFeatured: boolean; // This was in service but not in schema, removing for now
  sortOrder?: number; // Was 'order', schema also has displayOrder
  displayOrder?: number; // From schema
  createdAt?: string;
  updatedAt?: string;
}

// Blog Post
export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  authorId: string;
  categoryId?: string;
  imageUrl?: string; // From schema
  featuredImage?: string; // This was in service, schema also has featuredImage
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'; // Aligned with schema enum
  publishedAt?: string; // Keep as string
  isActive?: boolean; // From schema
  isFeatured?: boolean; // From schema
  viewCount?: number; // From schema
  views?: number; // From schema, seems duplicative with viewCount
  tags?: string[]; // Assuming JSON array of strings
  seoTitle?: string; // From schema
  seoDesc?: string; // From schema
  author?: { // Keep as is, assuming backend populates
    name: string;
    email: string; // Note: schema User model doesn't directly link email like this in a simple query
  };
  category?: { // Keep as is, assuming backend populates
    name: string;
    slug: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

// Contact Inquiry
export interface ContactInquiry {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string; // From schema
  subject: string;
  message: string;
  serviceInterest?: string; // From schema
  status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'; // Aligned with schema enum, was PENDING, IN_PROGRESS, RESOLVED
  assignedTo?: string; // From schema
  response?: string; // From schema
  notes?: string; // From schema
  respondedAt?: string; // From schema, keep as string
  source?: string; // From schema
  createdAt?: string;
  updatedAt?: string;
}

// Newsletter Subscriber
export interface NewsletterSubscriber {
  id?: string;
  email: string;
  firstName?: string; // Was 'name', split based on schema
  lastName?: string; // From schema
  isActive: boolean;
  subscribedAt?: string; // Keep as string
  unsubscribeToken?: string; // From schema
  unsubscribedAt?: string; // From schema, keep as string
  createdAt?: string; // Added from schema
  updatedAt?: string; // Added from schema
}

// Company API
export const companyService = {
  get: (): Promise<CompanyInfo> => 
    api.get('/api/v1/company').then(res => res.data),
  
  update: (data: Partial<CompanyInfo>): Promise<CompanyInfo> =>
    api.put('/api/v1/company', data).then(res => res.data),
};

// Services API
export const servicesService = {
  getAll: (): Promise<Service[]> =>
    api.get('/api/v1/services').then(res => res.data),
  
  getPublic: (): Promise<Service[]> =>
    api.get('/api/v1/services/public').then(res => res.data),
  
  getById: (id: string): Promise<Service> =>
    api.get(`/api/v1/services/${id}`).then(res => res.data),
  
  create: (data: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>): Promise<Service> =>
    api.post('/api/v1/services', data).then(res => res.data),
  
  update: (id: string, data: Partial<Service>): Promise<Service> =>
    api.put(`/api/v1/services/${id}`, data).then(res => res.data),
  
  delete: (id: string): Promise<void> =>
    api.delete(`/api/v1/services/${id}`),
};

// Projects API
export const projectsService = {
  getAll: (): Promise<Project[]> =>
    api.get('/api/v1/projects').then(res => res.data),
  
  getPublic: (): Promise<Project[]> =>
    api.get('/api/v1/projects/public').then(res => res.data),
  
  getFeatured: (): Promise<Project[]> =>
    api.get('/api/v1/projects/featured').then(res => res.data),
  
  getById: (id: string): Promise<Project> =>
    api.get(`/api/v1/projects/${id}`).then(res => res.data),
  
  create: (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> =>
    api.post('/api/v1/projects', data).then(res => res.data),
  
  update: (id: string, data: Partial<Project>): Promise<Project> =>
    api.put(`/api/v1/projects/${id}`, data).then(res => res.data),
  
  delete: (id: string): Promise<void> =>
    api.delete(`/api/v1/projects/${id}`),
};

// Team API
export const teamService = {
  getAll: (): Promise<TeamMember[]> =>
    api.get('/api/v1/team').then(res => res.data),
  
  getPublic: (): Promise<TeamMember[]> =>
    api.get('/api/v1/team/public').then(res => res.data),
  
  getById: (id: string): Promise<TeamMember> =>
    api.get(`/api/v1/team/${id}`).then(res => res.data),
  
  create: (data: Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>): Promise<TeamMember> =>
    api.post('/api/v1/team', data).then(res => res.data),
  
  update: (id: string, data: Partial<TeamMember>): Promise<TeamMember> =>
    api.put(`/api/v1/team/${id}`, data).then(res => res.data),
  
  delete: (id: string): Promise<void> =>
    api.delete(`/api/v1/team/${id}`),
};

// Testimonials API
export const testimonialsService = {
  getAll: (): Promise<Testimonial[]> =>
    api.get('/api/v1/testimonials').then(res => res.data),
  
  getPublic: (): Promise<Testimonial[]> =>
    api.get('/api/v1/testimonials/public').then(res => res.data),
  
  getFeatured: (): Promise<Testimonial[]> =>
    api.get('/api/v1/testimonials/featured').then(res => res.data),
  
  getById: (id: string): Promise<Testimonial> =>
    api.get(`/api/v1/testimonials/${id}`).then(res => res.data),
  
  create: (data: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>): Promise<Testimonial> =>
    api.post('/api/v1/testimonials', data).then(res => res.data),
  
  update: (id: string, data: Partial<Testimonial>): Promise<Testimonial> =>
    api.put(`/api/v1/testimonials/${id}`, data).then(res => res.data),
  
  delete: (id: string): Promise<void> =>
    api.delete(`/api/v1/testimonials/${id}`),
};

// Blog API
export const blogService = {
  getAll: (): Promise<BlogPost[]> =>
    api.get('/api/v1/blog').then(res => res.data),
  
  getPublished: (): Promise<BlogPost[]> =>
    api.get('/api/v1/blog/published').then(res => res.data),
  
  getBySlug: (slug: string): Promise<BlogPost> =>
    api.get(`/api/v1/blog/slug/${slug}`).then(res => res.data),
  
  getById: (id: string): Promise<BlogPost> =>
    api.get(`/api/v1/blog/${id}`).then(res => res.data),
  
  create: (data: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'author'>): Promise<BlogPost> =>
    api.post('/api/v1/blog', data).then(res => res.data),
  
  update: (id: string, data: Partial<BlogPost>): Promise<BlogPost> =>
    api.put(`/api/v1/blog/${id}`, data).then(res => res.data),
  
  delete: (id: string): Promise<void> =>
    api.delete(`/api/v1/blog/${id}`),
};

// Contact API
export const contactService = {
  submit: (data: Omit<ContactInquiry, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<ContactInquiry> =>
    api.post('/api/v1/contact', data).then(res => res.data),
  
  getAll: (): Promise<ContactInquiry[]> =>
    api.get('/api/v1/contact').then(res => res.data),
  
  getById: (id: string): Promise<ContactInquiry> =>
    api.get(`/api/v1/contact/${id}`).then(res => res.data),
  
  updateStatus: (id: string, status: ContactInquiry['status']): Promise<ContactInquiry> =>
    api.put(`/api/v1/contact/${id}/status`, { status }).then(res => res.data),
  
  delete: (id: string): Promise<void> =>
    api.delete(`/api/v1/contact/${id}`),
};

// Newsletter API
export const newsletterService = {
  subscribe: (email: string, firstName?: string, lastName?: string): Promise<NewsletterSubscriber> =>
    api.post('/api/v1/newsletter/subscribe', { email, firstName, lastName }).then(res => res.data),
  
  unsubscribe: (email: string): Promise<void> =>
    api.post('/api/v1/newsletter/unsubscribe', { email }),
  
  getAll: (): Promise<NewsletterSubscriber[]> =>
    api.get('/api/v1/newsletter').then(res => res.data),
  
  delete: (id: string): Promise<void> =>
    api.delete(`/api/v1/newsletter/${id}`),
};
