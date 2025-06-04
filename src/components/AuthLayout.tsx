import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';
import Login from './auth/Login';
import Register from './auth/Register';

type AuthView = 'login' | 'register' | 'forgot-password';

const AuthLayout: React.FC = () => {
  const [currentView, setCurrentView] = useState<AuthView>('login');

  const switchToLogin = () => setCurrentView('login');
  const switchToRegister = () => setCurrentView('register');
  const switchToForgotPassword = () => setCurrentView('forgot-password');
  const renderCurrentView = () => {
    switch (currentView) {
      case 'login':
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <div className="bg-white shadow-sm">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                  <Link to="/" className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-gray-900">Government Procurement System</h1>
                      <p className="text-sm text-gray-600">Secure Access Portal</p>
                    </div>
                  </Link>
                  <Link 
                    to="/"
                    className="flex items-center text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Home
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center px-4 py-8">
              <Login 
                onSwitchToRegister={switchToRegister}
                onForgotPassword={switchToForgotPassword}
              />
            </div>
          </div>
        );
      case 'register':
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <div className="bg-white shadow-sm">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                  <Link to="/" className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-gray-900">Government Procurement System</h1>
                      <p className="text-sm text-gray-600">Registration Portal</p>
                    </div>
                  </Link>
                  <Link 
                    to="/"
                    className="flex items-center text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Home
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center px-4 py-8">
              <Register 
                onSwitchToLogin={switchToLogin}
              />
            </div>
          </div>
        );      case 'forgot-password':
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <div className="bg-white shadow-sm">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                  <Link to="/" className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-gray-900">Government Procurement System</h1>
                      <p className="text-sm text-gray-600">Password Recovery</p>
                    </div>
                  </Link>
                  <Link 
                    to="/"
                    className="flex items-center text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Home
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center px-4 py-8">
              <div className="max-w-md w-full space-y-8">
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Reset Password
                    </h2>
                    <p className="text-sm text-gray-600 mb-6">
                      Password reset functionality will be implemented soon.
                    </p>
                    <button
                      onClick={switchToLogin}
                      className="w-full py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    >
                      Back to Login
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return renderCurrentView();
};

export default AuthLayout;
