// Daily Close Ritual - Missing Items Check
// Ensures users have logged major daily activities before closing the day

import { AlertCircle, Train, Utensils, Zap, X } from 'lucide-react';
import type { ActivityLog, ActivityType } from '@/types';
import { detectMissingActivities } from '@/lib/suggestionsEngine';

interface MissingItemsModalProps {
  isOpen: boolean;
  activities: ActivityLog[];
  onContinue: () => void;
  onFillMissing: (category: ActivityType) => void;
  onClose: () => void;
}

export function MissingItemsModal({
  isOpen,
  activities,
  onContinue,
  onFillMissing,
  onClose
}: MissingItemsModalProps) {
  if (!isOpen) return null;

  const { missing, hasCommute, hasMeals, hasEnergy } = detectMissingActivities(activities);

  const missingItems = [
    {
      category: 'transport' as ActivityType,
      missing: !hasCommute,
      icon: Train,
      label: 'Commute / Transport',
      description: 'Did you travel anywhere today?',
      color: 'blue'
    },
    {
      category: 'food' as ActivityType,
      missing: !hasMeals,
      icon: Utensils,
      label: 'Meals',
      description: 'Have you logged your meals?',
      color: 'green'
    },
    {
      category: 'energy' as ActivityType,
      missing: !hasEnergy,
      icon: Zap,
      label: 'Energy Usage',
      description: 'Did you use AC, laptop, or other devices?',
      color: 'amber'
    }
  ];

  const hasMissing = missing.length > 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${ 
              hasMissing ? 'bg-amber-100' : 'bg-green-100'
            }`}>
              <AlertCircle className={`w-6 h-6 ${
                hasMissing ? 'text-amber-600' : 'text-green-600'
              }`} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {hasMissing ? 'Missing Activities?' : 'Ready to Close?'}
              </h2>
              <p className="text-sm text-gray-600">
                {hasMissing 
                  ? 'A few items are missing from today'
                  : 'All major activities logged'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Missing Items List */}
        <div className="space-y-3 mb-6">
          {missingItems.map((item) => (
            <div
              key={item.category}
              className={`p-4 rounded-xl border-2 transition-all ${
                item.missing
                  ? 'border-amber-200 bg-amber-50'
                  : 'border-green-200 bg-green-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  item.missing 
                    ? `bg-${item.color}-100` 
                    : 'bg-green-100'
                }`}>
                  <item.icon className={`w-5 h-5 ${
                    item.missing 
                      ? `text-${item.color}-600` 
                      : 'text-green-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900">{item.label}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      item.missing
                        ? 'bg-amber-200 text-amber-800'
                        : 'bg-green-200 text-green-800'
                    }`}>
                      {item.missing ? 'Missing' : 'Logged'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">{item.description}</p>
                </div>
                {item.missing && (
                  <button
                    onClick={() => onFillMissing(item.category)}
                    className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    Add Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="p-3 bg-blue-50 rounded-xl mb-6">
          <p className="text-xs text-blue-900">
            💡 <strong>Want complete insights?</strong> Log all major activities for accurate tracking and better suggestions.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onContinue}
            className="flex-1 py-3 px-4 rounded-xl bg-[#22C55E] text-white font-medium hover:bg-[#16A34A] transition-all"
          >
            {hasMissing ? 'Continue Anyway' : 'Close Day ✨'}
          </button>
        </div>
      </div>
    </div>
  );
}
