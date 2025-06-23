import { motion } from 'framer-motion';
import ContactList from '@/components/organisms/ContactList';

const Contacts = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-6"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
        <p className="text-gray-600 mt-1">
          Manage your customer relationships and contact information.
        </p>
      </div>

      <ContactList />
    </motion.div>
  );
};

export default Contacts;