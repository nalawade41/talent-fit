import { useState } from 'react';
import { Clock, CheckCircle2 } from 'lucide-react';

interface AvailabilityToggleProps {
  isAvailable: boolean;
  onAvailabilityChange: (available: boolean) => void;
}

export function AvailabilityToggle({ isAvailable, onAvailabilityChange }: AvailabilityToggleProps) {
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async () => {
    setIsToggling(true);
    // Simulate a brief delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 200));
    onAvailabilityChange(!isAvailable);
    setIsToggling(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-500" />
          <div>
            <label className="text-sm font-medium text-gray-900">
              Availability for Additional Work
            </label>
            <p className="text-xs text-gray-500">
              Indicate if you're available for urgent projects or additional assignments
            </p>
          </div>
        </div>

        {/* Toggle Switch */}
        <button
          type="button"
          onClick={handleToggle}
          disabled={isToggling}
          className={`
            relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
            transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            ${isAvailable 
              ? 'bg-green-600' 
              : 'bg-gray-200'
            }
            ${isToggling ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <span className="sr-only">
            {isAvailable ? 'Mark as unavailable' : 'Mark as available'}
          </span>
          <span
            className={`
              pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
              transition duration-200 ease-in-out
              ${isAvailable ? 'translate-x-5' : 'translate-x-0'}
            `}
          />
        </button>
      </div>

      {/* Status Display */}
      <div className={`
        flex items-center gap-2 p-3 rounded-md text-sm
        ${isAvailable 
          ? 'bg-green-50 text-green-700 border border-green-200' 
          : 'bg-gray-50 text-gray-600 border border-gray-200'
        }
      `}>
        <CheckCircle2 className={`w-4 h-4 ${isAvailable ? 'text-green-500' : 'text-gray-400'}`} />
        <div>
          <div className="font-medium">
            {isAvailable ? 'Available for Additional Work' : 'Not Available for Additional Work'}
          </div>
          <div className="text-xs mt-0.5">
            {isAvailable 
              ? 'Managers can assign you to urgent projects and additional assignments'
              : 'You will only be assigned to your regular workload and scheduled projects'
            }
          </div>
        </div>
      </div>
    </div>
  );
}
