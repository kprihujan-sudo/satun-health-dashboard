import { Card } from '@/components/ui/card';

interface CorrelationData {
  disease1: string;
  disease2: string;
  correlation: number; // -1 to 1
}

interface CorrelationMatrixProps {
  data: CorrelationData[];
  title?: string;
}

export function CorrelationMatrix({ data, title = 'Disease Correlation Matrix' }: CorrelationMatrixProps) {
  // Get unique diseases
  const diseases = Array.from(
    new Set([...data.map(d => d.disease1), ...data.map(d => d.disease2)])
  ).sort();

  // Create matrix
  const matrix: Record<string, Record<string, number>> = {};
  diseases.forEach(d => {
    matrix[d] = {};
    diseases.forEach(d2 => {
      if (d === d2) {
        matrix[d][d2] = 1;
      } else {
        const found = data.find(
          (item) =>
            (item.disease1 === d && item.disease2 === d2) ||
            (item.disease1 === d2 && item.disease2 === d)
        );
        matrix[d][d2] = found ? found.correlation : 0;
      }
    });
  });

  const getColor = (value: number) => {
    if (value > 0.7) return 'bg-green-600 text-white';
    if (value > 0.4) return 'bg-green-300 text-gray-800';
    if (value > 0) return 'bg-yellow-200 text-gray-800';
    if (value > -0.4) return 'bg-orange-200 text-gray-800';
    if (value > -0.7) return 'bg-red-300 text-white';
    return 'bg-red-600 text-white';
  };

  return (
    <Card className="p-6 overflow-x-auto">
      <h3 className="text-lg font-bold text-gray-800 font-poppins mb-4">{title}</h3>
      <div className="inline-block min-w-full">
        <table className="text-xs">
          <thead>
            <tr>
              <th className="px-2 py-2 text-left font-semibold text-gray-700 bg-gray-100">Disease</th>
              {diseases.map((d) => (
                <th
                  key={d}
                  className="px-2 py-2 text-center font-semibold text-gray-700 bg-gray-100 min-w-12"
                  title={d}
                >
                  <div className="truncate text-xs">{d.substring(0, 3)}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {diseases.map((d1) => (
              <tr key={d1}>
                <td className="px-2 py-2 font-semibold text-gray-700 bg-gray-50 text-xs truncate max-w-32">
                  {d1}
                </td>
                {diseases.map((d2) => (
                  <td
                    key={`${d1}-${d2}`}
                    className={`px-2 py-2 text-center font-semibold min-w-12 ${getColor(matrix[d1][d2])}`}
                    title={`${d1} vs ${d2}: ${matrix[d1][d2].toFixed(2)}`}
                  >
                    {matrix[d1][d2].toFixed(2)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-xs text-gray-600">
        <p className="font-semibold mb-2">Color Scale:</p>
        <div className="flex gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-600"></div>
            <span>Strong Positive (0.7-1.0)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-yellow-200"></div>
            <span>Neutral (0)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-600"></div>
            <span>Strong Negative (-0.7 to -1.0)</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
