import activitiesData from '../mockData/activities.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ActivityService {
  constructor() {
    this.activities = [...activitiesData];
    this.types = ['call', 'email', 'meeting', 'note'];
  }

  async getAll() {
    await delay(300);
    return [...this.activities].sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  async getById(id) {
    await delay(200);
    const activity = this.activities.find(a => a.Id === parseInt(id, 10));
    if (!activity) {
      throw new Error('Activity not found');
    }
    return { ...activity };
  }

  async getByContactId(contactId) {
    await delay(250);
    return this.activities
      .filter(a => a.contactId === parseInt(contactId, 10))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  async getByDealId(dealId) {
    await delay(250);
    return this.activities
      .filter(a => a.dealId === parseInt(dealId, 10))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  async create(activityData) {
    await delay(400);
    const maxId = Math.max(...this.activities.map(a => a.Id), 0);
    const newActivity = {
      ...activityData,
      Id: maxId + 1,
      date: activityData.date || new Date().toISOString()
    };
    this.activities.push(newActivity);
    return { ...newActivity };
  }

  async update(id, activityData) {
    await delay(300);
    const index = this.activities.findIndex(a => a.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Activity not found');
    }
    
    const updatedActivity = {
      ...this.activities[index],
      ...activityData,
      Id: this.activities[index].Id // Prevent Id modification
    };
    
    this.activities[index] = updatedActivity;
    return { ...updatedActivity };
  }

  async delete(id) {
    await delay(250);
    const index = this.activities.findIndex(a => a.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Activity not found');
    }
    
    const deletedActivity = this.activities.splice(index, 1)[0];
    return { ...deletedActivity };
  }

  async getTypes() {
    await delay(100);
    return [...this.types];
  }

  async getRecent(limit = 10) {
    await delay(200);
    return [...this.activities]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  }
}

export default new ActivityService();