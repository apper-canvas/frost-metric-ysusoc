import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import PipelineBoard from '@/components/organisms/PipelineBoard';
import DealForm from '@/components/molecules/DealForm';
import Button from '@/components/atoms/Button';
import contactService from '@/services/api/contactService';
import dealService from '@/services/api/dealService';

const Pipeline = () => {
  const [showDealForm, setShowDealForm] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    loadFormData();
  }, []);

  const loadFormData = async () => {
    try {
      const [contactsResult, stagesResult] = await Promise.all([
        contactService.getAll(),
        dealService.getStages()
      ]);
      setContacts(contactsResult);
      setStages(stagesResult);
    } catch (error) {
      console.error('Failed to load form data:', error);
      toast.error('Failed to load form data');
    }
  };

  const handleCreateDeal = async (dealData) => {
    setLoading(true);
    try {
      await dealService.create(dealData);
      setShowDealForm(false);
      setRefreshTrigger(prev => prev + 1);
      toast.success('Deal created successfully');
    } catch (error) {
      console.error('Failed to create deal:', error);
      toast.error('Failed to create deal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-6"
    >
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sales Pipeline</h1>
            <p className="text-gray-600 mt-1">
              Track your deals through each stage of the sales process.
            </p>
          </div>
          <Button
            onClick={() => setShowDealForm(true)}
            leftIcon="Plus"
            className="shrink-0"
          >
            Add Deal
          </Button>
        </div>
      </div>

      <PipelineBoard key={refreshTrigger} />

      {showDealForm && (
        <DealForm
          contacts={contacts}
          stages={stages}
          onSubmit={handleCreateDeal}
          onCancel={() => setShowDealForm(false)}
          loading={loading}
        />
      )}
    </motion.div>
  );
};

export default Pipeline;