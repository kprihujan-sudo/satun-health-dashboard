import { Card } from '@/components/ui/card';
import { useState } from 'react';

interface SpecificDiseaseData {
  ICD10: string;
  Disease: string;
  Deaths: number;
  Avg_age: number;
  YLL: number;
  DALY_incidence: number;
}

interface SpecificDiseasesTableProps {
  data: SpecificDiseaseData[];
  title?: string;
}

export function SpecificDiseasesTable({ data, title = 'Specific Diseases (100 ICD-10 Codes)' }: SpecificDiseasesTableProps) {
  const [sortBy, setSortBy] = useState<keyof SpecificDiseaseData>('DALY_incidence');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');

  if (!data || data.length === 0) {
    return <div className="text-center text-gray-500">No data available</div>;
  }

  // Filter and sort data
  let filteredData = data.filter(item => 
    item.Disease.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.ICD10.toLowerCase().includes(searchTerm.toLowerCase())
  );

  filteredData = [...filteredData].sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
    }
    return 0;
  });

  const handleSort = (key: keyof SpecificDiseaseData) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('desc');
    }
  };

  return (
    <Card className="p-6 bg-white border-2 border-blue-200">
      <h3 className="text-lg font-bold text-gray-800 font-poppins mb-4">{title}</h3>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by disease name or ICD-10 code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gradient-to-r from-blue-100 to-blue-50 border-b-2 border-blue-300">
            <tr>
              <th 
                className="px-4 py-3 text-left font-bold text-gray-800 cursor-pointer hover:bg-blue-200"
                onClick={() => handleSort('ICD10')}
              >
                ICD-10 {sortBy === 'ICD10' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-4 py-3 text-left font-bold text-gray-800 cursor-pointer hover:bg-blue-200"
                onClick={() => handleSort('Disease')}
              >
                Disease {sortBy === 'Disease' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-4 py-3 text-right font-bold text-gray-800 cursor-pointer hover:bg-blue-200"
                onClick={() => handleSort('Deaths')}
              >
                Deaths {sortBy === 'Deaths' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-4 py-3 text-right font-bold text-gray-800 cursor-pointer hover:bg-blue-200"
                onClick={() => handleSort('Avg_age')}
              >
                Avg Age {sortBy === 'Avg_age' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-4 py-3 text-right font-bold text-gray-800 cursor-pointer hover:bg-blue-200"
                onClick={() => handleSort('YLL')}
              >
                YLL {sortBy === 'YLL' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-4 py-3 text-right font-bold text-gray-800 cursor-pointer hover:bg-blue-200"
                onClick={() => handleSort('DALY_incidence')}
              >
                DALY {sortBy === 'DALY_incidence' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((disease, index) => (
              <tr 
                key={`${disease.ICD10}-${index}`}
                className={`border-b border-gray-200 hover:bg-blue-50 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <td className="px-4 py-3 font-mono text-blue-700 font-semibold">{disease.ICD10}</td>
                <td className="px-4 py-3 text-gray-700">{disease.Disease}</td>
                <td className="px-4 py-3 text-right font-semibold text-red-700">
                  {typeof disease.Deaths === 'number' ? disease.Deaths.toFixed(0) : disease.Deaths}
                </td>
                <td className="px-4 py-3 text-right text-gray-700">
                  {typeof disease.Avg_age === 'number' ? disease.Avg_age.toFixed(1) : disease.Avg_age}
                </td>
                <td className="px-4 py-3 text-right text-gray-700">
                  {typeof disease.YLL === 'number' ? disease.YLL.toFixed(1) : disease.YLL}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-teal-700">
                  {typeof disease.DALY_incidence === 'number' ? disease.DALY_incidence.toFixed(1) : disease.DALY_incidence}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        Showing {filteredData.length} of {data.length} diseases
      </div>
    </Card>
  );
}
