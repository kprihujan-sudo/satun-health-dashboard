import { Card } from '@/components/ui/card';
import { formatNumber, formatDecimal } from '@/hooks/useHealthData';

interface MOPHGroupData {
  [key: string]: string | number;
}

interface MOPHGroupsTableProps {
  data: MOPHGroupData[];
  title?: string;
}

export function MOPHGroupsTable({ data, title = 'MOPH Disease Groups (ICD-10 Chapter Classification)' }: MOPHGroupsTableProps) {
  if (!data || data.length === 0) {
    return <div className="text-center text-gray-500">No data available</div>;
  }

  // Filter out header rows and empty rows - keep only actual disease group data
  const cleanData = data.filter((row, idx) => {
    if (idx <= 1) return false; // Skip first two rows (headers/metadata)
    const firstKey = Object.keys(row)[0];
    const firstValue = row[firstKey];
    // Keep rows that have meaningful disease group names
    return firstValue && typeof firstValue === 'string' && firstValue.trim().length > 0 && !firstValue.includes('MOPH_Disease_Group');
  });

  if (cleanData.length === 0) {
    return <div className="text-center text-gray-500">No disease group data available</div>;
  }

  // Map column names to readable labels
  const columnMap: Record<string, string> = {
    'สรุปกลุ่มโรคตามมาตรฐานกระทรวงสาธารณสุข / ICD-10 Chapter': 'Disease Group',
    'Unnamed: 1': 'ICD-10 Chapter',
    'Unnamed: 2': 'Deaths',
    'Unnamed: 3': 'Male',
    'Unnamed: 4': 'Female',
    'Unnamed: 5': 'Proportion',
    'Unnamed: 6': 'Avg Age',
    'Unnamed: 7': 'Top Disease',
    'Unnamed: 8': 'Top District',
    'Unnamed: 9': 'Policy Recommendation',
  };

  const rawColumns = Object.keys(cleanData[0]).filter(key => key && !key.includes('Unnamed'));
  const columns = rawColumns.map(col => columnMap[col] || col);

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white border-2 border-purple-200">
        <h3 className="text-lg font-bold text-gray-800 font-poppins mb-4">{title}</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-purple-100 to-purple-50 border-b-2 border-purple-300">
              <tr>
                {columns.map((col) => (
                  <th 
                    key={col}
                    className="px-4 py-3 text-left font-bold text-gray-800 whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cleanData.map((row, index) => (
                <tr 
                  key={index}
                  className={`border-b border-gray-200 hover:bg-purple-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  {rawColumns.map((rawCol, colIdx) => {
                    const value = row[rawCol];
                    const displayCol = columns[colIdx];
                    let displayValue = value || '-';
                    
                    // Format numbers appropriately
                    if (displayCol === 'Deaths' && typeof value === 'number' && value > 0) {
                      displayValue = formatNumber(value);
                    } else if (displayCol === 'Proportion' && typeof value === 'number' && value > 0) {
                      displayValue = `${(value * 100).toFixed(2)}%`;
                    } else if (displayCol === 'Avg Age' && typeof value === 'number' && value > 0) {
                      displayValue = formatDecimal(value, 1);
                    } else if ((displayCol === 'Male' || displayCol === 'Female') && typeof value === 'number' && value > 0) {
                      displayValue = formatNumber(value);
                    }
                    
                    return (
                      <td 
                        key={`${index}-${rawCol}`}
                        className={`px-4 py-3 text-gray-700 ${
                          displayCol === 'Deaths' ? 'font-semibold text-red-600' :
                          displayCol === 'Avg Age' ? 'font-semibold text-blue-600' :
                          displayCol === 'Proportion' ? 'font-semibold text-teal-600' :
                          displayCol === 'Disease Group' ? 'font-semibold text-gray-900' :
                          ''
                        }`}
                      >
                        {displayValue}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-gray-500">
          This table shows {cleanData.length} disease groups classified according to Ministry of Public Health (MOPH) standards and ICD-10 chapters.
        </p>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200">
        <h4 className="text-md font-bold text-gray-800 font-poppins mb-3">Disease Group Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded-lg border border-purple-200">
            <div className="text-sm font-semibold text-purple-600 mb-2">Total Disease Groups</div>
            <div className="text-3xl font-bold text-purple-900">{cleanData.length}</div>
          </div>
          <div className="p-4 bg-white rounded-lg border border-red-200">
            <div className="text-sm font-semibold text-red-600 mb-2">Total Deaths (All Groups)</div>
            <div className="text-3xl font-bold text-red-900">
              {formatNumber(cleanData.reduce((sum, row) => {
                const deathsKey = rawColumns.find(k => columnMap[k] === 'Deaths');
                return sum + (typeof row[deathsKey!] === 'number' ? (row[deathsKey!] as number) : 0);
              }, 0))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
