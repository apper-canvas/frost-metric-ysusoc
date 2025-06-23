import { useState } from 'react';
import { motion } from 'framer-motion';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search...", 
  className = '',
  debounceMs = 300 
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (value) => {
    setQuery(value);
    
    // Debounced search
    const timeoutId = setTimeout(() => {
      onSearch(value);
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          icon="Search"
          iconPosition="left"
          className="pr-10"
        />
        
        {query && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors"
          >
            <ApperIcon name="X" className="w-4 h-4 text-gray-400" />
          </motion.button>
        )}
      </div>

      {/* Search suggestions or results overlay could go here */}
      {isFocused && query && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
        >
          <div className="p-2 text-sm text-gray-500">
            Press Enter to search for "{query}"
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SearchBar;