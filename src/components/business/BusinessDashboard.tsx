import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FileText, 
  Users, 
  Building, 
  TrendingUp, 
  Settings,
  Bell,
  LogOut,
  Home,
  Package,
  MessageSquare,
  Mail,
  Calendar,
  PlusCircle,
  Edit,
  Trash2
} from 'lucide-react';

const BusinessDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'company', label: 'Company Info', icon: Building },
    { id: 'services', label: 'Services', icon: Package },
    { id: 'projects', label: 'Projects', icon: TrendingUp },
    { id: 'team', label: 'Team Members', icon: Users },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
    { id: 'blog', label: 'Blog Posts', icon: FileText },
    { id: 'contact', label: 'Contact Inquiries', icon: Mail },
    { id: 'newsletter', label: 'Newsletter', icon: Calendar },
  ];

  const renderDashboardContent = () => (
    <>
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h1>
            <p className="text-blue-100">Manage your business content and website.</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{new Date().toLocaleDateString()}</div>
            <div className="text-blue-100">Today</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Total Services', value: '12', icon: Package, color: 'blue' },
          { title: 'Active Projects', value: '8', icon: TrendingUp, color: 'green' },
          { title: 'Team Members', value: '15', icon: Users, color: 'purple' },
          { title: 'Testimonials', value: '24', icon: MessageSquare, color: 'orange' },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={() => setActiveTab('services')}
              className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
            >
              <PlusCircle className="h-5 w-5 text-blue-600 mr-3" />
              Add New Service
            </button>
            <button 
              onClick={() => setActiveTab('projects')}
              className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
            >
              <PlusCircle className="h-5 w-5 text-green-600 mr-3" />
              Add New Project
            </button>
            <button 
              onClick={() => setActiveTab('blog')}
              className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Edit className="h-5 w-5 text-purple-600 mr-3" />
              Write Blog Post
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span className="text-gray-600">New testimonial added</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <span className="text-gray-600">Service updated</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
              <span className="text-gray-600">Project completed</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Inquiries</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Pending</span>
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">5</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Resolved</span>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">12</span>
            </div>
            <button 
              onClick={() => setActiveTab('contact')}
              className="w-full mt-3 text-blue-600 text-sm font-medium hover:text-blue-800"
            >
              View All Inquiries
            </button>
          </div>
        </div>
      </div>
    </>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'company':
        return <div className="bg-white rounded-lg shadow-sm p-6">Company Info Management - Coming Soon</div>;
      case 'services':
        return <div className="bg-white rounded-lg shadow-sm p-6">Services Management - Coming Soon</div>;
      case 'projects':
        return <div className="bg-white rounded-lg shadow-sm p-6">Projects Management - Coming Soon</div>;
      case 'team':
        return <div className="bg-white rounded-lg shadow-sm p-6">Team Members Management - Coming Soon</div>;
      case 'testimonials':
        return <div className="bg-white rounded-lg shadow-sm p-6">Testimonials Management - Coming Soon</div>;
      case 'blog':
        return <div className="bg-white rounded-lg shadow-sm p-6">Blog Management - Coming Soon</div>;
      case 'contact':
        return <div className="bg-white rounded-lg shadow-sm p-6">Contact Inquiries - Coming Soon</div>;
      case 'newsletter':
        return <div className="bg-white rounded-lg shadow-sm p-6">Newsletter Management - Coming Soon</div>;
      default:
        return renderDashboardContent();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Business Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Manage your business website content</p>
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
    </div>
  );
};

export default BusinessDashboard;
