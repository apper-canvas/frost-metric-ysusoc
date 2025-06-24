import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import FilterBuilder from "@/components/organisms/FilterBuilder";
import contactService from "@/services/api/contactService";
import { getAll } from "@/services/api/customFieldService";
import ApperIcon from "@/components/ApperIcon";
import Contacts from "@/components/pages/Contacts";
import SearchBar from "@/components/molecules/SearchBar";
import ContactCard from "@/components/molecules/ContactCard";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterBuilder, setShowFilterBuilder] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);
  const [availableFields, setAvailableFields] = useState([]);
  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    tags: '',
    notes: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
useEffect(() => {
    loadContacts();
    loadFilterFields();
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

  const loadFilterFields = async () => {
    try {
      const fields = await contactService.getFilterFields();
      setAvailableFields(fields);
    } catch (error) {
      console.error('Failed to load filter fields:', error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleApplyFilter = async (filterConfig) => {
    if (!filterConfig) {
      setActiveFilter(null);
      setFilteredContacts(contacts);
      return;
    }

    setLoading(true);
    try {
      const filtered = await contactService.advancedFilter(filterConfig);
      setFilteredContacts(filtered);
      setActiveFilter(filterConfig);
      setShowFilterBuilder(false);
    } catch (error) {
      toast.error('Failed to apply filter');
    } finally {
      setLoading(false);
    }
};

  const handleOpenContactForm = () => {
    setShowContactForm(true);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      position: '',
      tags: '',
      notes: ''
    });
    setFormErrors({});
  };

  const handleCloseContactForm = () => {
    setShowContactForm(false);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      position: '',
      tags: '',
      notes: ''
    });
    setFormErrors({});
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    return errors;
  };

  const handleSubmitContact = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const contactData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
      };
      await contactService.create(contactData);
      await loadContacts();
      toast.success('Contact created successfully');
      handleCloseContactForm();
    } catch (err) {
      toast.error('Failed to create contact');
    } finally {
      setSubmitting(false);
    }
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
          onClick={handleOpenContactForm}
          variant="primary"
          icon="Plus"
        >
          Add Contact
        </Button>
      </div>
    );
  }

return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-3 w-full sm:w-auto">
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Search contacts..."
              className="flex-1 sm:w-96"
            />
            <Button 
              onClick={() => setShowFilterBuilder(true)}
              variant="secondary"
              icon="Filter"
              className={activeFilter ? 'border-primary text-primary' : ''}
            >
              Advanced Filters
              {activeFilter && (
                <span className="ml-1 px-1.5 py-0.5 bg-primary text-white text-xs rounded">
                  {activeFilter.conditions.length}
                </span>
              )}
            </Button>
</div>
          <Button 
            onClick={handleOpenContactForm}
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

    <FilterBuilder
      isOpen={showFilterBuilder}
      onClose={() => setShowFilterBuilder(false)}
      onApplyFilter={handleApplyFilter}
      entityType="contacts"
      availableFields={availableFields}
      currentFilter={activeFilter}
    />

    {/* Contact Form Modal */}
    <AnimatePresence>
      {showContactForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={handleCloseContactForm}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Add New Contact</h2>
              <button
                onClick={handleCloseContactForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitContact} className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <Input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleFormChange}
                    placeholder="Enter first name"
                    className={formErrors.firstName ? 'border-red-500' : ''}
                  />
                  {formErrors.firstName && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <Input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleFormChange}
                    placeholder="Enter last name"
                    className={formErrors.lastName ? 'border-red-500' : ''}
                  />
                  {formErrors.lastName && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  placeholder="Enter email address"
                  className={formErrors.email ? 'border-red-500' : ''}
                />
                {formErrors.email && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <Input
                  name="company"
                  value={formData.company}
                  onChange={handleFormChange}
                  placeholder="Enter company name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position
                </label>
                <Input
                  name="position"
                  value={formData.position}
                  onChange={handleFormChange}
                  placeholder="Enter job position"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <Input
                  name="tags"
                  value={formData.tags}
                  onChange={handleFormChange}
                  placeholder="Enter tags separated by commas"
                />
                <p className="text-xs text-gray-500 mt-1">Separate multiple tags with commas</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleFormChange}
                  placeholder="Add any additional notes..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  onClick={handleCloseContactForm}
                  variant="secondary"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={submitting}
                  className="flex-1"
                >
                  {submitting ? 'Creating...' : 'Create Contact'}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </>
);
};

export default ContactList;