import { motion } from 'framer-motion';
import PipelineBoard from '@/components/organisms/PipelineBoard';

const Pipeline = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-6"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Sales Pipeline</h1>
        <p className="text-gray-600 mt-1">
          Track your deals through each stage of the sales process.
        </p>
      </div>

      <PipelineBoard />
    </motion.div>
  );
};

export default Pipeline;