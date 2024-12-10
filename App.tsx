import React from 'react';
import { Plus } from 'lucide-react';
import { TimeEntry, TimeFormData } from './types/time';
import { TimeEntryForm } from './components/TimeEntry/TimeEntryForm';
import { TimeEntryTable } from './components/TimeEntry/TimeEntryTable';
import { TimeCountdownBanner } from './components/TimeEntry/TimeCountdownBanner';
import { ReportsPage } from './components/Reports/ReportsPage';
import { InvoicePage } from './components/Invoice/InvoicePage';
import { BottomNav } from './components/Navigation/BottomNav';
import { useTimeEntries } from './hooks/useTimeEntries';
import LoginSignUp from './components/Auth/LoginSignUp';

function App() {
  const [showForm, setShowForm] = React.useState(false);
  const [editingEntry, setEditingEntry] = React.useState<TimeEntry | null>(null);
  const [activeTab, setActiveTab] = React.useState('time');
  const { entries, loading, error, addEntry, updateEntry, deleteEntry } = useTimeEntries();

  console.log('Entries:', entries);

  const handleSubmit = async (data: TimeFormData) => {
    try {
      if (editingEntry) {
        await updateEntry(editingEntry.id, data);
        setEditingEntry(null);
      } else {
        await addEntry(data);
      }
      setShowForm(false);
    } catch (err) {
      console.error('Error saving time entry:', err);
      alert('Error saving time entry. Please try again.');
    }
  };

  const handleEdit = (entry: TimeEntry) => {
    setEditingEntry(entry);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteEntry(id);
    } catch (err) {
      console.error('Error deleting time entry:', err);
      alert('Error deleting time entry. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#161D2B] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#161D2B] flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  console.log('Active Tab:', activeTab);

  return (
    <div>
      <LoginSignUp />
      <div className="min-h-screen bg-[#161D2B] pb-20 text-white">
        {activeTab === 'time' ? (
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-4xl font-bold text-white mb-8 pl-4">Time Entries</h1>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 border border-blue-500 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-5 w-5 mr-2" />
                New Entry
              </button>
            </div>
            {entries.length > 0 && (
              <TimeCountdownBanner
                daysRemaining={30 - Math.floor(
                  (Date.now() - new Date(entries[0].createdAt).getTime()) /
                    (1000 * 60 * 60 * 24)
                )}
              />
            )}

            {entries.length > 0 ? (
              <TimeEntryTable entries={entries} onEdit={handleEdit} onDelete={handleDelete} />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400">No time entries yet. Create your first one!</p>
              </div>
            )}
          </div>
        ) : activeTab === 'reports' ? (
          <ReportsPage entries={entries} />
        ) : activeTab === 'invoice' ? (
          <InvoicePage entries={entries} />
        ) : null}

        {showForm && (
          <TimeEntryForm
            initialData={editingEntry || undefined}
            onSubmit={handleSubmit}
            onClose={() => {
              setShowForm(false);
              setEditingEntry(null);
            }}
          />
        )}
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}

export default App;