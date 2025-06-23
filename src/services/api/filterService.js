const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class FilterService {
  constructor() {
    this.customViews = [];
    this.lastViewId = 0;
  }

  async saveCustomView(viewData) {
    await delay(200);
    const maxId = Math.max(...this.customViews.map(v => v.Id), 0);
    const newView = {
      ...viewData,
      Id: maxId + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.customViews.push(newView);
    return { ...newView };
  }

  async getCustomViews(entityType = 'contacts') {
    await delay(150);
    return this.customViews
      .filter(view => view.entityType === entityType)
      .map(view => ({ ...view }));
  }

  async getCustomViewById(id) {
    await delay(100);
    const view = this.customViews.find(v => v.Id === parseInt(id, 10));
    if (!view) {
      throw new Error('Custom view not found');
    }
    return { ...view };
  }

  async updateCustomView(id, viewData) {
    await delay(200);
    const index = this.customViews.findIndex(v => v.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Custom view not found');
    }

    const updatedView = {
      ...this.customViews[index],
      ...viewData,
      Id: this.customViews[index].Id,
      updatedAt: new Date().toISOString()
    };

    this.customViews[index] = updatedView;
    return { ...updatedView };
  }

  async deleteCustomView(id) {
    await delay(150);
    const index = this.customViews.findIndex(v => v.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Custom view not found');
    }

    const deletedView = this.customViews.splice(index, 1)[0];
    return { ...deletedView };
  }

  getFieldOperators(fieldType) {
    const operatorMap = {
      text: [
        { value: 'equals', label: 'Equals' },
        { value: 'contains', label: 'Contains' },
        { value: 'startsWith', label: 'Starts with' },
        { value: 'endsWith', label: 'Ends with' },
        { value: 'isEmpty', label: 'Is empty' },
        { value: 'isNotEmpty', label: 'Is not empty' }
      ],
      email: [
        { value: 'equals', label: 'Equals' },
        { value: 'contains', label: 'Contains' },
        { value: 'endsWith', label: 'Domain is' },
        { value: 'isEmpty', label: 'Is empty' },
        { value: 'isNotEmpty', label: 'Is not empty' }
      ],
      number: [
        { value: 'equals', label: 'Equals' },
        { value: 'greaterThan', label: 'Greater than' },
        { value: 'lessThan', label: 'Less than' },
        { value: 'isEmpty', label: 'Is empty' },
        { value: 'isNotEmpty', label: 'Is not empty' }
      ],
      date: [
        { value: 'equals', label: 'Is on' },
        { value: 'greaterThan', label: 'Is after' },
        { value: 'lessThan', label: 'Is before' },
        { value: 'isEmpty', label: 'Is empty' },
        { value: 'isNotEmpty', label: 'Is not empty' }
      ],
      array: [
        { value: 'inArray', label: 'Contains' },
        { value: 'isEmpty', label: 'Is empty' },
        { value: 'isNotEmpty', label: 'Is not empty' }
      ]
    };

    return operatorMap[fieldType] || operatorMap.text;
  }

  validateFilterConfig(filterConfig) {
    if (!filterConfig || typeof filterConfig !== 'object') {
      return { valid: false, error: 'Filter configuration is required' };
    }

    if (!filterConfig.conditions || !Array.isArray(filterConfig.conditions)) {
      return { valid: false, error: 'Filter conditions must be an array' };
    }

    for (const condition of filterConfig.conditions) {
      const validation = this.validateCondition(condition);
      if (!validation.valid) {
        return validation;
      }
    }

    return { valid: true };
  }

  validateCondition(condition) {
    if (condition.type === 'group') {
      return this.validateFilterConfig(condition);
    }

    if (!condition.field || !condition.operator) {
      return { valid: false, error: 'Field and operator are required for each condition' };
    }

    if (condition.operator !== 'isEmpty' && condition.operator !== 'isNotEmpty' && !condition.value) {
      return { valid: false, error: 'Value is required for this operator' };
    }

    return { valid: true };
  }
}

export default new FilterService();