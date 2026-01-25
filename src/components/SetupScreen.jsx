import { useState } from 'react';
import { motion } from 'framer-motion';

export function SetupScreen({ onClientIdSet, clientId, onSignIn, isReady, isLoading, error }) {
  const [inputValue, setInputValue] = useState(clientId || '');
  const [showInstructions, setShowInstructions] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onClientIdSet(inputValue.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <motion.h1
            className="text-5xl font-bold text-gray-900 mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Unsub
          </motion.h1>
          <motion.p
            className="text-gray-500 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Mass unsubscribe from email newsletters
          </motion.p>
        </div>

        <motion.div
          className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          {!clientId ? (
            <>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Google OAuth Client ID
                  </label>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="xxxxx.apps.googleusercontent.com"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white font-medium py-3 rounded-lg transition-colors"
                >
                  Continue
                </button>
              </form>

              <div className="mt-4">
                <button
                  onClick={() => setShowInstructions(!showInstructions)}
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                >
                  <span>{showInstructions ? 'Hide' : 'Show'} setup instructions</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${showInstructions ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showInstructions && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 text-sm text-gray-600 space-y-2"
                  >
                    <ol className="list-decimal list-inside space-y-2">
                      <li>Go to <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-red-500 hover:underline">Google Cloud Console</a></li>
                      <li>Create a new project or select existing</li>
                      <li>Enable the Gmail API</li>
                      <li>Go to Credentials → Create OAuth 2.0 Client ID</li>
                      <li>Set application type to "Web application"</li>
                      <li>Add <code className="bg-gray-100 px-1 rounded">http://localhost:5173</code> to authorized JavaScript origins</li>
                      <li>Copy the Client ID and paste it above</li>
                    </ol>
                  </motion.div>
                )}
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-500 text-center">
                Sign in with your Google account to scan for subscriptions
              </p>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                onClick={onSignIn}
                disabled={!isReady || isLoading}
                className="w-full bg-white hover:bg-gray-50 disabled:bg-gray-100 text-gray-700 font-medium py-3 rounded-lg border border-gray-200 transition-colors flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-gray-500" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Sign in with Google
                  </>
                )}
              </button>

              <button
                onClick={() => onClientIdSet('')}
                className="w-full text-sm text-gray-500 hover:text-gray-700"
              >
                Change Client ID
              </button>
            </div>
          )}
        </motion.div>

        <motion.p
          className="text-center text-xs text-gray-400 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Your data never leaves your browser. No backend, no tracking.
        </motion.p>
      </motion.div>
    </div>
  );
}
