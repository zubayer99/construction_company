import api from './api';
import Cookies from 'js-cookie';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  organizationId?: string;
  organization?: {
    id: string;
    name: string;
    type: string;
  };
  emailVerified: boolean;
  mfaEnabled: boolean;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  organizationName?: string;
  userType?: string;
}

export interface AuthResponse {
  status: string;
  message?: string;
  token?: string;
  refreshToken?: string;
  user?: User;
  userId?: string; // For MFA flow
}

export interface MFASetupResponse {
  message: string;
  qrCode: string;
  secret: string;
}

export interface MFAVerification {
  token: string;
  userId: string;
}

class AuthService {
  async register(data: RegisterData): Promise<AuthResponse> {
    // Transform userType to role for backend compatibility
    const requestData = {
      ...data,
      role: data.userType,
      userType: undefined
    };
    const response = await api.post('/auth/register', requestData);
    return response.data;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    
    if (response.data.token) {
      this.setTokens(response.data.token, response.data.refreshToken);
    }
    
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
    } finally {
      this.clearTokens();
    }
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    const response = await api.get(`/auth/verify-email/${token}`);
    return response.data;
  }

  async resendVerification(email: string): Promise<{ message: string }> {
    const response = await api.post('/auth/resend-verification', { email });
    return response.data;
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  }

  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    const response = await api.patch(`/auth/reset-password/${token}`, { password });
    return response.data;
  }

  async getProfile(): Promise<{ status: string; data: { user: User } }> {
    const response = await api.get('/auth/profile');
    return response.data;
  }

  async updateProfile(data: Partial<User>): Promise<{ status: string; data: { user: User }; message: string }> {
    const response = await api.patch('/auth/update-profile', data);
    return response.data;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    const response = await api.patch('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  }

  async setupMFA(): Promise<MFASetupResponse> {
    const response = await api.post('/auth/setup-mfa');
    return response.data;
  }

  async verifyMFA(data: MFAVerification): Promise<AuthResponse> {
    const response = await api.post('/auth/verify-mfa', data);
    
    if (response.data.token) {
      this.setTokens(response.data.token, response.data.refreshToken);
    }
    
    return response.data;
  }

  async disableMFA(mfaToken: string): Promise<{ message: string }> {
    const response = await api.post('/auth/disable-mfa', { mfaToken });
    return response.data;
  }

  async getSessions(): Promise<{ status: string; data: { sessions: any[] } }> {
    const response = await api.get('/auth/sessions');
    return response.data;
  }

  async revokeSession(sessionId: string): Promise<{ status: string; message: string }> {
    const response = await api.delete(`/auth/sessions/${sessionId}`);
    return response.data;
  }

  async revokeAllSessions(): Promise<{ status: string; message: string }> {
    const response = await api.delete('/auth/sessions');
    return response.data;
  }

  setTokens(token: string, refreshToken?: string): void {
    localStorage.setItem('token', token);
    Cookies.set('token', token, { expires: 1 }); // 1 day
    
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
      Cookies.set('refreshToken', refreshToken, { expires: 7 }); // 7 days
    }
  }

  clearTokens(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    Cookies.remove('token');
    Cookies.remove('refreshToken');
  }

  getToken(): string | null {
    return localStorage.getItem('token') || Cookies.get('token') || null;
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken') || Cookies.get('refreshToken') || null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();
export default authService;
