import dealsData from '../mockData/deals.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class DealService {
  constructor() {
    this.deals = [...dealsData];
    this.stages = ['Lead', 'Qualified', 'Discovery', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];
  }

  async getAll() {
    await delay(300);
    return [...this.deals];
  }

  async getById(id) {
    await delay(200);
    const deal = this.deals.find(d => d.Id === parseInt(id, 10));
    if (!deal) {
      throw new Error('Deal not found');
    }
    return { ...deal };
  }

  async getByContactId(contactId) {
    await delay(250);
    return this.deals.filter(d => d.contactId === parseInt(contactId, 10));
  }

  async create(dealData) {
    await delay(400);
    const maxId = Math.max(...this.deals.map(d => d.Id), 0);
    const newDeal = {
      ...dealData,
      Id: maxId + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.deals.push(newDeal);
    return { ...newDeal };
  }

  async update(id, dealData) {
    await delay(300);
    const index = this.deals.findIndex(d => d.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Deal not found');
    }
    
    const updatedDeal = {
      ...this.deals[index],
      ...dealData,
      Id: this.deals[index].Id, // Prevent Id modification
      updatedAt: new Date().toISOString()
    };
    
    this.deals[index] = updatedDeal;
    return { ...updatedDeal };
  }

  async updateStage(id, newStage) {
    await delay(250);
    return this.update(id, { stage: newStage });
  }

  async delete(id) {
    await delay(250);
    const index = this.deals.findIndex(d => d.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Deal not found');
    }
    
    const deletedDeal = this.deals.splice(index, 1)[0];
    return { ...deletedDeal };
  }

  async getStages() {
    await delay(100);
    return [...this.stages];
  }

  async getDealsByStage() {
    await delay(300);
    const dealsByStage = {};
    this.stages.forEach(stage => {
      dealsByStage[stage] = this.deals.filter(d => d.stage === stage);
    });
    return dealsByStage;
  }
}

export default new DealService();