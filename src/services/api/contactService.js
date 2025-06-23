import contactsData from '../mockData/contacts.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ContactService {
  constructor() {
    this.contacts = [...contactsData];
  }

  async getAll() {
    await delay(300);
    return [...this.contacts];
  }

  async getById(id) {
    await delay(200);
    const contact = this.contacts.find(c => c.Id === parseInt(id, 10));
    if (!contact) {
      throw new Error('Contact not found');
    }
    return { ...contact };
  }

  async create(contactData) {
    await delay(400);
    const maxId = Math.max(...this.contacts.map(c => c.Id), 0);
    const newContact = {
      ...contactData,
      Id: maxId + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.contacts.push(newContact);
    return { ...newContact };
  }

  async update(id, contactData) {
    await delay(300);
    const index = this.contacts.findIndex(c => c.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Contact not found');
    }
    
    const updatedContact = {
      ...this.contacts[index],
      ...contactData,
      Id: this.contacts[index].Id, // Prevent Id modification
      updatedAt: new Date().toISOString()
    };
    
    this.contacts[index] = updatedContact;
    return { ...updatedContact };
  }

  async delete(id) {
    await delay(250);
    const index = this.contacts.findIndex(c => c.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Contact not found');
    }
    
    const deletedContact = this.contacts.splice(index, 1)[0];
    return { ...deletedContact };
  }

  async search(query) {
    await delay(200);
    if (!query) return [...this.contacts];
    
    const searchTerm = query.toLowerCase();
    return this.contacts.filter(contact => 
      contact.firstName.toLowerCase().includes(searchTerm) ||
      contact.lastName.toLowerCase().includes(searchTerm) ||
      contact.email.toLowerCase().includes(searchTerm) ||
      contact.company.toLowerCase().includes(searchTerm) ||
      contact.position.toLowerCase().includes(searchTerm) ||
contact.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  async advancedFilter(filterConfig) {
    await delay(300);
    if (!filterConfig || !filterConfig.conditions || filterConfig.conditions.length === 0) {
      return [...this.contacts];
    }

    return this.contacts.filter(contact => {
      return this.evaluateFilterGroup(contact, filterConfig);
    });
  }

  evaluateFilterGroup(contact, group) {
    if (!group.conditions || group.conditions.length === 0) return true;
    
    const results = group.conditions.map(condition => {
      if (condition.type === 'group') {
        return this.evaluateFilterGroup(contact, condition);
      }
      return this.evaluateCondition(contact, condition);
    });

    return group.operator === 'AND' 
      ? results.every(result => result)
      : results.some(result => result);
  }

  evaluateCondition(contact, condition) {
    const { field, operator, value } = condition;
    const contactValue = this.getContactFieldValue(contact, field);
    
    if (contactValue === null || contactValue === undefined) return false;

    switch (operator) {
      case 'equals':
        return contactValue.toString().toLowerCase() === value.toLowerCase();
      case 'contains':
        return contactValue.toString().toLowerCase().includes(value.toLowerCase());
      case 'startsWith':
        return contactValue.toString().toLowerCase().startsWith(value.toLowerCase());
      case 'endsWith':
        return contactValue.toString().toLowerCase().endsWith(value.toLowerCase());
      case 'isEmpty':
        return !contactValue || contactValue.toString().trim() === '';
      case 'isNotEmpty':
        return contactValue && contactValue.toString().trim() !== '';
      case 'greaterThan':
        return parseFloat(contactValue) > parseFloat(value);
      case 'lessThan':
        return parseFloat(contactValue) < parseFloat(value);
      case 'inArray':
        return Array.isArray(contactValue) && contactValue.some(item => 
          item.toLowerCase().includes(value.toLowerCase())
        );
      default:
        return false;
    }
  }

  getContactFieldValue(contact, field) {
    const fieldMap = {
      'firstName': contact.firstName,
      'lastName': contact.lastName,
      'email': contact.email,
      'phone': contact.phone,
      'company': contact.company,
      'position': contact.position,
      'tags': contact.tags,
      'notes': contact.notes,
      'createdAt': contact.createdAt,
      'updatedAt': contact.updatedAt
    };
    return fieldMap[field] || null;
  }

  async getFilterFields() {
    await delay(100);
    return [
      { key: 'firstName', label: 'First Name', type: 'text' },
      { key: 'lastName', label: 'Last Name', type: 'text' },
      { key: 'email', label: 'Email', type: 'email' },
      { key: 'phone', label: 'Phone', type: 'text' },
      { key: 'company', label: 'Company', type: 'text' },
      { key: 'position', label: 'Position', type: 'text' },
      { key: 'tags', label: 'Tags', type: 'array' },
      { key: 'notes', label: 'Notes', type: 'text' },
      { key: 'createdAt', label: 'Created Date', type: 'date' },
      { key: 'updatedAt', label: 'Updated Date', type: 'date' }
    ];
  }
}
export default new ContactService();