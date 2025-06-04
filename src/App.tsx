import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Lazy load components for better performance
const Home = React.lazy(() => import('./pages/Home'));
const AuthLayout = React.lazy(() => import('./components/AuthLayout'));
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const ProtectedRoute = React.lazy(() => import('./components/ProtectedRoute'));

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Initializing Al Fatah Enterprise..." />;
  }

  return (
    <Router>
      <Suspense fallback={<LoadingSpinner fullScreen text="Loading page..." />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/auth" 
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthLayout />} 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="*" 
            element={<Navigate to="/" replace />} 
          />
        </Routes>
      </Suspense>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </Router>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;