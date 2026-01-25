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
  const totalEmails = senders.reduce((sum, s) => sum + s.messages.length, 0);
  const allSelected = senders.length > 0 && selectedIds.size === senders.length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center justify-between"
      >
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Found {senders.length} senders
          </h2>
          <p className="text-gray-500">
            {totalEmails} emails with unsubscribe options
          </p>
        </div>
        {senders.length > 0 && (
          <button
            onClick={allSelected ? onDeselectAll : onSelectAll}
            className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {allSelected ? 'Deselect all' : 'Select all'}
          </button>
        )}
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {senders.map((sender) => (
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

      {senders.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            All clean!
          </h3>
          <p className="text-gray-500">
            No more senders with unsubscribe links found.
          </p>
        </motion.div>
      )}
    </div>
  );
}
