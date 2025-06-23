import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Card from '@/components/atoms/Card';
import FilterCondition from '@/components/molecules/FilterCondition';
import filterService from '@/services/api/filterService';

const FilterBuilder = ({ 
  isOpen, 
  onClose, 
  onApplyFilter, 
  entityType = 'contacts',
  availableFields = [],
  currentFilter = null 
}) => {
  const [filterConfig, setFilterConfig] = useState({
    operator: 'AND',
    conditions: []
  });
  const [customViews, setCustomViews] = useState([]);
  const [selectedView, setSelectedView] = useState(null);
  const [viewName, setViewName] = useState('');
  const [showSaveView, setShowSaveView] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadCustomViews();
      if (currentFilter) {
        setFilterConfig(currentFilter);
      }
    }
  }, [isOpen, currentFilter]);

  const loadCustomViews = async () => {
    try {
      const views = await filterService.getCustomViews(entityType);
      setCustomViews(views);
    } catch (error) {
      toast.error('Failed to load custom views');
    }
  };

  const addCondition = () => {
    const newCondition = {
      id: Date.now().toString(),
      field: availableFields[0]?.key || '',
      operator: 'equals',
      value: '',
      type: 'condition'
    };
    
    setFilterConfig(prev => ({
      ...prev,
      conditions: [...prev.conditions, newCondition]
    }));
  };

  const updateCondition = (conditionId, updates) => {
    setFilterConfig(prev => ({
      ...prev,
      conditions: prev.conditions.map(condition =>
        condition.id === conditionId ? { ...condition, ...updates } : condition
      )
    }));
  };

  const removeCondition = (conditionId) => {
    setFilterConfig(prev => ({
      ...prev,
      conditions: prev.conditions.filter(condition => condition.id !== conditionId)
    }));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(filterConfig.conditions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setFilterConfig(prev => ({
      ...prev,
      conditions: items
    }));
  };

  const applyFilter = () => {
    const validation = filterService.validateFilterConfig(filterConfig);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    onApplyFilter(filterConfig);
    toast.success('Filter applied successfully');
  };

  const clearFilter = () => {
    setFilterConfig({
      operator: 'AND',
      conditions: []
    });
    setSelectedView(null);
    onApplyFilter(null);
    toast.info('Filter cleared');
  };

  const saveCustomView = async () => {
    if (!viewName.trim()) {
      toast.error('Please enter a view name');
      return;
    }

    if (filterConfig.conditions.length === 0) {
      toast.error('Please add at least one filter condition');
      return;
    }

    setLoading(true);
    try {
      const viewData = {
        name: viewName,
        entityType,
        filterConfig,
        description: `Custom view with ${filterConfig.conditions.length} condition${filterConfig.conditions.length !== 1 ? 's' : ''}`
      };

      await filterService.saveCustomView(viewData);
      await loadCustomViews();
      setViewName('');
      setShowSaveView(false);
      toast.success('Custom view saved successfully');
    } catch (error) {
      toast.error('Failed to save custom view');
    } finally {
      setLoading(false);
    }
  };

  const loadCustomView = async (view) => {
    try {
      setFilterConfig(view.filterConfig);
      setSelectedView(view);
      toast.info(`Loaded view: ${view.name}`);
    } catch (error) {
      toast.error('Failed to load custom view');
    }
  };

  const deleteCustomView = async (viewId) => {
    if (!window.confirm('Are you sure you want to delete this custom view?')) {
      return;
    }

    try {
      await filterService.deleteCustomView(viewId);
      await loadCustomViews();
      if (selectedView && selectedView.Id === viewId) {
        setSelectedView(null);
      }
      toast.success('Custom view deleted successfully');
    } catch (error) {
      toast.error('Failed to delete custom view');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Advanced Filter Builder</h2>
            <p className="text-sm text-gray-600 mt-1">
              Create complex filters for {entityType}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ApperIcon name="X" size={20} />
          </button>
        </div>

        <div className="flex flex-1 max-h-[calc(90vh-140px)]">
          {/* Custom Views Sidebar */}
          <div className="w-64 border-r border-gray-200 p-4 overflow-y-auto">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Custom Views</h3>
                <div className="space-y-2">
                  {customViews.map(view => (
                    <div
                      key={view.Id}
                      className={`p-2 rounded-lg border cursor-pointer transition-all ${
                        selectedView?.Id === view.Id
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => loadCustomView(view)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">{view.name}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteCustomView(view.Id);
                          }}
                          className="p-1 hover:bg-red-100 rounded transition-colors"
                        >
                          <ApperIcon name="Trash2" size={12} className="text-red-500" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{view.description}</p>
                    </div>
                  ))}
                  {customViews.length === 0 && (
                    <p className="text-xs text-gray-500">No saved views yet</p>
                  )}
                </div>
              </div>

              <Button
                onClick={() => setShowSaveView(true)}
                variant="secondary"
                size="sm"
                icon="Save"
                className="w-full"
                disabled={filterConfig.conditions.length === 0}
              >
                Save Current View
              </Button>
            </div>
          </div>

          {/* Filter Builder */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Logic Operator */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Match:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilterConfig(prev => ({ ...prev, operator: 'AND' }))}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      filterConfig.operator === 'AND'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All conditions
                  </button>
                  <button
                    onClick={() => setFilterConfig(prev => ({ ...prev, operator: 'OR' }))}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      filterConfig.operator === 'OR'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Any condition
                  </button>
                </div>
              </div>

              {/* Filter Conditions */}
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="conditions">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                      <AnimatePresence>
                        {filterConfig.conditions.map((condition, index) => (
                          <Draggable key={condition.id} draggableId={condition.id} index={index}>
                            {(provided, snapshot) => (
                              <motion.div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className={`${snapshot.isDragging ? 'shadow-lg' : ''}`}
                              >
                                <FilterCondition
                                  condition={condition}
                                  availableFields={availableFields}
                                  onUpdate={(updates) => updateCondition(condition.id, updates)}
                                  onRemove={() => removeCondition(condition.id)}
                                  dragHandleProps={provided.dragHandleProps}
                                  showLogicOperator={index > 0}
                                  logicOperator={filterConfig.operator}
                                />
                              </motion.div>
                            )}
                          </Draggable>
                        ))}
                      </AnimatePresence>
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              {/* Add Condition Button */}
              <Button
                onClick={addCondition}
                variant="secondary"
                icon="Plus"
                className="w-full"
                disabled={availableFields.length === 0}
              >
                Add Condition
              </Button>

              {filterConfig.conditions.length === 0 && (
                <div className="text-center py-8">
                  <ApperIcon name="Filter" size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No filter conditions yet</p>
                  <p className="text-sm text-gray-400 mt-1">Click "Add Condition" to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            {filterConfig.conditions.length} condition{filterConfig.conditions.length !== 1 ? 's' : ''}
            {selectedView && (
              <span className="ml-2 text-primary">• {selectedView.name}</span>
            )}
          </div>
          <div className="flex gap-3">
            <Button onClick={clearFilter} variant="ghost">
              Clear All
            </Button>
            <Button onClick={onClose} variant="secondary">
              Cancel
            </Button>
            <Button 
              onClick={applyFilter} 
              variant="primary"
              disabled={filterConfig.conditions.length === 0}
            >
              Apply Filter
            </Button>
          </div>
        </div>

        {/* Save View Modal */}
        <AnimatePresence>
          {showSaveView && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-lg p-6 w-96 mx-4"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Save Custom View</h3>
                <Input
                  label="View Name"
                  value={viewName}
                  onChange={(e) => setViewName(e.target.value)}
                  placeholder="Enter a name for this view"
                  className="mb-4"
                />
                <div className="flex justify-end gap-3">
                  <Button 
                    onClick={() => setShowSaveView(false)} 
                    variant="secondary"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={saveCustomView} 
                    variant="primary"
                    loading={loading}
                  >
                    Save View
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default FilterBuilder;