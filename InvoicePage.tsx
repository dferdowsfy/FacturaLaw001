import React from 'react';
import { Search, FileDown, Printer } from 'lucide-react';
import { TimeEntry } from '../../types/time';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface InvoicePageProps {
  entries: TimeEntry[];
}

export function InvoicePage({ entries }: InvoicePageProps) {
  const [selectedClient, setSelectedClient] = React.useState('');
  const [selectedDate, setSelectedDate] = React.useState('');
  const [selectedEntries, setSelectedEntries] = React.useState<string[]>([]);

  const filteredEntries = entries.filter(entry => {
    const matchesClient = !selectedClient || entry.clientId === selectedClient;
    const matchesDate = !selectedDate || entry.date === selectedDate;
    return matchesClient && matchesDate;
  });

  const uniqueClients = Array.from(new Set(entries.map(entry => entry.clientId)));

  const handleExportAndPrint = () => {
    const entriesToExport = filteredEntries.filter(entry =>
      selectedEntries.includes(entry.id)
    );

    if (entriesToExport.length === 0) {
      alert('Please select at least one entry to export.');
      return;
    }

    // Create an invoice structure
    const invoiceWindow = window.open('', '_blank');
    if (!invoiceWindow) {
      alert('Unable to open a new window for the invoice.');
      return;
    }

    invoiceWindow.document.write(`
      <html>
        <head>
          <title>FacturaLaw Invoice</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #3B82F6; color: white; }
            tr:nth-child(even) { background-color: #f2f2f2; }
            .totals { margin-top: 20px; font-size: 1.1em; }
          </style>
        </head>
        <body>
          <h1>FacturaLaw Invoice</h1>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Client</th>
                <th>Matter</th>
                <th>Narrative</th>
                <th>Hours / Rate</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${entriesToExport.map(entry => `
                <tr>
                  <td>${new Date(entry.date).toLocaleDateString()}</td>
                  <td>${entry.clientId}</td>
                  <td>${entry.matterName}</td>
                  <td>${entry.narrative || '-'}</td>
                  <td>${entry.hours.toFixed(2)}h / $${entry.hourlyRate.toFixed(2)}</td>
                  <td>$${entry.total.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="totals">
            <p><strong>Total Hours:</strong> ${entriesToExport.reduce((sum, entry) => sum + entry.hours, 0).toFixed(1)}h</p>
            <p><strong>Total Amount:</strong> $${entriesToExport.reduce((sum, entry) => sum + entry.total, 0).toFixed(2)}</p>
          </div>
        </body>
      </html>
    `);

    invoiceWindow.document.close();
    invoiceWindow.focus();
    invoiceWindow.print();
    invoiceWindow.close();
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-5xl font-bold text-white mb-8 pl-4">Invoices</h1>
        <div className="space-x-2">
          <button
            onClick={handleExportAndPrint}
            className="inline-flex items-center px-4 py-2 border border-blue-500 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 bg-opacity-80"
          >
            <FileDown className="h-5 w-5 mr-2" />
            Export and Print
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Client</label>
          <div className="relative">
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="block w-full rounded-md border border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 appearance-none"
            >
              <option value="">All Clients</option>
              {uniqueClients.map(client => (
                <option key={client} value={client}>{client}</option>
              ))}
            </select>
            <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="block w-full rounded-md border border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
          />
        </div>
      </div>

      <div className="bg-[#1F2937] rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="w-8 px-6 py-3 bg-gray-800">
                <input
                  type="checkbox"
                  checked={selectedEntries.length === filteredEntries.length}
                  onChange={(e) => {
                    setSelectedEntries(
                      e.target.checked ? filteredEntries.map(entry => entry.id) : []
                    );
                  }}
                  className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider bg-gray-800">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider bg-gray-800">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider bg-gray-800">
                Matter
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider bg-gray-800">
                Narrative
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider bg-gray-800">
                Hours
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider bg-gray-800">
                Rate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider bg-gray-800">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredEntries.map((entry) => (
              <tr key={entry.id} className="hover:bg-gray-700">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedEntries.includes(entry.id)}
                    onChange={(e) => {
                      setSelectedEntries(prev =>
                        e.target.checked
                          ? [...prev, entry.id]
                          : prev.filter(id => id !== entry.id)
                      );
                    }}
                    className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {new Date(entry.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {entry.clientId}
                </td>
                <td className="px-6 py-4 text-sm text-white">
                  {entry.matterName}
                </td>
                <td className="px-6 py-4 text-sm text-white">
                  {entry.narrative || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {entry.hours}h
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  ${entry.hourlyRate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  ${entry.total.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}