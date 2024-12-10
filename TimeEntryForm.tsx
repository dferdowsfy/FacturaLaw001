import React from 'react';
import { Plus, X } from 'lucide-react';
import { TimeFormData } from '../../types/time';
import { clients, cases, hourOptions, attorneys } from '../../data/sampleData';

interface Attorney {
  id: string;
  name: string;
  rate: number;
}

interface TimeEntryFormProps {
  initialData?: TimeFormData;
  onSubmit: (data: TimeFormData) => void;
  onClose: () => void;
}

const findAttorneyRate = (attorneyIds: string[]): number => {
  const selectedAttorneys = attorneys.filter(a => attorneyIds.includes(a.id));
  return selectedAttorneys.length > 0
    ? selectedAttorneys.reduce((sum, a) => sum + a.rate, 0) / selectedAttorneys.length
    : 0;
};

export function TimeEntryForm({ initialData, onSubmit, onClose }: TimeEntryFormProps) {
  const [isAttorneyDropdownOpen, setIsAttorneyDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsAttorneyDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [formData, setFormData] = React.useState<TimeFormData>(
    initialData || {
      attorneyIds: [],
      attorneyRates: {},
      date: new Date().toISOString().split('T')[0],
      clientId: '',
      caseId: '',
      actionCode: '',
      matterId: '',
      matterName: '',
      narrative: '',
    }
  );

  const [selectedHours, setSelectedHours] = React.useState<{ [key: string]: number }>({});

  const handleAttorneyChange = (attorneyId: string) => {
    const attorney = attorneys.find(a => a.id === attorneyId);
    if (!attorney) return;

    setFormData(prev => {
      const newAttorneyIds = prev.attorneyIds.includes(attorneyId)
        ? prev.attorneyIds.filter(id => id !== attorneyId)
        : [...prev.attorneyIds, attorneyId];

      const newAttorneyRates = { ...prev.attorneyRates };
      if (newAttorneyIds.includes(attorneyId)) {
        newAttorneyRates[attorneyId] = { rate: attorney.rate, hours: 0 };
      } else {
        delete newAttorneyRates[attorneyId];
      }

      return {
        ...prev,
        attorneyIds: newAttorneyIds,
        attorneyRates: newAttorneyRates
      };
    });
  };

  const handleHoursChange = (attorneyId: string, hours: number) => {
    setFormData(prev => ({
      ...prev,
      attorneyRates: {
        ...prev.attorneyRates,
        [attorneyId]: {
          ...prev.attorneyRates[attorneyId],
          hours
        }
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const total = Object.values(formData.attorneyRates).reduce(
      (sum, { rate, hours }) => {
        const parsedHours = parseFloat(hours.toString().replace(/m/g, ''));
        return sum + (rate * (isNaN(parsedHours) ? 0 : parsedHours));
      },
      0
    );
    onSubmit({ ...formData, total });
    onClose(); // Close the form after submission
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'hourlyRate' || name === 'hours' ? parseFloat(value.replace(/m/g, '')) : value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#1F2937] rounded-lg shadow-xl w-full max-w-2xl my-8">
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-2xl font-semibold text-white">
            {initialData ? 'Edit Time Entry' : 'New Time Entry'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Attorneys</label>
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsAttorneyDropdownOpen(!isAttorneyDropdownOpen)}
                className="mt-1 block w-full rounded-md border border-gray-600 bg-[#1F2937] text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 text-left"
              >
                {formData.attorneyIds.length > 0
                  ? attorneys
                      .filter(a => formData.attorneyIds.includes(a.id))
                      .map(a => a.name)
                      .join(', ')
                  : 'Select Attorneys'}
              </button>
              {isAttorneyDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-600 bg-gray-700 shadow-lg">
                  <div className="max-h-60 overflow-y-auto">
                    <div className="flex flex-wrap gap-4">
                      {attorneys.map(attorney => (
                        <label key={attorney.id} className="flex items-center hover:bg-[#2D3748] cursor-pointer">
                          <input
                            type="checkbox"
                            value={attorney.id}
                            checked={formData.attorneyIds.includes(attorney.id)}
                            onChange={() => handleAttorneyChange(attorney.id)}
                            className="mr-2 text-blue-500 focus:ring-blue-500"
                          />
                          {attorney.name}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Client</label>
              <select
                name="clientId"
                value={formData.clientId}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
              >
                <option value="">Select Client</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Case</label>
              <select
                name="caseId"
                value={formData.caseId}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
              >
                <option value="">Select Case</option>
                {cases.map(caseItem => (
                  <option key={caseItem.id} value={caseItem.id}>{caseItem.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Matter ID</label>
              <input
                type="text"
                name="matterId"
                value={formData.matterId}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Matter Name</label>
              <input
                type="text"
                name="matterName"
                value={formData.matterName}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Narrative</label>
            <textarea
              name="narrative"
              value={formData.narrative}
              onChange={handleChange}
              required
              rows={4}
              className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {formData.attorneyIds.map(attorneyId => {
              const attorney = attorneys.find(a => a.id === attorneyId);
              if (!attorney) return null;
              
              return (
                <div key={attorneyId} className="col-span-2 grid grid-cols-2 gap-4 p-4 border border-gray-600 rounded-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-300">
                      {attorney.name} Rate
                    </label>
                    <input
                      type="number"
                      value={attorney.rate}
                      readOnly
                      className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 text-white shadow-sm px-3 py-2 opacity-75 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">
                      {attorney.name} Hours
                    </label>
                    <select
                      value={formData.attorneyRates[attorneyId]?.hours || 0}
                      onChange={(e) => handleHoursChange(attorneyId, Number(e.target.value))}
                      required
                      className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                    >
                      <option value="">Select Hours</option>
                      {hourOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-400 bg-gray-800 hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 border border-blue-500 bg-opacity-80"
            >
              {initialData ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}