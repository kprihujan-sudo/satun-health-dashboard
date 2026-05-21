import { Card } from '@/components/ui/card';

interface MatrixData {
  District: string;
  [key: string]: string | number;
}

interface DiseaseDistrictMatrixProps {
  data: MatrixData[];
  title?: string;
}

export function DiseaseDistrictMatrix({ data, title = 'Disease × District Matrix (DALY Impact)' }: DiseaseDistrictMatrixProps) {
  if (!data || data.length === 0) {
    return <div className="text-center text-gray-500">No data available</div>;
  }

  // Get disease columns (exclude District)
  const diseases = Object.keys(data[0]).filter(key => key !== 'District');

  // Find min and max for color scaling
  let minVal = Infinity;
  let maxVal = -Infinity;

  data.forEach(row => {
    diseases.forEach(disease => {
      const val = typeof row[disease] === 'number' ? row[disease] : 0;
      minVal = Math.min(minVal, val);
      maxVal = Math.max(maxVal, val);
    });
  });

  // Color function - from light to dark based on value
  const getColor = (value: number) => {
    if (value === 0) return 'bg-gray-50';
    const ratio = (value - minVal) / (maxVal - minVal || 1);
    
    if (ratio < 0.25) return 'bg-blue-100';
    if (ratio < 0.5) return 'bg-blue-300';
    if (ratio < 0.75) return 'bg-blue-500 text-white';
    return 'bg-blue-700 text-white';
  };

  return (
    <Card className="p-6 bg-white border-2 border-blue-200">
      <h3 className="text-lg font-bold text-gray-800 font-poppins mb-4">{title}</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-xs md:text-sm border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-blue-900 to-blue-800 text-white">
              <th className="px-3 py-3 text-left font-bold sticky left-0 bg-blue-900 z-10">District</th>
              {diseases.map((disease) => (
                <th 
                  key={disease}
                  className="px-2 py-3 text-center font-bold whitespace-nowrap"
                  title={disease}
                >
                  {disease.length > 15 ? disease.substring(0, 12) + '...' : disease}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr 
                key={idx}
                className={`border-b border-gray-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                <td className="px-3 py-3 font-bold text-gray-800 sticky left-0 z-10 bg-inherit border-r border-gray-200">
                  {row.District}
                </td>
                {diseases.map((disease) => {
                  const value = typeof row[disease] === 'number' ? row[disease] : 0;
                  return (
                    <td
                      key={`${row.District}-${disease}`}
                      className={`px-2 py-3 text-center font-semibold ${getColor(value)} transition-colors hover:opacity-80`}
                      title={`${row.District} - ${disease}: ${value.toFixed(1)}`}
                    >
                      {value > 0 ? value.toFixed(1) : '-'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-50 border border-gray-300"></div>
          <span className="text-xs text-gray-600">No Data</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-100"></div>
          <span className="text-xs text-gray-600">Low</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-300"></div>
          <span className="text-xs text-gray-600">Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-500"></div>
          <span className="text-xs text-gray-600">High</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-700"></div>
          <span className="text-xs text-gray-600">Very High</span>
        </div>
      </div>

      <p className="mt-4 text-xs text-gray-500 text-center">
        Values represent DALY (Disability-Adjusted Life Years) impact for each disease-district combination
      </p>
    </Card>
  );
}
