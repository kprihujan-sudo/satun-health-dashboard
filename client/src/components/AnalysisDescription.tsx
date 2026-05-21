import { Card } from '@/components/ui/card';
import { Info } from 'lucide-react';

interface AnalysisDescriptionProps {
  title: string;
  description: string;
  keyPoints?: string[];
  interpretation?: string;
}

export function AnalysisDescription({
  title,
  description,
  keyPoints,
  interpretation,
}: AnalysisDescriptionProps) {
  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 mb-6">
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800 font-poppins mb-2">{title}</h3>
          <p className="text-gray-700 text-sm leading-relaxed mb-3">{description}</p>

          {keyPoints && keyPoints.length > 0 && (
            <div className="mb-3">
              <h4 className="font-semibold text-gray-800 text-sm mb-2">ประเด็นสำคัญ:</h4>
              <ul className="space-y-1">
                {keyPoints.map((point, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {interpretation && (
            <div className="bg-white p-3 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-gray-800 text-sm mb-1">การวิเคราะห์:</h4>
              <p className="text-sm text-gray-700">{interpretation}</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
