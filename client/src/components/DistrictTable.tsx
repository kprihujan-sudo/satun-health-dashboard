import { Card } from '@/components/ui/card';
import { RiskBadge } from './RiskBadge';
import { formatNumber, formatDecimal } from '@/hooks/useHealthData';

interface DistrictData {
  District: string;
  Deaths: number;
  YLL: number;
  YLD_incidence: number;
  DALY_incidence: number;
  Population_ref: number;
  Death_rate_per100k: number;
  DALY_rate_per100k: number;
  Risk_level: string;
}

interface DistrictTableProps {
  data: DistrictData[];
  title?: string;
}

export function DistrictTable({ data, title = 'District Health Summary' }: DistrictTableProps) {
  // Sort by DALY rate
  const sortedData = [...data].sort(
    (a, b) => (b.DALY_rate_per100k || 0) - (a.DALY_rate_per100k || 0)
  );

  return (
    <Card className="p-6 border-2 border-blue-200">
      <h2 className="text-xl font-bold text-gray-800 font-poppins mb-4">{title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-blue-200 bg-blue-50">
              <th className="px-4 py-3 text-left font-semibold text-gray-700">District</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">Deaths</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">Population</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">Death Rate/100k</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">DALY Rate/100k</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">Risk Level</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((district, idx) => (
              <tr
                key={idx}
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 font-medium text-gray-800">{district.District}</td>
                <td className="px-4 py-3 text-right text-gray-700">
                  {formatNumber(district.Deaths)}
                </td>
                <td className="px-4 py-3 text-right text-gray-700">
                  {formatNumber(district.Population_ref)}
                </td>
                <td className="px-4 py-3 text-right text-gray-700">
                  {formatDecimal(district.Death_rate_per100k, 1)}
                </td>
                <td className="px-4 py-3 text-right text-gray-700">
                  {formatDecimal(district.DALY_rate_per100k, 1)}
                </td>
                <td className="px-4 py-3 text-center">
                  <RiskBadge level={district.Risk_level} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
