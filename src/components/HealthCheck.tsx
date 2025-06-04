import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Activity } from 'lucide-react';
import { ENV, API_CONFIG } from '../config/env';
import { api } from '../services/api';

interface HealthStatus {
  status: 'healthy' | 'warning' | 'error' | 'loading';
  message: string;
  timestamp: string;
  details?: Record<string, any>;
}

interface SystemHealth {
  api: HealthStatus;
  database: HealthStatus;
  overall: HealthStatus;
}

const HealthCheck: React.FC = () => {
  const [health, setHealth] = useState<SystemHealth>({
    api: { status: 'loading', message: 'Checking API...', timestamp: new Date().toISOString() },
    database: { status: 'loading', message: 'Checking Database...', timestamp: new Date().toISOString() },
    overall: { status: 'loading', message: 'Checking System...', timestamp: new Date().toISOString() },
  });

  const checkAPIHealth = async (): Promise<HealthStatus> => {
    try {
      const response = await api.get('/health', { timeout: 5000 });
      return {
        status: 'healthy',
        message: 'API is responding normally',
        timestamp: new Date().toISOString(),
        details: {
          responseTime: response.headers['response-time'] || 'N/A',
          version: response.data?.version || 'Unknown',
        },
      };
    } catch (error: any) {
      return {
        status: 'error',
        message: error.response?.data?.message || 'API is not responding',
        timestamp: new Date().toISOString(),
        details: {
          statusCode: error.response?.status,
          error: error.message,
        },
      };
    }
  };

  const checkDatabaseHealth = async (): Promise<HealthStatus> => {
    try {
      // This would typically be a dedicated health endpoint
      const response = await api.get('/health/db', { timeout: 5000 });
      return {
        status: 'healthy',
        message: 'Database is connected and responsive',
        timestamp: new Date().toISOString(),
        details: response.data?.details || {},
      };
    } catch (error: any) {
      return {
        status: 'error',
        message: 'Database connection issues',
        timestamp: new Date().toISOString(),
        details: {
          error: error.message,
        },
      };
    }
  };

  const checkOverallHealth = (apiHealth: HealthStatus, dbHealth: HealthStatus): HealthStatus => {
    if (apiHealth.status === 'error' || dbHealth.status === 'error') {
      return {
        status: 'error',
        message: 'System has critical issues',
        timestamp: new Date().toISOString(),
      };
    }
    if (apiHealth.status === 'warning' || dbHealth.status === 'warning') {
      return {
        status: 'warning',
        message: 'System has some issues',
        timestamp: new Date().toISOString(),
      };
    }
    return {
      status: 'healthy',
      message: 'All systems operational',
      timestamp: new Date().toISOString(),
    };
  };

  const performHealthCheck = async () => {
    const [apiHealth, dbHealth] = await Promise.all([
      checkAPIHealth(),
      checkDatabaseHealth(),
    ]);

    const overallHealth = checkOverallHealth(apiHealth, dbHealth);

    setHealth({
      api: apiHealth,
      database: dbHealth,
      overall: overallHealth,
    });
  };

  useEffect(() => {
    performHealthCheck();
    
    // Set up periodic health checks every 30 seconds
    const interval = setInterval(performHealthCheck, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: HealthStatus['status']) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'loading':
        return <Activity className="h-5 w-5 text-blue-500 animate-pulse" />;
    }
  };

  const getStatusColor = (status: HealthStatus['status']) => {
    switch (status) {
      case 'healthy':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'loading':
        return 'border-blue-200 bg-blue-50';
    }
  };

  // Only show health check in development mode or when explicitly enabled
  if (ENV.NODE_ENV === 'production' && !ENV.ENABLE_ERROR_REPORTING) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-md">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center">
            <Activity className="h-4 w-4 mr-2" />
            System Health
          </h3>
          <button
            onClick={performHealthCheck}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            Refresh
          </button>
        </div>

        <div className="space-y-2">
          {/* Overall Health */}
          <div className={`p-2 rounded border ${getStatusColor(health.overall.status)}`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall</span>
              {getStatusIcon(health.overall.status)}
            </div>
            <p className="text-xs text-gray-600 mt-1">{health.overall.message}</p>
          </div>

          {/* API Health */}
          <div className={`p-2 rounded border ${getStatusColor(health.api.status)}`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">API</span>
              {getStatusIcon(health.api.status)}
            </div>
            <p className="text-xs text-gray-600 mt-1">{health.api.message}</p>
          </div>

          {/* Database Health */}
          <div className={`p-2 rounded border ${getStatusColor(health.database.status)}`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Database</span>
              {getStatusIcon(health.database.status)}
            </div>
            <p className="text-xs text-gray-600 mt-1">{health.database.message}</p>
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-400">
            Last checked: {new Date(health.overall.timestamp).toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HealthCheck;
