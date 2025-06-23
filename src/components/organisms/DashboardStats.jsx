import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import contactService from '@/services/api/contactService';
import dealService from '@/services/api/dealService';
import taskService from '@/services/api/taskService';
import MetricCard from '@/components/molecules/MetricCard';

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalContacts: 0,
    activeDeals: 0,
    pipelineValue: 0,
    overdueTasks: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const [contacts, deals, tasks] = await Promise.all([
        contactService.getAll(),
        dealService.getAll(),
        taskService.getOverdue()
      ]);

      const activeDeals = deals.filter(d => 
        !['Closed Won', 'Closed Lost'].includes(d.stage)
      );
      
      const pipelineValue = activeDeals.reduce((sum, deal) => sum + deal.value, 0);

      setStats({
        totalContacts: contacts.length,
        activeDeals: activeDeals.length,
        pipelineValue,
        overdueTasks: tasks.length
      });
    } catch (err) {
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(amount);
  };

  const metrics = [
    {
      title: 'Total Contacts',
      value: stats.totalContacts.toLocaleString(),
      icon: 'Users',
      gradient: true
    },
    {
      title: 'Active Deals',
      value: stats.activeDeals.toLocaleString(),
      icon: 'TrendingUp',
      gradient: true
    },
    {
      title: 'Pipeline Value',
      value: formatCurrency(stats.pipelineValue),
      icon: 'DollarSign',
      gradient: true
    },
    {
      title: 'Overdue Tasks',
      value: stats.overdueTasks.toLocaleString(),
      icon: 'AlertTriangle',
      gradient: true
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-lg p-6 shadow-sm"
          >
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <MetricCard {...metric} />
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardStats;