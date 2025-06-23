import contactService from './contactService';
import activityService from './activityService';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class EmailIntegrationService {
  constructor() {
    this.isConnected = false;
    this.emailAccounts = [];
    this.monitoringInterval = null;
    this.lastSync = null;
  }

  async connectEmailAccount(accountConfig) {
    await delay(500);
    
    // Mock email account connection
    const newAccount = {
      Id: this.emailAccounts.length + 1,
      email: accountConfig.email,
      provider: accountConfig.provider,
      isActive: true,
      lastSync: new Date().toISOString(),
      syncStatus: 'connected'
    };
    
    this.emailAccounts.push(newAccount);
    this.isConnected = true;
    
    return { ...newAccount };
  }

  async disconnectEmailAccount(accountId) {
    await delay(300);
    
    const index = this.emailAccounts.findIndex(acc => acc.Id === parseInt(accountId, 10));
    if (index === -1) {
      throw new Error('Email account not found');
    }
    
    this.emailAccounts[index].isActive = false;
    this.emailAccounts[index].syncStatus = 'disconnected';
    
    return { ...this.emailAccounts[index] };
  }

  async getEmailAccounts() {
    await delay(200);
    return [...this.emailAccounts];
  }

  async syncEmails(accountId = null) {
    await delay(800);
    
    // Mock email sync - in real implementation, this would:
    // 1. Connect to email provider (IMAP/POP3)
    // 2. Fetch recent emails
    // 3. Match emails to contacts
    // 4. Create activity records
    
    const mockEmails = [
      {
        subject: 'Follow-up on proposal',
        sender: 'sarah.johnson@marketingpro.com',
        recipient: 'sales@company.com',
        date: new Date().toISOString(),
        body: 'Thanks for the proposal. We are reviewing internally and will get back to you soon.'
      },
      {
        subject: 'Re: Implementation timeline',
        sender: 'sales@company.com',
        recipient: 'michael.chen@techcorp.com',
        date: new Date(Date.now() - 3600000).toISOString(),
        body: 'Hi Michael, attached is the updated implementation timeline.'
      }
    ];

    const loggedEmails = [];
    
    for (const email of mockEmails) {
      try {
        const contactId = await this.findContactByEmail(email.sender === 'sales@company.com' ? email.recipient : email.sender);
        
        if (contactId) {
          const emailActivity = await activityService.createEmailActivity({
            subject: email.subject,
            body: email.body,
            contactId: contactId,
            direction: email.sender === 'sales@company.com' ? 'sent' : 'received',
            sender: email.sender,
            recipient: email.recipient,
            date: email.date
          });
          
          loggedEmails.push(emailActivity);
        }
      } catch (error) {
        console.error('Error logging email:', error);
      }
    }
    
    this.lastSync = new Date().toISOString();
    
    return {
      syncedCount: loggedEmails.length,
      lastSync: this.lastSync,
      emails: loggedEmails
    };
  }

  async findContactByEmail(email) {
    await delay(100);
    
    try {
      const contacts = await contactService.getAll();
      const contact = contacts.find(c => 
        c.email && c.email.toLowerCase() === email.toLowerCase()
      );
      
      return contact ? contact.Id : null;
    } catch (error) {
      console.error('Error finding contact by email:', error);
      return null;
    }
  }

  async startAutoSync(intervalMinutes = 15) {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
    
    this.monitoringInterval = setInterval(async () => {
      try {
        await this.syncEmails();
      } catch (error) {
        console.error('Auto sync error:', error);
      }
    }, intervalMinutes * 60 * 1000);
    
    return { status: 'started', interval: intervalMinutes };
  }

  async stopAutoSync() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    
    return { status: 'stopped' };
  }

  async getStatus() {
    await delay(100);
    
    return {
      isConnected: this.isConnected,
      accountCount: this.emailAccounts.length,
      activeAccounts: this.emailAccounts.filter(acc => acc.isActive).length,
      lastSync: this.lastSync,
      autoSyncEnabled: !!this.monitoringInterval
    };
  }

  async testConnection(accountConfig) {
    await delay(1000);
    
    // Mock connection test
    const isValid = accountConfig.email && accountConfig.email.includes('@');
    
    return {
      success: isValid,
      message: isValid ? 'Connection successful' : 'Invalid email configuration'
    };
  }
}

export default new EmailIntegrationService();