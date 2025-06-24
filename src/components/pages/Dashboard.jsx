import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DashboardStats from '@/components/organisms/DashboardStats';
import RecentActivity from '@/components/organisms/RecentActivity';
import ApperIcon from '@/components/ApperIcon';
const Dashboard = () => {
  const navigate = useNavigate();

  const handleQuickAction = (action) => {
    switch (action) {
      case 'contact':
        navigate('/contacts');
        break;
      case 'deal':
        navigate('/pipeline');
        break;
      case 'task':
        navigate('/tasks');
        break;
      default:
        break;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-6 space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's what's happening with your CRM.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <DashboardStats />

      {/* Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity - takes up 2 columns */}
        <div className="lg:col-span-2">
          <RecentActivity limit={8} />
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-gradient-violet rounded-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
            <p className="text-white/90 mb-4 text-sm">
              Get started with common CRM tasks
            </p>
<div className="space-y-2">
              <button 
                onClick={() => handleQuickAction('contact')}
                className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-3 text-left transition-all duration-200 hover:scale-105"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <ApperIcon name="UserPlus" size={16} className="text-white" />
                  </div>
                  <span className="font-medium">Add New Contact</span>
                </div>
              </button>
              <button 
                onClick={() => handleQuickAction('deal')}
                className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-3 text-left transition-all duration-200 hover:scale-105"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Briefcase" size={16} className="text-white" />
                  </div>
                  <span className="font-medium">Create Deal</span>
                </div>
              </button>
              <button 
                onClick={() => handleQuickAction('task')}
                className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-3 text-left transition-all duration-200 hover:scale-105"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <ApperIcon name="CheckSquare" size={16} className="text-white" />
                  </div>
                  <span className="font-medium">Add Task</span>
                </div>
              </button>
            </div>
          </div>

          {/* Pipeline Summary */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pipeline Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Leads</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Qualified</span>
                <span className="font-medium">8</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Proposal</span>
                <span className="font-medium">5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Negotiation</span>
                <span className="font-medium">3</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">Win Rate</span>
                  <span className="font-bold text-success">67%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;