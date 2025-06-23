import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import contactService from '@/services/api/contactService';
import ContactCard from '@/components/molecules/ContactCard';
import SearchBar from '@/components/molecules/SearchBar';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = contacts.filter(contact => 
        contact.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredContacts(filtered);
    } else {
      setFilteredContacts(contacts);
    }
  }, [contacts, searchQuery]);

  const loadContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await contactService.getAll();
      setContacts(result);
    } catch (err) {
      setError(err.message || 'Failed to load contacts');
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleEdit = (contact) => {
    // Edit functionality would open a modal in real implementation
    console.log('Edit contact:', contact);
    toast.info('Edit functionality coming soon');
  };

  const handleDelete = async (contact) => {
    if (window.confirm(`Are you sure you want to delete ${contact.firstName} ${contact.lastName}?`)) {
      try {
        await contactService.delete(contact.Id);
        await loadContacts();
        toast.success('Contact deleted successfully');
      } catch (err) {
        toast.error('Failed to delete contact');
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-lg p-6 shadow-sm"
          >
            <div className="animate-pulse space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name="AlertCircle" className="w-8 h-8 text-error" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Contacts</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={loadContacts} variant="primary">
          Try Again
        </Button>
      </div>
    );
  }

  if (filteredContacts.length === 0 && !searchQuery) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name="Users" className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Contacts Yet</h3>
        <p className="text-gray-600 mb-4">Get started by adding your first contact</p>
        <Button 
          onClick={() => toast.info('Add contact functionality coming soon')} 
          variant="primary"
          icon="Plus"
        >
          Add Contact
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <SearchBar 
          onSearch={handleSearch}
          placeholder="Search contacts..."
          className="w-full sm:w-96"
        />
        <Button 
          onClick={() => toast.info('Add contact functionality coming soon')}
          variant="primary"
          icon="Plus"
          className="w-full sm:w-auto"
        >
          Add Contact
        </Button>
      </div>

      {searchQuery && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Showing {filteredContacts.length} result{filteredContacts.length !== 1 ? 's' : ''} for "{searchQuery}"</span>
          <button 
            onClick={() => setSearchQuery('')}
            className="text-primary hover:text-primary/80"
          >
            Clear
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredContacts.map((contact, index) => (
            <motion.div
              key={contact.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
            >
              <ContactCard
                contact={contact}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredContacts.length === 0 && searchQuery && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Search" className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Results Found</h3>
          <p className="text-gray-600">Try adjusting your search terms</p>
        </div>
      )}
    </div>
  );
};

export default ContactList;