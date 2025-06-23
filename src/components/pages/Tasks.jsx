import { motion } from 'framer-motion';
import TaskList from '@/components/organisms/TaskList';

const Tasks = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-6"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
        <p className="text-gray-600 mt-1">
          Manage and track your tasks and follow-ups.
        </p>
      </div>

      <TaskList />
    </motion.div>
  );
};

export default Tasks;