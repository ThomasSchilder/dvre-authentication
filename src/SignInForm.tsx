import React, { useState, useEffect, useCallback } from 'react';
import { TokenPayload } from './types';
import { createToken } from './tokenCreator';
import {
  storeToken,
  clearToken,
  getStoredPayload,
  isTokenValid
} from './tokenStorage';

function truncateAddress(address: string): string {
  if (address.length <= 12) {
    return address;
  }
  return address.slice(0, 18) + '\u2026' + address.slice(-8);
}

function formatExpiry(exp: number): string {
  const date = new Date(exp * 1000);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const SignInForm = (): JSX.Element => {
  const [payload, setPayload] = useState<TokenPayload | null>(null);
  const [signing, setSigning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = getStoredPayload();
    if (isTokenValid(stored)) {
      setPayload(stored);
    } else if (stored) {
      clearToken();
    }
  }, []);

  const handleSignIn = useCallback(async () => {
    if (!window.ethereum) {
      setError('MetaMask is not installed. Please install MetaMask to sign in.');
      return;
    }

    setSigning(true);
    setError(null);

    try {
      const token = await createToken(window.ethereum);
      storeToken(token);
      const stored = getStoredPayload();
      setPayload(stored);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to sign in';
      setError(message);
    } finally {
      setSigning(false);
    }
  }, []);

  const handleSignOut = useCallback(() => {
    clearToken();
    setPayload(null);
    setError(null);
  }, []);

  if (payload) {
    return (
      <div className="jp-auth-signed-in">
        <div className="jp-auth-address-row">
          <span className="jp-auth-label">Signed in as</span>
          <code className="jp-auth-address">
            {truncateAddress(payload.sub)}
          </code>
        </div>
        <div className="jp-auth-expiry-row">
          <span className="jp-auth-label">Token expires at</span>
          <span className="jp-auth-expiry">{formatExpiry(payload.exp)}</span>
        </div>
        <button
          type="button"
          className="jp-auth-sign-out-btn"
          onClick={handleSignOut}
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="jp-auth-signed-out">
      <p className="jp-auth-description">
        Sign in with your Ethereum wallet to authenticate with the DVRE. A
        self-signed token will be created and stored in your browser for
        subsequent API calls.
      </p>
      <button
        type="button"
        className="jp-auth-sign-in-btn"
        onClick={handleSignIn}
        disabled={signing}
      >
        {signing ? 'Signing\u2026' : 'Sign In with MetaMask'}
      </button>
      {error && <p className="jp-auth-error">{error}</p>}
    </div>
  );
};

export default SignInForm;
