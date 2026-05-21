import { Card } from '@/components/ui/card';
import { formatNumber, formatDecimal } from '@/hooks/useHealthData';

interface DiseaseData {
  Disease_group: string;
  Deaths: number;
  YLL: number;
  YLD_incidence: number;
  DALY_incidence: number;
  'Share_deaths_%'?: number;
  'Share_DALY_%'?: number;
}

interface DiseaseTableProps {
  data: DiseaseData[];
  title?: string;
}

export function DiseaseTable({ data, title = 'Disease Summary' }: DiseaseTableProps) {
  // Sort by DALY
  const sortedData = [...data].sort(
    (a, b) => (b.DALY_incidence || 0) - (a.DALY_incidence || 0)
  );

  return (
    <Card className="p-6 border-2 border-blue-200">
      <h2 className="text-xl font-bold text-gray-800 font-poppins mb-4">{title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-blue-200 bg-blue-50">
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Disease Group</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">Deaths</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">YLL</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">YLD</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">DALY</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">% of DALY</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((disease, idx) => (
              <tr
                key={idx}
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 font-medium text-gray-800">{disease.Disease_group}</td>
                <td className="px-4 py-3 text-right text-gray-700">
                  {formatNumber(disease.Deaths)}
                </td>
                <td className="px-4 py-3 text-right text-gray-700">
                  {formatDecimal(disease.YLL, 1)}
                </td>
                <td className="px-4 py-3 text-right text-gray-700">
                  {formatDecimal(disease.YLD_incidence, 1)}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-teal-700">
                  {formatDecimal(disease.DALY_incidence, 1)}
                </td>
                <td className="px-4 py-3 text-right text-gray-700">
                  {disease['Share_DALY_%'] ? (disease['Share_DALY_%'] * 100).toFixed(1) : '0'}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
