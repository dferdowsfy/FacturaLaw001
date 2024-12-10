import React from 'react';
import { Pencil, Trash } from 'lucide-react';
import { TimeEntry } from '../../types/time';

interface TimeEntryTableProps {
  entries: TimeEntry[];
  onEdit: (entry: TimeEntry) => void;
  onDelete: (id: string) => void;
}

export function TimeEntryTable({ entries, onEdit, onDelete }: TimeEntryTableProps) {
  const isEditable = (createdAt: string) => {
    const diffDays = Math.floor(
      (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    return diffDays <= 30;
  };

  return (
    <div className="overflow-x-auto">
      <h1 className="text-5xl font-bold text-white mb-8 pl-4">Time Entries</h1>
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-[#1F2937]">
          <tr>
            <th className="px-6 py-3 text-left text-s font-medium text-gray-300 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-s font-medium text-gray-300 uppercase tracking-wider">
              Client
            </th>
            <th className="px-6 py-3 text-left text-s font-medium text-gray-300 uppercase tracking-wider">
              Matter
            </th>
            <th className="px-6 py-3 text-left text-s font-medium text-gray-300 uppercase tracking-wider">
              Hours (h) / Rate ($)
            </th>
            <th className="px-6 py-3 text-left text-s font-medium text-gray-300 uppercase tracking-wider">
              Total
            </th>
            <th className="px-6 py-3 text-left text-s font-medium text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-[#1F2937] divide-y divide-gray-700">
          {entries.map((entry) => (
            <tr key={entry.id} className="hover:bg-gray-800">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                {new Date(entry.date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                {entry.clientId}
              </td>
              <td className="px-6 py-4 text-sm text-white">
                <div className="font-medium text-white">{entry.matterName}</div>
                <div className="text-gray-400">{entry.matterId}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white" title={`${Math.round(entry.hours * 60)} minutes`}>
                {(entry.hours || 0).toFixed(2)}h / ${(entry.hourlyRate || 0).toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                ${entry.total.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                <button
                  onClick={() => onEdit(entry)}
                  disabled={!isEditable(entry.createdAt)}
                  className={`p-2 rounded-full hover:bg-gray-100 ${
                    !isEditable(entry.createdAt)
                      ? 'opacity-50 cursor-not-allowed'
                      : 'cursor-pointer hover:bg-gray-700'
                  }`}
                  title={
                    isEditable(entry.createdAt)
                      ? 'Edit entry'
                      : 'Editing no longer allowed'
                  }
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    const confirmDelete = window.confirm('Are you sure you want to delete this entry?');
                    if (confirmDelete) {
                      onDelete(entry.id);
                    }
                  }}
                  className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
                  title="Delete entry"
                >
                  <Trash className="w-4 h-4 text-red-500" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}