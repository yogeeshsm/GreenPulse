import { Check } from 'lucide-react';

interface StepWizardProps {
  currentStep: number;
  steps: string[];
}

export function StepWizard({ currentStep, steps }: StepWizardProps) {
  return (
    <div className="flex items-center justify-between w-full max-w-2xl mx-auto mb-8">
      {steps.map((label, idx) => {
        const stepNum = idx + 1;
        const isCompleted = stepNum < currentStep;
        const isCurrent = stepNum === currentStep;

        return (
          <div key={label} className="flex items-center flex-1">
            {/* Step circle */}
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all ${
                  isCompleted
                    ? 'bg-green-600 border-green-600 text-white'
                    : isCurrent
                    ? 'bg-green-600 border-green-600 text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : stepNum}
              </div>
              <span
                className={`text-xs mt-1.5 font-medium ${
                  isCompleted || isCurrent ? 'text-green-700' : 'text-gray-400'
                }`}
              >
                {label}
              </span>
            </div>

            {/* Connector line */}
            {idx < steps.length - 1 && (
              <div className="flex-1 mx-2">
                <div
                  className={`h-0.5 w-full rounded ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
