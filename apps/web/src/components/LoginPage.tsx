import { AlertCircle, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { loginWithGoogleCredential } = useAuth();

  useEffect(() => {
    const scriptId = 'google-identity';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.id = scriptId;
      document.head.appendChild(script);
    }

    (window as any).handleCredentialResponse = async (response: any) => {
      const credential = response?.credential as string | undefined;
      if (!credential) {
        setError('Google credential missing.');
        return;
      }
      setIsLoading(true);
      const ok = await loginWithGoogleCredential(credential);
      if (!ok) setError('Google sign-in failed.');
      setIsLoading(false);
    };
  }, [loginWithGoogleCredential]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Talent Fit</h1>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Google Sign-In button */}
          {!(import.meta as any).env.VITE_GOOGLE_CLIENT_ID && (
            <div className="mb-2 text-xs text-red-600 text-center">Missing VITE_GOOGLE_CLIENT_ID in .env</div>
          )}
          <div className="flex flex-col items-center space-y-3">
            <div
              id="g_id_onload"
              data-client_id={(import.meta as any).env.VITE_GOOGLE_CLIENT_ID}
              data-context="signin"
              data-ux_mode="popup"
              data-callback="handleCredentialResponse"
              data-auto_prompt="false"
            />
            <div
              className="g_id_signin"
              data-type="standard"
              data-shape="pill"
              data-theme="outline"
              data-text="signin_with"
              data-size="large"
              data-logo_alignment="left"
              data-width="320"
            />
            {isLoading && (
              <div className="w-full flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}