import React from 'react';
import { Play, SkipForward, CheckCircle, RotateCcw } from 'lucide-react';

interface AdminControlsProps {
  onNext: () => void;
  onSkip: () => void;
  onComplete: () => void;
  onReset: () => void;
  isQueueEmpty: boolean;
  hasActive: boolean;
}

export const AdminControls: React.FC<AdminControlsProps> = ({ 
  onNext, onSkip, onComplete, onReset, isQueueEmpty, hasActive 
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <button
        onClick={onNext}
        disabled={isQueueEmpty}
        className="col-span-2 flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 px-6 rounded-xl shadow-sm transition-all text-lg font-semibold"
      >
        <Play className="w-6 h-6 fill-current" />
        <span>{hasActive ? 'Complete & Call Next' : 'Call Next Token'}</span>
      </button>

      <button
        onClick={onComplete}
        disabled={!hasActive}
        className="flex items-center justify-center space-x-2 bg-green-100 hover:bg-green-200 disabled:bg-gray-100 disabled:text-gray-400 text-green-700 py-3 px-4 rounded-lg font-medium transition-colors"
      >
        <CheckCircle className="w-5 h-5" />
        <span>Mark Completed</span>
      </button>

      <button
        onClick={onSkip}
        disabled={!hasActive}
        className="flex items-center justify-center space-x-2 bg-amber-100 hover:bg-amber-200 disabled:bg-gray-100 disabled:text-gray-400 text-amber-700 py-3 px-4 rounded-lg font-medium transition-colors"
      >
        <SkipForward className="w-5 h-5" />
        <span>Skip Current</span>
      </button>

      <div className="col-span-2 pt-4 border-t border-gray-100 mt-2">
        <button
          onClick={() => {
            if(window.confirm('Are you sure you want to reset the entire queue? This cannot be undone.')) {
              onReset();
            }
          }}
          className="w-full flex items-center justify-center space-x-2 text-red-600 hover:bg-red-50 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset System</span>
        </button>
      </div>
    </div>
  );
};