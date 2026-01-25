import { motion } from 'framer-motion';

export function Header({ user, onSignOut, selectedCount, onUnsubscribe, isProcessing }) {
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.h1
            className="text-2xl font-bold text-gray-900"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Unsub
          </motion.h1>
          <span className="text-sm text-gray-500">Wall of Shame</span>
        </div>

        <div className="flex items-center gap-4">
          {selectedCount > 0 && (
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onUnsubscribe}
              disabled={isProcessing}
              className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-semibold px-6 py-2.5 rounded-full shadow-lg shadow-red-500/30 transition-colors"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </span>
              ) : (
                `Unsubscribe (${selectedCount})`
              )}
            </motion.button>
          )}

          {user && (
            <div className="flex items-center gap-3">
              <img
                src={user.picture}
                alt={user.name}
                className="w-8 h-8 rounded-full"
              />
              <button
                onClick={onSignOut}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
