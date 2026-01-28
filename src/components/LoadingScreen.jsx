import { motion } from 'framer-motion';

export function LoadingScreen({ progress }) {
  const { phase, count, current, total } = progress || {};

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 mx-auto mb-6"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
            <circle
              cx="12"
              cy="12"
              r="10"
              className="stroke-gray-200 dark:stroke-gray-700"
              strokeWidth="3"
            />
            <path
              d="M12 2a10 10 0 0 1 10 10"
              stroke="#ef4444"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Scanning your inbox...
        </h2>

        <p className="text-gray-500 dark:text-gray-400 mb-4">
          {phase === 'listing' && `Found ${count || 0} emails so far...`}
          {phase === 'fetching' && `Processing ${current || 0} of ${total || 0} emails...`}
          {!phase && 'Starting scan...'}
        </p>

        {phase === 'fetching' && total > 0 && (
          <div className="w-64 mx-auto">
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-red-500"
                initial={{ width: 0 }}
                animate={{ width: `${(current / total) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              {Math.round((current / total) * 100)}%
            </p>
          </div>
        )}

        <motion.div
          className="mt-8 flex justify-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-red-400 rounded-full"
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
