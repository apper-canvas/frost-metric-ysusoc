import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import emailIntegrationService from '@/services/api/emailIntegrationService';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';

const EmailIntegration = () => {
  const [emailAccounts, setEmailAccounts] = useState([]);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [newAccount, setNewAccount] = useState({
    email: '',
    provider: 'gmail',
    password: ''
  });

  useEffect(() => {
    loadEmailAccounts();
    loadStatus();
  }, []);

  const loadEmailAccounts = async () => {
    try {
      const accounts = await emailIntegrationService.getEmailAccounts();
      setEmailAccounts(accounts);
    } catch (error) {
      toast.error('Failed to load email accounts');
    }
  };

  const loadStatus = async () => {
    try {
      const statusData = await emailIntegrationService.getStatus();
      setStatus(statusData);
    } catch (error) {
      toast.error('Failed to load integration status');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAccount = async (e) => {
    e.preventDefault();
    
    if (!newAccount.email) {
      toast.error('Email is required');
      return;
    }

    try {
      setLoading(true);
      
      // Test connection first
      const testResult = await emailIntegrationService.testConnection(newAccount);
      
      if (!testResult.success) {
        toast.error(testResult.message);
        return;
      }

      // Connect account
      const account = await emailIntegrationService.connectEmailAccount(newAccount);
      
      setEmailAccounts(prev => [...prev, account]);
      setNewAccount({ email: '', provider: 'gmail', password: '' });
      setShowAddAccount(false);
      
      toast.success('Email account connected successfully');
      
      // Reload status
      loadStatus();
      
    } catch (error) {
      toast.error('Failed to connect email account');
    } finally {
      setLoading(false);
    }
  };

  const handleSyncEmails = async () => {
    try {
      setSyncing(true);
      
      const result = await emailIntegrationService.syncEmails();
      
      toast.success(`Successfully synced ${result.syncedCount} emails`);
      
      // Reload status
      loadStatus();
      
    } catch (error) {
      toast.error('Failed to sync emails');
    } finally {
      setSyncing(false);
    }
  };

  const handleDisconnectAccount = async (accountId) => {
    if (!confirm('Are you sure you want to disconnect this email account?')) {
      return;
    }

    try {
      await emailIntegrationService.disconnectEmailAccount(accountId);
      
      setEmailAccounts(prev => 
        prev.map(acc => 
          acc.Id === accountId 
            ? { ...acc, isActive: false, syncStatus: 'disconnected' }
            : acc
        )
      );
      
      toast.success('Email account disconnected');
      loadStatus();
      
    } catch (error) {
      toast.error('Failed to disconnect email account');
    }
  };

  const handleStartAutoSync = async () => {
    try {
      await emailIntegrationService.startAutoSync(15);
      toast.success('Auto-sync enabled (15 minutes interval)');
      loadStatus();
    } catch (error) {
      toast.error('Failed to start auto-sync');
    }
  };

  const handleStopAutoSync = async () => {
    try {
      await emailIntegrationService.stopAutoSync();
      toast.success('Auto-sync disabled');
      loadStatus();
    } catch (error) {
      toast.error('Failed to stop auto-sync');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Email Integration</h1>
          <p className="text-gray-600 mt-1">
            Automatically log emails sent to and received from your contacts
          </p>
        </div>
        
        <Button
          onClick={() => setShowAddAccount(true)}
          className="flex items-center gap-2"
        >
          <ApperIcon name="Plus" size={16} />
          Add Email Account
        </Button>
      </div>

      {/* Status Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Integration Status</h2>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            status?.isConnected 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {status?.isConnected ? 'Connected' : 'Disconnected'}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{status?.accountCount || 0}</div>
            <div className="text-sm text-gray-600">Total Accounts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{status?.activeAccounts || 0}</div>
            <div className="text-sm text-gray-600">Active Accounts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {status?.lastSync ? 'Synced' : 'Never'}
            </div>
            <div className="text-sm text-gray-600">Last Sync</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${status?.autoSyncEnabled ? 'text-green-600' : 'text-gray-400'}`}>
              {status?.autoSyncEnabled ? 'ON' : 'OFF'}
            </div>
            <div className="text-sm text-gray-600">Auto Sync</div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleSyncEmails}
            disabled={syncing || !status?.isConnected}
            className="flex items-center gap-2"
          >
            <ApperIcon 
              name="RefreshCw" 
              size={16} 
              className={syncing ? 'animate-spin' : ''}
            />
            {syncing ? 'Syncing...' : 'Sync Now'}
          </Button>
          
          {status?.autoSyncEnabled ? (
            <Button
              variant="outline"
              onClick={handleStopAutoSync}
              className="flex items-center gap-2"
            >
              <ApperIcon name="Pause" size={16} />
              Stop Auto Sync
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={handleStartAutoSync}
              disabled={!status?.isConnected}
              className="flex items-center gap-2"
            >
              <ApperIcon name="Play" size={16} />
              Start Auto Sync
            </Button>
          )}
        </div>
      </Card>

      {/* Email Accounts */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Email Accounts</h2>
        
        {emailAccounts.length === 0 ? (
          <div className="text-center py-8">
            <ApperIcon name="Mail" size={48} className="mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600">No email accounts connected</p>
            <p className="text-sm text-gray-500 mt-1">
              Add an email account to start automatically logging emails
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {emailAccounts.map((account) => (
              <motion.div
                key={account.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    account.isActive ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <ApperIcon 
                      name="Mail" 
                      size={20} 
                      className={account.isActive ? 'text-green-600' : 'text-gray-400'}
                    />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{account.email}</div>
                    <div className="text-sm text-gray-600 capitalize">
                      {account.provider} • {account.syncStatus}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    account.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {account.isActive ? 'Active' : 'Inactive'}
                  </div>
                  
                  {account.isActive && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDisconnectAccount(account.Id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Disconnect
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>

      {/* Add Account Modal */}
      {showAddAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add Email Account</h3>
              <button
                onClick={() => setShowAddAccount(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>

            <form onSubmit={handleAddAccount} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={newAccount.email}
                  onChange={(e) => setNewAccount(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Provider
                </label>
                <select
                  value={newAccount.provider}
                  onChange={(e) => setNewAccount(prev => ({ ...prev, provider: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="gmail">Gmail</option>
                  <option value="outlook">Outlook</option>
                  <option value="yahoo">Yahoo</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddAccount(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Connecting...' : 'Connect'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default EmailIntegration;