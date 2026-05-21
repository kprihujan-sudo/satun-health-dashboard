import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDecimal } from '@/hooks/useHealthData';

interface SpecificDisease {
  ICD10: string;
  Disease: string;
  Deaths: number;
  Avg_age: number;
  YLL: number;
  DALY_incidence: number;
}

interface AverageAgeChartProps {
  diseases: SpecificDisease[];
}

export function AverageAgeChart({ diseases }: AverageAgeChartProps) {
  if (!diseases || diseases.length === 0) {
    return (
      <Card className="border-0 shadow-md">
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">No data available</p>
        </CardContent>
      </Card>
    );
  }

  // Top 20 diseases by deaths for better visualization
  const topDiseases = diseases
    .sort((a, b) => (b.Deaths || 0) - (a.Deaths || 0))
    .slice(0, 20);

  const chartData = topDiseases.map(d => ({
    name: d.Disease.substring(0, 30),
    age: d.Avg_age,
    deaths: d.Deaths,
    icd10: d.ICD10,
  }));

  const getColor = (age: number) => {
    if (age < 40) return '#ef4444'; // Red - young
    if (age < 60) return '#f59e0b'; // Amber - middle
    if (age < 75) return '#3b82f6'; // Blue - older
    return '#6366f1'; // Indigo - very old
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Average Age at Death by Disease</CardTitle>
          <CardDescription>Top 20 diseases with highest mortality - showing average age of death</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={450}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 80 }} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" />
              <YAxis 
                dataKey="name" 
                type="category"
                width={250}
                tick={{ fontSize: 11 }}
              />
              <Tooltip 
                formatter={(value) => formatDecimal(value as number, 1)}
                labelFormatter={(label) => `Age: ${label}`}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
              />
              <Bar dataKey="age" fill="#3b82f6" radius={[0, 8, 8, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(entry.age)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Age Statistics by Disease</CardTitle>
          <CardDescription>Average age at death for all specific diseases (sorted by mortality)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-blue-50 border-b-2 border-blue-200">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-blue-900">ICD-10</th>
                  <th className="px-4 py-2 text-left font-semibold text-blue-900">Disease</th>
                  <th className="px-4 py-2 text-right font-semibold text-blue-900">Deaths</th>
                  <th className="px-4 py-2 text-right font-semibold text-blue-900">Avg Age</th>
                  <th className="px-4 py-2 text-center font-semibold text-blue-900">Age Group</th>
                </tr>
              </thead>
              <tbody>
                {topDiseases.map((disease, idx) => {
                  let ageGroup = 'Middle Age';
                  if (disease.Avg_age < 40) ageGroup = 'Young';
                  else if (disease.Avg_age < 60) ageGroup = 'Middle Age';
                  else if (disease.Avg_age < 75) ageGroup = 'Elderly';
                  else ageGroup = 'Very Elderly';

                  return (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-2 font-mono text-blue-600">{disease.ICD10}</td>
                      <td className="px-4 py-2 text-gray-900">{disease.Disease}</td>
                      <td className="px-4 py-2 text-right font-semibold text-red-600">{disease.Deaths}</td>
                      <td className="px-4 py-2 text-right font-semibold text-gray-900">{formatDecimal(disease.Avg_age, 1)}</td>
                      <td className="px-4 py-2 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          disease.Avg_age < 40 ? 'bg-red-100 text-red-700' :
                          disease.Avg_age < 60 ? 'bg-amber-100 text-amber-700' :
                          disease.Avg_age < 75 ? 'bg-blue-100 text-blue-700' :
                          'bg-indigo-100 text-indigo-700'
                        }`}>
                          {ageGroup}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
