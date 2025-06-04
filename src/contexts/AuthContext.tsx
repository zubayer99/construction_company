import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, authService } from '../services/authService';
import toast from 'react-hot-toast';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthAction {
  type: 
    | 'AUTH_START'
    | 'AUTH_SUCCESS'
    | 'AUTH_FAILURE'
    | 'LOGOUT'
    | 'SET_USER'
    | 'CLEAR_ERROR';
  payload?: any;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload.error,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        error: null,
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

interface AuthContextType extends AuthState {
  login: (email?: string, password?: string, mfaToken?: string, userId?: string) => Promise<any>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  verifyMFA: (token: string, userId: string) => Promise<void>;
  setupMFA: () => Promise<{ qrCode: string; secret: string }>;
  disableMFA: (token: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  clearError: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check authentication status on app load
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    if (!authService.isAuthenticated()) {
      return;
    }

    try {
      dispatch({ type: 'AUTH_START' });
      const response = await authService.getProfile();
      
      if (response.data.user) {
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user: response.data.user },
        });
      }
    } catch (error: any) {
      console.error('Auth check failed:', error);
      authService.clearTokens();
      dispatch({
        type: 'AUTH_FAILURE',
        payload: { error: 'Authentication expired' },
      });
    }
  };
  const login = async (email?: string, password?: string, mfaToken?: string, userId?: string) => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      let response;
      
      if (mfaToken && userId) {
        // MFA verification
        response = await authService.verifyMFA({ token: mfaToken, userId });
      } else if (email && password) {
        // Initial login
        response = await authService.login({ email, password });
      } else {
        throw new Error('Invalid login parameters');
      }
      
      if (response.status === 'success' && response.user) {
        // Complete login
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user: response.user },
        });
        return { status: 'success' };
      } else if (response.message === 'MFA required' && response.userId) {
        // MFA required
        dispatch({ type: 'CLEAR_ERROR' });
        return { status: 'mfa_required', userId: response.userId };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      dispatch({
        type: 'AUTH_FAILURE',
        payload: { error: errorMessage },
      });
      toast.error(errorMessage);
      throw error;
    }
  };

  const register = async (data: any) => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const response = await authService.register(data);
      
      if (response.user) {
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user: response.user },
        });
        toast.success(response.message || 'Registration successful! Please check your email to verify your account.');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      dispatch({
        type: 'AUTH_FAILURE',
        payload: { error: errorMessage },
      });
      toast.error(errorMessage);
      throw error;
    }
  };

  const verifyMFA = async (token: string, userId: string) => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const response = await authService.verifyMFA({ token, userId });
      
      if (response.user) {
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user: response.user },
        });
        toast.success('MFA verification successful!');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'MFA verification failed';
      dispatch({
        type: 'AUTH_FAILURE',
        payload: { error: errorMessage },
      });
      toast.error(errorMessage);
      throw error;
    }
  };

  const setupMFA = async () => {
    try {
      const response = await authService.setupMFA();
      toast.success('MFA setup initiated. Scan the QR code with your authenticator app.');
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'MFA setup failed';
      toast.error(errorMessage);
      throw error;
    }
  };

  const disableMFA = async (token: string) => {
    try {
      await authService.disableMFA(token);
      
      // Refresh user profile to get updated MFA status
      await checkAuth();
      toast.success('MFA disabled successfully');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to disable MFA';
      toast.error(errorMessage);
      throw error;
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      const response = await authService.updateProfile(data);
      
      if (response.data.user) {
        dispatch({
          type: 'SET_USER',
          payload: { user: response.data.user },
        });
        toast.success(response.message || 'Profile updated successfully');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update profile';
      toast.error(errorMessage);
      throw error;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await authService.changePassword(currentPassword, newPassword);
      toast.success('Password changed successfully');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to change password';
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      dispatch({ type: 'LOGOUT' });
      toast.success('Logged out successfully');
    } catch (error: any) {
      // Still log out locally even if API call fails
      dispatch({ type: 'LOGOUT' });
      toast.success('Logged out successfully');
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    verifyMFA,
    setupMFA,
    disableMFA,
    updateProfile,
    changePassword,
    clearError,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
