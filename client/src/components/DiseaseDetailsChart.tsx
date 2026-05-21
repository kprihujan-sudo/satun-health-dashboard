import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatNumber, formatDecimal } from '@/hooks/useHealthData';

interface DiseaseData {
  Disease_group: string;
  Deaths: number;
  YLL: number;
  YLD_incidence: number;
  DALY_incidence: number;
  Share_deaths?: number;
  Share_DALY?: number;
}

interface DiseaseDetailsChartProps {
  diseases: DiseaseData[];
}

export function DiseaseDetailsChart({ diseases }: DiseaseDetailsChartProps) {
  const chartData = diseases.map(d => ({
    name: d.Disease_group,
    Deaths: d.Deaths,
    YLL: Math.round(d.YLL * 10) / 10,
    YLD: Math.round(d.YLD_incidence * 10) / 10,
    DALY: Math.round(d.DALY_incidence * 10) / 10,
  }));

  const colors = ['#1e3a5f', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Disease Burden Comparison</CardTitle>
          <CardDescription>Deaths, YLL, YLD, and DALY by disease group</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={100}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip 
                formatter={(value) => formatNumber(value as number)}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
              />
              <Legend />
              <Bar dataKey="Deaths" fill={colors[0]} />
              <Bar dataKey="YLL" fill={colors[1]} />
              <Bar dataKey="YLD" fill={colors[2]} />
              <Bar dataKey="DALY" fill={colors[3]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Disease Details Summary</CardTitle>
          <CardDescription>Comprehensive statistics for all disease groups</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-blue-50 border-b-2 border-blue-200">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-blue-900">Disease Group</th>
                  <th className="px-4 py-2 text-right font-semibold text-blue-900">Deaths</th>
                  <th className="px-4 py-2 text-right font-semibold text-blue-900">YLL</th>
                  <th className="px-4 py-2 text-right font-semibold text-blue-900">YLD</th>
                  <th className="px-4 py-2 text-right font-semibold text-blue-900">DALY</th>
                  <th className="px-4 py-2 text-right font-semibold text-blue-900">% DALY</th>
                </tr>
              </thead>
              <tbody>
                {diseases.map((disease, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-2 font-medium text-gray-900">{disease.Disease_group}</td>
                    <td className="px-4 py-2 text-right text-red-600 font-semibold">{formatNumber(disease.Deaths)}</td>
                    <td className="px-4 py-2 text-right text-teal-600">{formatDecimal(disease.YLL)}</td>
                    <td className="px-4 py-2 text-right text-amber-600">{formatDecimal(disease.YLD_incidence)}</td>
                    <td className="px-4 py-2 text-right text-blue-600 font-semibold">{formatDecimal(disease.DALY_incidence)}</td>
                    <td className="px-4 py-2 text-right text-gray-700">{formatDecimal((disease.Share_DALY || 0) * 100, 1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
