import { useState, useEffect } from 'react';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';
import filterService from '@/services/api/filterService';

const FilterCondition = ({ 
  condition, 
  availableFields, 
  onUpdate, 
  onRemove, 
  dragHandleProps,
  showLogicOperator = false,
  logicOperator = 'AND'
}) => {
  const [operators, setOperators] = useState([]);

  useEffect(() => {
    if (condition.field) {
      const field = availableFields.find(f => f.key === condition.field);
      if (field) {
        const fieldOperators = filterService.getFieldOperators(field.type);
        setOperators(fieldOperators);
        
        // Reset operator if current one is not valid for new field type
        if (!fieldOperators.some(op => op.value === condition.operator)) {
          onUpdate({ operator: fieldOperators[0]?.value || 'equals' });
        }
      }
    }
  }, [condition.field, availableFields, onUpdate]);

  const handleFieldChange = (fieldKey) => {
    const field = availableFields.find(f => f.key === fieldKey);
    if (field) {
      const fieldOperators = filterService.getFieldOperators(field.type);
      onUpdate({ 
        field: fieldKey, 
        operator: fieldOperators[0]?.value || 'equals',
        value: '' 
      });
    }
  };

  const needsValue = () => {
    return condition.operator !== 'isEmpty' && condition.operator !== 'isNotEmpty';
  };

  const getInputType = () => {
    const field = availableFields.find(f => f.key === condition.field);
    if (!field) return 'text';
    
    switch (field.type) {
      case 'email':
        return 'email';
      case 'number':
        return 'number';
      case 'date':
        return 'date';
      default:
        return 'text';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center gap-3">
        {/* Logic Operator Badge */}
        {showLogicOperator && (
          <div className="flex items-center">
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              logicOperator === 'AND' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-purple-100 text-purple-700'
            }`}>
              {logicOperator}
            </span>
          </div>
        )}

        {/* Drag Handle */}
        <div {...dragHandleProps} className="cursor-move p-1 hover:bg-gray-100 rounded">
          <ApperIcon name="GripVertical" size={16} className="text-gray-400" />
        </div>

        {/* Field Selection */}
        <div className="flex-1 min-w-0">
          <select
            value={condition.field}
            onChange={(e) => handleFieldChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="">Select field...</option>
            {availableFields.map(field => (
              <option key={field.key} value={field.key}>
                {field.label}
              </option>
            ))}
          </select>
        </div>

        {/* Operator Selection */}
        <div className="flex-1 min-w-0">
          <select
            value={condition.operator}
            onChange={(e) => onUpdate({ operator: e.target.value, value: '' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            disabled={!condition.field}
          >
            {operators.map(operator => (
              <option key={operator.value} value={operator.value}>
                {operator.label}
              </option>
            ))}
          </select>
        </div>

        {/* Value Input */}
        {needsValue() && (
          <div className="flex-1 min-w-0">
            <Input
              type={getInputType()}
              value={condition.value}
              onChange={(e) => onUpdate({ value: e.target.value })}
              placeholder="Enter value..."
              disabled={!condition.field || !condition.operator}
            />
          </div>
        )}

        {/* Remove Button */}
        <button
          onClick={onRemove}
          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Remove condition"
        >
          <ApperIcon name="Trash2" size={16} />
        </button>
      </div>

      {/* Field Type Hint */}
      {condition.field && (
        <div className="mt-2 text-xs text-gray-500">
          {availableFields.find(f => f.key === condition.field)?.type === 'array' && 
            'Tip: For tags, use "Contains" to search within tag values'
          }
          {availableFields.find(f => f.key === condition.field)?.type === 'date' && 
            'Tip: Use YYYY-MM-DD format for date values'
          }
        </div>
      )}
    </div>
  );
};

export default FilterCondition;