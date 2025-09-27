'use client';

import { useEffect, useRef, useState } from 'react';

type GoogleCredentialResponse = {
  clientId: string;
  credential: string; // JWT
  select_by: string;
};

type DecodedPayload = {
  name?: string;
  email?: string;
  picture?: string;
};

const GOOGLE_CLIENT_ID =
  '590503648623-o8renddc7vofsn4h6ig3lkk43f4v4c2b.apps.googleusercontent.com';

export default function LoginPage() {
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const [user, setUser] = useState<DecodedPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Decode base64url without verifying signature (for demo only)
  function decodeJwtPayload(jwt: string): DecodedPayload | null {
    try {
      const payload = jwt.split('.')[1];
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const json =
        typeof window !== 'undefined'
          ? decodeURIComponent(
              atob(base64)
                .split('')
                .map(
                  (c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`
                )
                .join('')
            )
          : Buffer.from(base64, 'base64').toString('utf-8');
      return JSON.parse(json);
    } catch (e) {
      return null;
    }
  }

  useEffect(() => {
    if (user) return; // already signed in

    // Load Google Identity Services script
    const existing = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]'
    );
    if (existing) {
      initializeGis();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initializeGis;
    script.onerror = () => setError('Failed to load Google script');
    document.head.appendChild(script);

    function initializeGis() {
      const g = (window as any).google;
      if (!g || !buttonRef.current) return;

      g.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response: GoogleCredentialResponse) => {
          try {
            const res = await fetch(
              process.env.NEXT_PUBLIC_API_URL
                ? `${process.env.NEXT_PUBLIC_API_URL}/auth/google/login`
                : 'http://localhost:8080/auth/google/login',
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credential: response.credential }),
              }
            );
            if (!res.ok) {
              const data = await res.json().catch(() => ({}));
              throw new Error((data as any).error || 'Authentication failed');
            }
            const data = (await res.json()) as {
              name?: string;
              email?: string;
              token?: string;
            };
            if (data.token) {
              localStorage.setItem('auth_token', data.token);
            }

            // Optionally still decode locally to show avatar
            const decoded = decodeJwtPayload(response.credential);

            setUser({
              name: data.name ?? decoded?.name,
              email: data.email ?? decoded?.email,
              picture: decoded?.picture,
            });
          } catch (e: any) {
            setError(e?.message || 'Authentication failed');
          }
        },
        auto_select: false,
        ux_mode: 'popup',
      });

      g.accounts.id.renderButton(buttonRef.current, {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        shape: 'rectangular',
        text: 'signin_with',
        logo_alignment: 'left',
      });
    }

    return () => {
      // No cleanup needed for the script itself
    };
  }, [user]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif',
        padding: '2rem',
      }}
    >
      {!user ? (
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ marginBottom: '1rem' }}>Login with Google</h1>
          <div ref={buttonRef} />
          {error ? (
            <p style={{ color: '#b91c1c', marginTop: '1rem' }}>{error}</p>
          ) : null}
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          {user.picture ? (
            <img
              src={user.picture}
              alt={user.name ?? 'User avatar'}
              style={{ width: 72, height: 72, borderRadius: '50%' }}
            />
          ) : null}
          <h2 style={{ marginTop: '1rem' }}>{user.name}</h2>
          <p style={{ color: '#4b5563' }}>{user.email}</p>
        </div>
      )}
    </div>
  );
}
