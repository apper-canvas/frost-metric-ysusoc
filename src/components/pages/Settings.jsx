import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
const Settings = () => {
  const navigate = useNavigate();

  const handleSettingClick = (settingKey) => {
    if (settingKey === 'customFields') {
      navigate('/custom-fields');
    }
    // Add other navigation handlers as needed
  };

  const settingsGroups = [
    {
      title: 'Account Settings',
      description: 'Manage your account preferences and profile information',
      icon: 'User',
      items: [
        { label: 'Profile Information', description: 'Update your personal details' },
        { label: 'Email Preferences', description: 'Manage notification settings' },
        { label: 'Security', description: 'Change password and security settings' }
      ]
    },
    {
      title: 'CRM Configuration',
      description: 'Customize your CRM settings and workflows',
      icon: 'Settings',
items: [
        { key: 'pipelineStages', label: 'Pipeline Stages', description: 'Customize your sales pipeline stages' },
        { key: 'customFields', label: 'Custom Fields', description: 'Add custom fields to contacts and deals' },
        { key: 'dealCategories', label: 'Deal Categories', description: 'Manage deal types and categories' }
      ]
    },
    {
      title: 'Team Management',
      description: 'Manage team members and permissions',
      icon: 'Users',
      items: [
        { label: 'Team Members', description: 'Add and manage team members' },
        { label: 'Roles & Permissions', description: 'Configure user roles and access' },
        { label: 'Activity Tracking', description: 'Monitor team activity and performance' }
      ]
    },
    {
      title: 'Integrations',
      description: 'Connect with external tools and services',
      icon: 'Zap',
      items: [
        { label: 'Email Integration', description: 'Connect your email accounts' },
        { label: 'Calendar Sync', description: 'Sync with Google Calendar or Outlook' },
        { label: 'Third-party Apps', description: 'Connect with external applications' }
      ]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-6"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Configure your CRM preferences and manage your account settings.
        </p>
      </div>

      <div className="space-y-8">
        {settingsGroups.map((group, index) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <ApperIcon name={group.icon} className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{group.title}</h3>
                  <p className="text-sm text-gray-600">{group.description}</p>
                </div>
              </div>

<div className="space-y-4">
                {group.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => item.key && handleSettingClick(item.key)}
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">{item.label}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      icon="ChevronRight"
                      onClick={(e) => {
                        e.stopPropagation();
                        item.key && handleSettingClick(item.key);
                      }}
                    >
                      Configure
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}

        {/* Export & Import */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="Download" className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Data Management</h3>
                <p className="text-sm text-gray-600">Import and export your CRM data</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Export Data</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Download your contacts, deals, and activities as CSV files
                </p>
                <Button variant="secondary" size="sm" icon="Download">
                  Export Data
                </Button>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Import Data</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Upload CSV files to import contacts and deals
                </p>
                <Button variant="secondary" size="sm" icon="Upload">
                  Import Data
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 border-error">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="AlertTriangle" className="w-5 h-5 text-error" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-error">Danger Zone</h3>
                <p className="text-sm text-gray-600">Irreversible and destructive actions</p>
              </div>
            </div>

            <div className="p-4 bg-error/5 border border-error/20 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Delete Account</h4>
              <p className="text-sm text-gray-600 mb-3">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <Button variant="danger" size="sm" icon="Trash2">
                Delete Account
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Settings;