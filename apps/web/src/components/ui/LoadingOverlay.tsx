import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

export function LoadingOverlay({ isVisible, message = 'Saving...' }: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-8 shadow-2xl border border-gray-200 flex flex-col items-center gap-4 min-w-[280px]">
        <div className="relative">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <div className="absolute inset-0 rounded-full border-2 border-gray-200"></div>
        </div>
        
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {message}
          </h3>
          <p className="text-sm text-gray-500">
            Please wait while we save your profile changes
          </p>
        </div>
        
        {/* Animated progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div className="bg-blue-600 h-1.5 rounded-full animate-pulse" style={{ width: '70%' }}></div>
        </div>
      </div>
    </div>
  );
}
