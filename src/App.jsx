import { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useGoogleAuth } from './hooks/useGoogleAuth';
import { useTheme } from './hooks/useTheme';
import { fetchEmailsWithUnsubscribe, groupBySender } from './services/gmail';
import { Header } from './components/Header';
import { SetupScreen } from './components/SetupScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { SenderList } from './components/SenderList';

const STORAGE_KEY = 'unsub_client_id';

function App() {
  const [clientId, setClientId] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
  });
  const [senders, setSenders] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [processingStatus, setProcessingStatus] = useState(new Map());
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cleanedCount, setCleanedCount] = useState(0);
  const hasFetchedRef = useRef(false);

  const { isDark, toggleTheme } = useTheme();

  const {
    accessToken,
    user,
    isLoading,
    error,
    signIn,
    signOut,
    isAuthenticated,
    isReady,
  } = useGoogleAuth(clientId);

  const handleClientIdSet = (id) => {
    setClientId(id);
    if (id) {
      localStorage.setItem(STORAGE_KEY, id);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const scanEmails = useCallback(async () => {
    if (!accessToken) return;

    setIsScanning(true);
    setScanProgress({ phase: 'starting' });

    try {
      const messages = await fetchEmailsWithUnsubscribe(
        accessToken,
        (progress) => setScanProgress(progress),
        500
      );
      const grouped = groupBySender(messages);
      setSenders(grouped);
    } catch (err) {
      console.error('Failed to scan emails:', err);
    } finally {
      setIsScanning(false);
      setScanProgress(null);
    }
  }, [accessToken]);

  useEffect(() => {
    if (isAuthenticated && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      scanEmails();
    }
  }, [isAuthenticated, scanEmails]);

  const toggleSelect = (email) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(email)) {
        next.delete(email);
      } else {
        next.add(email);
      }
      return next;
    });
  };

  const selectAll = () => {
    setSelectedIds(new Set(senders.map((s) => s.email)));
  };

  const deselectAll = () => {
    setSelectedIds(new Set());
  };

  const handleUnsubscribe = async () => {
    if (selectedIds.size === 0) return;

    setIsProcessing(true);
    const selected = senders.filter((s) => selectedIds.has(s.email));

    for (const sender of selected) {
      setProcessingStatus((prev) => new Map(prev).set(sender.email, 'processing'));

      const { httpUrl, mailto } = sender.unsubscribeLinks;

      try {
        if (httpUrl) {
          // Open HTTP unsubscribe link in new tab
          window.open(httpUrl, '_blank', 'noopener,noreferrer');
        } else if (mailto) {
          // Open mailto link (will open email client)
          window.location.href = mailto;
        }

        // Small delay for visual feedback
        await new Promise((r) => setTimeout(r, 500));

        setProcessingStatus((prev) => new Map(prev).set(sender.email, 'done'));
        setCleanedCount((prev) => prev + 1);
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(sender.email);
          return next;
        });
      } catch (err) {
        console.error(`Failed to unsubscribe from ${sender.email}:`, err);
        setProcessingStatus((prev) => new Map(prev).set(sender.email, 'error'));
      }

      // Delay between each unsubscribe to not overwhelm
      await new Promise((r) => setTimeout(r, 300));
    }

    setIsProcessing(false);

    // Remove processed senders after animation
    setTimeout(() => {
      setSenders((prev) =>
        prev.filter((s) => processingStatus.get(s.email) !== 'done')
      );
      setProcessingStatus(new Map());
    }, 2000);
  };

  const handleSignOut = () => {
    signOut();
    setSenders([]);
    setSelectedIds(new Set());
    setProcessingStatus(new Map());
    hasFetchedRef.current = false;
  };

  // Show setup screen if not authenticated
  if (!isAuthenticated) {
    return (
      <SetupScreen
        clientId={clientId}
        onClientIdSet={handleClientIdSet}
        onSignIn={signIn}
        isReady={isReady}
        isLoading={isLoading}
        error={error}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />
    );
  }

  // Show loading screen while scanning
  if (isScanning) {
    return <LoadingScreen progress={scanProgress} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header
        user={user}
        onSignOut={handleSignOut}
        selectedCount={selectedIds.size}
        onUnsubscribe={handleUnsubscribe}
        isProcessing={isProcessing}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        cleanedCount={cleanedCount}
      />

      <AnimatePresence mode="wait">
        <SenderList
          senders={senders}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onSelectAll={selectAll}
          onDeselectAll={deselectAll}
          processingStatus={processingStatus}
        />
      </AnimatePresence>
    </div>
  );
}

export default App;
