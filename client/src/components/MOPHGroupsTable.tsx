import { Card } from '@/components/ui/card';

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

  // Get first row to extract column names
  const columns = Object.keys(data[0]).filter(key => key && !key.includes('Unnamed'));

  return (
    <Card className="p-6 bg-white border-2 border-blue-200">
      <h3 className="text-lg font-bold text-gray-800 font-poppins mb-4">{title}</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gradient-to-r from-purple-100 to-purple-50 border-b-2 border-purple-300">
            <tr>
              {columns.map((col) => (
                <th 
                  key={col}
                  className="px-4 py-3 text-left font-bold text-gray-800"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr 
                key={index}
                className={`border-b border-gray-200 hover:bg-purple-50 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                {columns.map((col) => (
                  <td 
                    key={`${index}-${col}`}
                    className="px-4 py-3 text-gray-700"
                  >
                    {row[col] || '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-gray-500">
        This table shows disease groups classified according to Ministry of Public Health (MOPH) standards and ICD-10 chapters.
      </p>
    </Card>
  );
}
