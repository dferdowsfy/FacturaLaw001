import React from 'react';
import { Clock } from 'lucide-react';

interface TimeCountdownBannerProps {
  daysRemaining: number;
}

export function TimeCountdownBanner({ daysRemaining }: TimeCountdownBannerProps) {
  return (
    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
      <div className="flex items-center">
        <Clock className="h-5 w-5 text-blue-400 mr-2" />
        <p className="text-sm text-blue-700">
          Editing allowed for 30 days.{' '}
          <span className="font-medium">
            {daysRemaining > 0
              ? `${daysRemaining} days remaining`
              : 'Editing period has expired'}
          </span>
        </p>
      </div>
    </div>
  );
}