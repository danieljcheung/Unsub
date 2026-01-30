import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SenderCard } from './SenderCard';

export function SenderList({
  senders,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onDeselectAll,
  processingStatus,
}) {
  const [search, setSearch] = useState('');

  const filteredSenders = senders.filter((sender) => {
    if (!search.trim()) return true;
    const query = search.toLowerCase();
    return (
      sender.name.toLowerCase().includes(query) ||
      sender.email.toLowerCase().includes(query)
    );
  });

  const totalEmails = filteredSenders.reduce((sum, s) => sum + s.messages.length, 0);
  const allSelected = filteredSenders.length > 0 &&
    filteredSenders.every((s) => selectedIds.has(s.email));

  const handleSelectAll = () => {
    if (allSelected) {
      onDeselectAll();
    } else {
      // Select all filtered senders
      filteredSenders.forEach((s) => {
        if (!selectedIds.has(s.email)) {
          onToggleSelect(s.email);
        }
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {search ? `${filteredSenders.length} of ${senders.length}` : senders.length} senders
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              {totalEmails} emails with unsubscribe options
            </p>
          </div>
          {filteredSenders.length > 0 && (
            <button
              onClick={handleSelectAll}
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {allSelected ? 'Deselect all' : 'Select all'}
            </button>
          )}
        </div>

        {senders.length > 0 && (
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search senders..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredSenders.map((sender) => (
            <SenderCard
              key={sender.email}
              sender={sender}
              isSelected={selectedIds.has(sender.email)}
              onToggle={() => onToggleSelect(sender.email)}
              status={processingStatus.get(sender.email)}
            />
          ))}
        </AnimatePresence>
      </div>

      {senders.length > 0 && filteredSenders.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No matches
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            No senders match "{search}"
          </p>
        </motion.div>
      )}

      {senders.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            All clean!
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            No more senders with unsubscribe links found.
          </p>
        </motion.div>
      )}
    </div>
  );
}
