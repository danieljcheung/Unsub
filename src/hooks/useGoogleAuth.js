import { useState, useEffect, useCallback } from 'react';

const SCOPES = 'https://www.googleapis.com/auth/gmail.readonly';

export function useGoogleAuth(clientId) {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tokenClient, setTokenClient] = useState(null);

  useEffect(() => {
    if (!clientId) return;

    const initializeGsi = () => {
      if (!window.google?.accounts?.oauth2) {
        setTimeout(initializeGsi, 100);
        return;
      }

      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: SCOPES,
        callback: (response) => {
          if (response.error) {
            setError(response.error);
            setIsLoading(false);
            return;
          }
          setAccessToken(response.access_token);
          fetchUserInfo(response.access_token);
        },
      });
      setTokenClient(client);
    };

    initializeGsi();
  }, [clientId]);

  const fetchUserInfo = async (token) => {
    try {
      const response = await fetch(
        'https://www.googleapis.com/oauth2/v2/userinfo',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setUser(data);
    } catch (err) {
      console.error('Failed to fetch user info:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = useCallback(() => {
    if (!tokenClient) {
      setError('Google Sign-In not initialized');
      return;
    }
    setIsLoading(true);
    setError(null);
    tokenClient.requestAccessToken({ prompt: 'consent' });
  }, [tokenClient]);

  const signOut = useCallback(() => {
    if (accessToken) {
      window.google.accounts.oauth2.revoke(accessToken, () => {
        setAccessToken(null);
        setUser(null);
      });
    }
  }, [accessToken]);

  return {
    accessToken,
    user,
    isLoading,
    error,
    signIn,
    signOut,
    isAuthenticated: !!accessToken,
    isReady: !!tokenClient,
  };
}
