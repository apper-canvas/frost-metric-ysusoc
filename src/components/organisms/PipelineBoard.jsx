import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import dealService from '@/services/api/dealService';
import contactService from '@/services/api/contactService';
import DealCard from '@/components/molecules/DealCard';
import ApperIcon from '@/components/ApperIcon';

const PipelineBoard = () => {
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [dealsByStage, setDealsByStage] = useState({});
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dealsResult, contactsResult, stagesResult] = await Promise.all([
        dealService.getAll(),
        contactService.getAll(),
        dealService.getStages()
      ]);
      
      setDeals(dealsResult);
      setContacts(contactsResult);
      setStages(stagesResult);
      
      // Group deals by stage
      const grouped = {};
      stagesResult.forEach(stage => {
        grouped[stage] = dealsResult.filter(deal => deal.stage === stage);
      });
      setDealsByStage(grouped);
    } catch (err) {
      setError(err.message || 'Failed to load pipeline data');
      toast.error('Failed to load pipeline data');
    } finally {
      setLoading(false);
    }
  };

  const getContactById = (contactId) => {
    return contacts.find(c => c.Id === contactId);
  };

  const handleDragStart = (e, deal) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(deal));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, targetStage) => {
    e.preventDefault();
    try {
      const dealData = JSON.parse(e.dataTransfer.getData('text/plain'));
      
      if (dealData.stage !== targetStage) {
        await dealService.updateStage(dealData.Id, targetStage);
        await loadData();
        toast.success(`Deal moved to ${targetStage}`);
      }
    } catch (err) {
      toast.error('Failed to update deal stage');
    }
  };

  const handleEdit = (deal) => {
    console.log('Edit deal:', deal);
    toast.info('Edit functionality coming soon');
  };

  const handleDelete = async (deal) => {
    if (window.confirm(`Are you sure you want to delete "${deal.title}"?`)) {
      try {
        await dealService.delete(deal.Id);
        await loadData();
        toast.success('Deal deleted successfully');
      } catch (err) {
        toast.error('Failed to delete deal');
      }
    }
  };

  const getStageTotal = (stage) => {
    const stageDeals = dealsByStage[stage] || [];
    return stageDeals.reduce((sum, deal) => sum + deal.value, 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-4">
              <div className="animate-pulse space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="space-y-2">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="h-20 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name="AlertCircle" className="w-8 h-8 text-error" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Pipeline</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={loadData}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Sales Pipeline</h2>
        <div className="text-sm text-gray-600">
          Total Pipeline: {formatCurrency(deals.reduce((sum, deal) => sum + deal.value, 0))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 min-h-[600px]">
        {stages.map((stage) => (
          <div
            key={stage}
            className="bg-gray-50 rounded-lg p-4"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 text-sm">{stage}</h3>
              <div className="flex flex-col items-end">
                <span className="text-xs text-gray-500">
                  {(dealsByStage[stage] || []).length} deals
                </span>
                <span className="text-xs font-medium text-gray-700">
                  {formatCurrency(getStageTotal(stage))}
                </span>
              </div>
            </div>

            <div className="space-y-3 min-h-[400px]">
              <AnimatePresence>
                {(dealsByStage[stage] || []).map((deal) => (
                  <div
                    key={deal.Id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, deal)}
                    className="cursor-grab active:cursor-grabbing"
                  >
                    <DealCard
                      deal={deal}
                      contact={getContactById(deal.contactId)}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  </div>
                ))}
              </AnimatePresence>
            </div>

            {(dealsByStage[stage] || []).length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <ApperIcon name="Plus" className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">Drop deals here</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PipelineBoard;