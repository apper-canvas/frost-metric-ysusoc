import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import contactService from '@/services/api/contactService';
import activityService from '@/services/api/activityService';
import dealService from '@/services/api/dealService';
import taskService from '@/services/api/taskService';
import ActivityItem from '@/components/molecules/ActivityItem';
import DealCard from '@/components/molecules/DealCard';
import TaskItem from '@/components/molecules/TaskItem';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';

const ContactDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState(null);
  const [activities, setActivities] = useState([]);
  const [deals, setDeals] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (id) {
      loadContactData();
    }
  }, [id]);

  const loadContactData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [contactResult, activitiesResult, dealsResult, tasksResult] = await Promise.all([
        contactService.getById(id),
        activityService.getByContactId(id),
        dealService.getByContactId(id),
        taskService.getByContactId(id)
      ]);
      
      setContact(contactResult);
      setActivities(activitiesResult);
      setDeals(dealsResult);
      setTasks(tasksResult);
    } catch (err) {
      setError(err.message || 'Failed to load contact details');
      toast.error('Failed to load contact details');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    toast.info('Edit functionality coming soon');
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${contact.firstName} ${contact.lastName}?`)) {
      try {
        await contactService.delete(contact.Id);
        toast.success('Contact deleted successfully');
        navigate('/contacts');
      } catch (err) {
        toast.error('Failed to delete contact');
      }
    }
  };

  const handleTaskComplete = async (task) => {
    try {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      await taskService.updateStatus(task.Id, newStatus);
      await loadContactData();
      toast.success(newStatus === 'completed' ? 'Task completed!' : 'Task reopened');
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const handleTaskEdit = (task) => {
    toast.info('Edit task functionality coming soon');
  };

  const handleTaskDelete = async (task) => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      try {
        await taskService.delete(task.Id);
        await loadContactData();
        toast.success('Task deleted successfully');
      } catch (err) {
        toast.error('Failed to delete task');
      }
    }
  };

  const handleDealEdit = (deal) => {
    toast.info('Edit deal functionality coming soon');
  };

  const handleDealDelete = async (deal) => {
    if (window.confirm(`Are you sure you want to delete "${deal.title}"?`)) {
      try {
        await dealService.delete(deal.Id);
        await loadContactData();
        toast.success('Deal deleted successfully');
      } catch (err) {
        toast.error('Failed to delete deal');
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400">
              <ApperIcon name="ArrowLeft" className="w-5 h-5" />
            </button>
            <div className="h-8 bg-gray-200 rounded w-48"></div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !contact) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => navigate('/contacts')}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ApperIcon name="ArrowLeft" className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Contact Not Found</h1>
        </div>
        
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="AlertCircle" className="w-8 h-8 text-error" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Not Found</h3>
          <p className="text-gray-600 mb-4">{error || 'The contact you are looking for does not exist.'}</p>
          <Button onClick={() => navigate('/contacts')} variant="primary">
            Back to Contacts
          </Button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', count: null },
    { id: 'activities', label: 'Activities', count: activities.length },
    { id: 'deals', label: 'Deals', count: deals.length },
    { id: 'tasks', label: 'Tasks', count: tasks.length }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate('/contacts')}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ApperIcon name="ArrowLeft" className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {contact.firstName} {contact.lastName}
        </h1>
      </div>

      {/* Contact Header Card */}
      <Card className="p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-primary font-bold text-xl">
                {contact.firstName?.[0]}{contact.lastName?.[0]}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {contact.firstName} {contact.lastName}
              </h2>
              <p className="text-gray-600">{contact.position}</p>
              <p className="text-gray-600">{contact.company}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={handleEdit} variant="secondary" size="sm" icon="Edit2">
              Edit
            </Button>
            <Button onClick={handleDelete} variant="danger" size="sm" icon="Trash2">
              Delete
            </Button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center gap-2 text-gray-600">
            <ApperIcon name="Mail" className="w-4 h-4" />
            <span>{contact.email}</span>
          </div>
          {contact.phone && (
            <div className="flex items-center gap-2 text-gray-600">
              <ApperIcon name="Phone" className="w-4 h-4" />
              <span>{contact.phone}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-gray-600">
            <ApperIcon name="Building2" className="w-4 h-4" />
            <span>{contact.company}</span>
          </div>
        </div>

        {contact.tags && contact.tags.length > 0 && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {contact.tags.map((tag, index) => (
                <Badge key={index} variant="primary" size="sm">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {contact.notes && (
          <div className="mt-4">
            <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
            <p className="text-gray-600">{contact.notes}</p>
          </div>
        )}
      </Card>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              {tab.count !== null && (
                <Badge variant="default" size="sm" className="ml-2">
                  {tab.count}
                </Badge>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-1">
                {activities.slice(0, 5).map((activity) => (
                  <ActivityItem
                    key={activity.Id}
                    activity={activity}
                    showContact={false}
                  />
                ))}
                {activities.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No activities yet</p>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Deals</h3>
              <div className="space-y-3">
                {deals.filter(d => !['Closed Won', 'Closed Lost'].includes(d.stage)).map((deal) => (
                  <DealCard
                    key={deal.Id}
                    deal={deal}
                    contact={contact}
                    draggable={false}
                    onEdit={handleDealEdit}
                    onDelete={handleDealDelete}
                  />
                ))}
                {deals.filter(d => !['Closed Won', 'Closed Lost'].includes(d.stage)).length === 0 && (
                  <p className="text-gray-500 text-center py-4">No active deals</p>
                )}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'activities' && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Activities</h3>
              <Button variant="primary" size="sm" icon="Plus">
                Log Activity
              </Button>
            </div>
            <div className="space-y-1">
              {activities.map((activity) => (
                <ActivityItem
                  key={activity.Id}
                  activity={activity}
                  showContact={false}
                />
              ))}
              {activities.length === 0 && (
                <div className="text-center py-8">
                  <ApperIcon name="Activity" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No activities logged yet</p>
                </div>
              )}
            </div>
          </Card>
        )}

        {activeTab === 'deals' && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Deals</h3>
              <Button variant="primary" size="sm" icon="Plus">
                Create Deal
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {deals.map((deal) => (
                <DealCard
                  key={deal.Id}
                  deal={deal}
                  contact={contact}
                  draggable={false}
                  onEdit={handleDealEdit}
                  onDelete={handleDealDelete}
                />
              ))}
              {deals.length === 0 && (
                <div className="col-span-full text-center py-8">
                  <ApperIcon name="TrendingUp" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No deals created yet</p>
                </div>
              )}
            </div>
          </Card>
        )}

        {activeTab === 'tasks' && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Tasks</h3>
              <Button variant="primary" size="sm" icon="Plus">
                Add Task
              </Button>
            </div>
            <div className="space-y-4">
              {tasks.map((task) => (
                <TaskItem
                  key={task.Id}
                  task={task}
                  contact={contact}
                  onComplete={handleTaskComplete}
                  onEdit={handleTaskEdit}
                  onDelete={handleTaskDelete}
                />
              ))}
              {tasks.length === 0 && (
                <div className="text-center py-8">
                  <ApperIcon name="CheckSquare" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No tasks assigned yet</p>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </motion.div>
  );
};

export default ContactDetail;