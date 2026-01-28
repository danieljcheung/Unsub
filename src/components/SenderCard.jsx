import { useState } from 'react';
import { motion } from 'framer-motion';
import { getSenderLogo } from '../services/gmail';

export function SenderCard({ sender, isSelected, onToggle, status }) {
  const [imgError, setImgError] = useState(false);
  const logoUrl = getSenderLogo(sender.email);

  const getStatusStyles = () => {
    switch (status) {
      case 'processing':
        return 'ring-2 ring-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
      case 'done':
        return 'ring-2 ring-green-400 bg-green-50 dark:bg-green-900/20';
      case 'error':
        return 'ring-2 ring-red-400 bg-red-50 dark:bg-red-900/20';
      default:
        return isSelected
          ? 'ring-2 ring-red-400 bg-red-50 dark:bg-red-900/20'
          : 'hover:shadow-md dark:hover:shadow-gray-900/50';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      whileHover={{ y: -2 }}
      className={`relative bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer transition-all ${getStatusStyles()}`}
      onClick={() => status !== 'done' && onToggle()}
    >
      {status === 'done' && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
        >
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      )}

      {status === 'processing' && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center"
        >
          <svg className="w-4 h-4 text-white animate-spin" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </motion.div>
      )}

      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {!imgError && logoUrl ? (
            <img
              src={logoUrl}
              alt=""
              className="w-10 h-10 rounded-lg object-contain bg-gray-50 dark:bg-gray-700"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center">
              <span className="text-gray-500 dark:text-gray-300 font-semibold text-sm">
                {sender.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 dark:text-white truncate">{sender.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{sender.email}</p>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            {sender.messages.length} emails
          </span>
          {sender.hasOneClickUnsubscribe && (
            <span className="text-xs text-green-600 dark:text-green-400">1-click unsub</span>
          )}
        </div>
      </div>

      {/* Checkbox */}
      <div className="absolute top-3 left-3">
        <motion.div
          initial={false}
          animate={{
            scale: isSelected ? 1 : 0.8,
            opacity: isSelected ? 1 : 0,
          }}
          className="w-5 h-5 rounded bg-red-500 flex items-center justify-center"
        >
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      </div>
    </motion.div>
  );
}
