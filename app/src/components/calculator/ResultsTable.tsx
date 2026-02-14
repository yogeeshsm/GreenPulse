import { Trash2 } from 'lucide-react';

export interface FootprintEntry {
  id: string;
  dateAdded: string;
  emissionsTco2e: number;
  details: string;
  comment: string;
  category: string;
}

interface ResultsTableProps {
  entries: FootprintEntry[];
  categoryLabel: string;
  onDelete: (id: string) => void;
}

export function ResultsTable({ entries, categoryLabel, onDelete }: ResultsTableProps) {
  const categoryEntries = entries.filter(e => e.category === categoryLabel);

  return (
    <div className="mt-8">
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-lg font-bold text-gray-800">{categoryLabel} Results</h3>
        <button className="text-sm text-green-600 font-medium hover:underline">
          View All
        </button>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Date Added</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">
                Emissions (tCO₂e)
              </th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Details</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Comment</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categoryEntries.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400 italic">
                  No entries, please add some data above.
                </td>
              </tr>
            ) : (
              categoryEntries.map(entry => (
                <tr key={entry.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700">{entry.dateAdded}</td>
                  <td className="px-4 py-3 font-semibold text-gray-800">
                    {entry.emissionsTco2e.toFixed(4)}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{entry.details}</td>
                  <td className="px-4 py-3 text-gray-500">{entry.comment || '—'}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onDelete(entry.id)}
                      className="text-red-400 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-50"
                      title="Delete entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
