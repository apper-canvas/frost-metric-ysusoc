import tasksData from '../mockData/tasks.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TaskService {
  constructor() {
    this.tasks = [...tasksData];
    this.statuses = ['pending', 'in-progress', 'completed', 'overdue'];
    this.priorities = ['low', 'medium', 'high'];
  }

  async getAll() {
    await delay(300);
    return [...this.tasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }

  async getById(id) {
    await delay(200);
    const task = this.tasks.find(t => t.Id === parseInt(id, 10));
    if (!task) {
      throw new Error('Task not found');
    }
    return { ...task };
  }

  async getByContactId(contactId) {
    await delay(250);
    return this.tasks
      .filter(t => t.contactId === parseInt(contactId, 10))
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }

  async getByDealId(dealId) {
    await delay(250);
    return this.tasks
      .filter(t => t.dealId === parseInt(dealId, 10))
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }

  async create(taskData) {
    await delay(400);
    const maxId = Math.max(...this.tasks.map(t => t.Id), 0);
    const newTask = {
      ...taskData,
      Id: maxId + 1,
      status: taskData.status || 'pending',
      priority: taskData.priority || 'medium',
      createdAt: new Date().toISOString()
    };
    this.tasks.push(newTask);
    return { ...newTask };
  }

  async update(id, taskData) {
    await delay(300);
    const index = this.tasks.findIndex(t => t.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    const updatedTask = {
      ...this.tasks[index],
      ...taskData,
      Id: this.tasks[index].Id // Prevent Id modification
    };
    
    this.tasks[index] = updatedTask;
    return { ...updatedTask };
  }

  async updateStatus(id, status) {
    await delay(250);
    return this.update(id, { status });
  }

  async delete(id) {
    await delay(250);
    const index = this.tasks.findIndex(t => t.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    const deletedTask = this.tasks.splice(index, 1)[0];
    return { ...deletedTask };
  }

  async getStatuses() {
    await delay(100);
    return [...this.statuses];
  }

  async getPriorities() {
    await delay(100);
    return [...this.priorities];
  }

  async getUpcoming(days = 7) {
    await delay(200);
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    
    return this.tasks
      .filter(t => t.status !== 'completed' && new Date(t.dueDate) <= futureDate)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }

  async getOverdue() {
    await delay(200);
    const now = new Date();
    return this.tasks
      .filter(t => t.status !== 'completed' && new Date(t.dueDate) < now)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }
}

export default new TaskService();