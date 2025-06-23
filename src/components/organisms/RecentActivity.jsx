import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import activityService from '@/services/api/activityService';
import contactService from '@/services/api/contactService';
import ActivityItem from '@/components/molecules/ActivityItem';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';

const RecentActivity = ({ limit = 10 }) => {
  const [activities, setActivities] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRecentActivity();
  }, [limit]);

  const loadRecentActivity = async () => {
    setLoading(true);
    setError(null);
    try {
      const [activitiesResult, contactsResult] = await Promise.all([
        activityService.getRecent(limit),
        contactService.getAll()
      ]);
      setActivities(activitiesResult);
      setContacts(contactsResult);
    } catch (err) {
      setError(err.message || 'Failed to load recent activity');
      toast.error('Failed to load recent activity');
    } finally {
      setLoading(false);
    }
  };

  const getContactById = (contactId) => {
    return contacts.find(c => c.Id === contactId);
  };

  if (loading) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="AlertCircle" className="w-6 h-6 text-error" />
          </div>
          <p className="text-gray-600 text-sm mb-3">{error}</p>
          <button 
            onClick={loadRecentActivity}
            className="text-primary hover:text-primary/80 text-sm font-medium"
          >
            Try Again
          </button>
        </div>
      </Card>
    );
  }

  if (activities.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="Activity" className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-600 text-sm">No recent activity found</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <button className="text-primary hover:text-primary/80 text-sm font-medium">
          View All
        </button>
      </div>
      
      <div className="space-y-1 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {activities.map((activity, index) => (
            <motion.div
              key={activity.Id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: index * 0.05 }}
            >
              <ActivityItem
                activity={activity}
                contact={getContactById(activity.contactId)}
                showContact={true}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Card>
  );
};

export default RecentActivity;