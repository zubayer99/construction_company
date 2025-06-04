import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import TenderList from './tenders/TenderList';
import CreateTenderModal from './tenders/CreateTenderModal';
import BidList from './bids/BidList';
import BusinessDashboard from './business/BusinessDashboard';
import { 
  FileText, 
  Users, 
  Building, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  DollarSign,
  Settings,
  Bell,
  LogOut,
  Home,
  Gavel,
  FileTextIcon
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showCreateTenderModal, setShowCreateTenderModal] = useState(false);

  // If user is admin, show business dashboard
  if (user?.role === 'ADMIN') {
    return <BusinessDashboard />;
  }

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getDashboardStats = () => {
    switch (user?.role) {
      case 'SUPPLIER':
        return [
          { label: 'Active Bids', value: '8', icon: FileText, color: 'blue' },
          { label: 'Won Contracts', value: '3', icon: CheckCircle, color: 'green' },
          { label: 'Pending Reviews', value: '2', icon: Clock, color: 'yellow' },
          { label: 'Total Revenue', value: '$125K', icon: DollarSign, color: 'purple' },
        ];
      case 'PROCUREMENT_OFFICER':
        return [
          { label: 'Open Tenders', value: '12', icon: FileText, color: 'blue' },
          { label: 'Pending Approvals', value: '5', icon: Clock, color: 'yellow' },
          { label: 'Active Contracts', value: '18', icon: CheckCircle, color: 'green' },
          { label: 'Budget Allocated', value: '$2.5M', icon: DollarSign, color: 'purple' },
        ];
      case 'AUDITOR':
        return [
          { label: 'Audits Pending', value: '7', icon: AlertCircle, color: 'red' },
          { label: 'Completed Audits', value: '23', icon: CheckCircle, color: 'green' },
          { label: 'Compliance Issues', value: '3', icon: AlertCircle, color: 'yellow' },
          { label: 'Reports Generated', value: '45', icon: FileText, color: 'blue' },
        ];
      default: // CITIZEN
        return [
          { label: 'Public Tenders', value: '156', icon: FileText, color: 'blue' },
          { label: 'Your Applications', value: '4', icon: Users, color: 'green' },
          { label: 'Notifications', value: '8', icon: Bell, color: 'yellow' },
          { label: 'Saved Searches', value: '12', icon: AlertCircle, color: 'purple' },
        ];
    }
  };
  const getQuickActions = () => {
    switch (user?.role) {
      case 'SUPPLIER':
        return [
          { label: 'Browse Tenders', icon: FileText, color: 'blue', action: () => setActiveTab('tenders') },
          { label: 'My Bids', icon: Gavel, color: 'green', action: () => setActiveTab('bids') },
          { label: 'Company Profile', icon: Building, color: 'purple', action: () => {} },
          { label: 'Reports', icon: TrendingUp, color: 'orange', action: () => {} },
        ];
      case 'PROCUREMENT_OFFICER':
        return [
          { label: 'Create Tender', icon: FileText, color: 'blue', action: () => setShowCreateTenderModal(true) },
          { label: 'Manage Tenders', icon: FileTextIcon, color: 'green', action: () => setActiveTab('tenders') },
          { label: 'Review Bids', icon: Gavel, color: 'purple', action: () => setActiveTab('bids') },
          { label: 'Generate Reports', icon: TrendingUp, color: 'orange', action: () => {} },
        ];
      case 'AUDITOR':
        return [
          { label: 'Start Audit', icon: AlertCircle, color: 'red', action: () => {} },
          { label: 'Review Contracts', icon: FileText, color: 'blue', action: () => {} },
          { label: 'Generate Report', icon: TrendingUp, color: 'green', action: () => {} },
          { label: 'Compliance Check', icon: CheckCircle, color: 'purple', action: () => {} },
        ];
      default: // CITIZEN
        return [
          { label: 'Search Tenders', icon: FileText, color: 'blue', action: () => setActiveTab('tenders') },
          { label: 'Track Application', icon: TrendingUp, color: 'green', action: () => {} },
          { label: 'Submit Feedback', icon: Users, color: 'purple', action: () => {} },
          { label: 'View Public Data', icon: Building, color: 'orange', action: () => {} },
        ];
    }
  };
  const stats = getDashboardStats();
  const quickActions = getQuickActions();

  const getNavigationItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home }
    ];

    switch (user?.role) {
      case 'SUPPLIER':
        return [
          ...baseItems,
          { id: 'tenders', label: 'Browse Tenders', icon: FileText },
          { id: 'bids', label: 'My Bids', icon: Gavel }
        ];
      case 'PROCUREMENT_OFFICER':
        return [
          ...baseItems,
          { id: 'tenders', label: 'Manage Tenders', icon: FileText },
          { id: 'bids', label: 'Review Bids', icon: Gavel }
        ];
      case 'AUDITOR':
        return [
          ...baseItems,
          { id: 'tenders', label: 'All Tenders', icon: FileText },
          { id: 'bids', label: 'All Bids', icon: Gavel }
        ];
      default: // CITIZEN
        return [
          ...baseItems,
          { id: 'tenders', label: 'Public Tenders', icon: FileText }
        ];
    }
  };

  const navigationItems = getNavigationItems();

  const renderContent = () => {
    switch (activeTab) {
      case 'tenders':
        return <TenderList />;
      case 'bids':
        return <BidList />;
      default:
        return renderDashboardContent();
    }
  };

  const renderDashboardContent = () => (
    <>
      {/* User Info Banner */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">
                {user?.firstName.charAt(0)}{user?.lastName.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-sm text-gray-600">{user?.role.replace('_', ' ')}</p>
              {user?.organization && (
                <p className="text-sm text-gray-500">{user.organization.name}</p>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Account Status</p>
            <div className="flex items-center space-x-2">
              <span className={`h-2 w-2 rounded-full ${user?.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className="text-sm font-medium text-gray-900">
                {user?.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            {user?.mfaEnabled && (
              <div className="flex items-center space-x-1 mt-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-xs text-green-600">MFA Enabled</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                  <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={action.action}
                className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200"
              >
                <div className={`p-3 rounded-full bg-${action.color}-100 mb-2`}>
                  <Icon className={`h-6 w-6 text-${action.color}-600`} />
                </div>
                <span className="text-sm font-medium text-gray-900">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="flex items-center space-x-3 p-3 border border-gray-100 rounded-lg">
              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Sample activity item #{item}
                </p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-800">View</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Government Procurement System
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {getGreeting()}, {user?.firstName}!
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <Bell className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Settings className="h-6 w-6" />
              </button>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-gray-600"
                title="Logout"
              >
                <LogOut className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex">
          {/* Sidebar Navigation */}
          <div className="w-64 mr-8">
            <nav className="bg-white rounded-lg shadow-sm p-4">
              <ul className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                          activeTab === item.id
                            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Create Tender Modal */}
      <CreateTenderModal
        isOpen={showCreateTenderModal}
        onClose={() => setShowCreateTenderModal(false)}
        onSuccess={() => {
          setActiveTab('tenders');
          // Refresh tender list if needed
        }}
      />
    </div>
  );
};

export default Dashboard;
