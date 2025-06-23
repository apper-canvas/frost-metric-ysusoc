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
}

export default new ContactService();