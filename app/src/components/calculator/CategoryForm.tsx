import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';

export interface FieldConfig {
  name: string;
  label: string;
  type: 'number' | 'text' | 'select';
  options?: { value: string; label: string }[];
  placeholder?: string;
}

export interface CategoryConfig {
  id: string;
  label: string;
  icon: LucideIcon;
  fields: FieldConfig[];
  instructions: string;
  emissionFactor: number;
  unit: string;
  detailTemplate: (values: Record<string, string>) => string;
}

interface CategoryFormProps {
  category: CategoryConfig;
  onSubmit: (values: Record<string, string>, comment: string) => void;
}

export function CategoryForm({ category, onSubmit }: CategoryFormProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [comment, setComment] = useState('');

  const handleChange = (name: string, value: string) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Check at least one numeric field has a value
    const hasValue = category.fields.some(
      f => f.type === 'number' && values[f.name] && parseFloat(values[f.name]) > 0
    );
    if (!hasValue) return;

    onSubmit(values, comment);
    setValues({});
    setComment('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex gap-6 px-6 py-5">
        {/* Fields */}
        <div className="flex-1">
          <table className="w-full">
            <tbody>
              {category.fields.map(field => (
                <tr key={field.name} className="border-b border-gray-100 last:border-0">
                  <td className="py-3 pr-4 text-sm font-medium text-gray-700 w-2/3 align-middle">
                    {field.label}
                  </td>
                  <td className="py-3">
                    {field.type === 'select' ? (
                      <select
                        value={values[field.name] || ''}
                        onChange={e => handleChange(field.name, e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors appearance-none cursor-pointer"
                      >
                        <option value="">{field.placeholder || 'Select...'}</option>
                        {field.options?.map(opt => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        value={values[field.name] || ''}
                        onChange={e => handleChange(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        min={field.type === 'number' ? '0' : undefined}
                        step={field.type === 'number' ? 'any' : undefined}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Comments */}
        <div className="w-64 flex-shrink-0">
          <label className="block text-sm font-medium text-gray-500 mb-1.5">Comments</label>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            rows={category.fields.length + 2}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            placeholder="Optional notes..."
          />
        </div>
      </div>

      {/* Submit button */}
      <div className="px-6 pb-5 flex justify-center">
        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 active:scale-[0.98] transition-all shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Calculate & add to footprint
        </button>
      </div>
    </form>
  );
}
