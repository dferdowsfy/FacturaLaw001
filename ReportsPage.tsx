import React from 'react';
import { TimeEntry } from '../../types/time';

interface ReportsPageProps {
  entries: TimeEntry[];
}

const ReportsPage = ({ entries }: ReportsPageProps) => {
  console.log('Entries received in Reports:', entries);

  return (
    <div className="px-4 py-6 sm:px-0 text-black">
      <h1 className="text-4xl font-bold mb-8 pl-4 text-white">Reports & Analytics</h1>
      <div className="bg-[#1F2937] p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4 text-white">Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-600 bg-opacity-20 p-4 rounded-lg">
            <h3 className="text-blue-400 text-sm">Total Revenue</h3>
            <p className="text-2xl font-bold text-white">
              ${entries.reduce((sum, entry) => sum + entry.total, 0).toFixed(2)}
            </p>
          </div>
          <div className="bg-green-600 bg-opacity-20 p-4 rounded-lg">
            <h3 className="text-green-400 text-sm">Total Hours</h3>
            <p className="text-2xl font-bold text-white">
              {entries.reduce((sum, entry) => sum + (entry.hours || 0), 0).toFixed(1)}h
            </p>
          </div>
          <div className="bg-yellow-600 bg-opacity-20 p-4 rounded-lg">
            <h3 className="text-yellow-400 text-sm">Average Rate</h3>
            <p className="text-2xl font-bold text-white">
              ${Math.round(entries.reduce((sum, entry) => sum + entry.hourlyRate, 0) / entries.length || 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ReportsPage };