import React from 'react';
import { Clock, FileText, BarChart } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#1F2937] border-t border-gray-700">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex justify-around">
          <button
            onClick={() => onTabChange('time')}
            className={`flex flex-col items-center py-4 px-6 ${
              activeTab === 'time'
                ? 'text-blue-500'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Clock className="h-6 w-6" />
            <span className="text-sm mt-1">Time</span>
          </button>

          <button
            onClick={() => onTabChange('invoice')}
            className={`flex flex-col items-center py-4 px-6 ${
              activeTab === 'invoice'
                ? 'text-blue-400'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <FileText className="h-6 w-6" />
            <span className="text-sm mt-1">Invoice</span>
          </button>

          <button
            onClick={() => onTabChange('reports')}
            className={`flex flex-col items-center py-4 px-6 ${
              activeTab === 'reports'
                ? 'text-blue-400'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <BarChart className="h-6 w-6" />
            <span className="text-sm mt-1">Reports</span>
          </button>
        </div>
      </div>
    </nav>
  );
}