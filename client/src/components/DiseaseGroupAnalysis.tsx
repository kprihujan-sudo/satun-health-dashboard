import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
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

interface DiseaseGroupAnalysisProps {
  diseases: DiseaseData[];
}

const COLORS = ['#1e3a5f', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#6366f1'];

export function DiseaseGroupAnalysis({ diseases }: DiseaseGroupAnalysisProps) {
  const pieData = diseases.map(d => ({
    name: d.Disease_group,
    value: Math.round(d.DALY_incidence * 10) / 10,
    deaths: d.Deaths,
  }));

  const barData = diseases.map(d => ({
    name: d.Disease_group,
    deaths: d.Deaths,
    daly: Math.round(d.DALY_incidence),
  }));

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>DALY Distribution by Disease Group</CardTitle>
          <CardDescription>Proportion of total disease burden (DALY) across all disease groups</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${formatNumber(value)}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatNumber(value as number)} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Deaths vs DALY by Disease Group</CardTitle>
          <CardDescription>Comparing mortality and disease burden across groups</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={100}
                tick={{ fontSize: 12 }}
              />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value) => formatNumber(value as number)}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="deaths" fill="#ef4444" name="Deaths" />
              <Bar yAxisId="right" dataKey="daly" fill="#3b82f6" name="DALY" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Disease Group Ranking</CardTitle>
          <CardDescription>Ranked by DALY burden with mortality statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-blue-50 border-b-2 border-blue-200">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-blue-900">Rank</th>
                  <th className="px-4 py-2 text-left font-semibold text-blue-900">Disease Group</th>
                  <th className="px-4 py-2 text-right font-semibold text-blue-900">Deaths</th>
                  <th className="px-4 py-2 text-right font-semibold text-blue-900">YLL</th>
                  <th className="px-4 py-2 text-right font-semibold text-blue-900">YLD</th>
                  <th className="px-4 py-2 text-right font-semibold text-blue-900">DALY</th>
                  <th className="px-4 py-2 text-right font-semibold text-blue-900">% of Total</th>
                </tr>
              </thead>
              <tbody>
                {diseases
                  .sort((a, b) => b.DALY_incidence - a.DALY_incidence)
                  .map((disease, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-2 font-bold text-center text-blue-600">{idx + 1}</td>
                      <td className="px-4 py-2 font-medium text-gray-900">{disease.Disease_group}</td>
                      <td className="px-4 py-2 text-right text-red-600 font-semibold">{formatNumber(disease.Deaths)}</td>
                      <td className="px-4 py-2 text-right text-teal-600">{formatDecimal(disease.YLL)}</td>
                      <td className="px-4 py-2 text-right text-amber-600">{formatDecimal(disease.YLD_incidence)}</td>
                      <td className="px-4 py-2 text-right text-blue-600 font-semibold">{formatDecimal(disease.DALY_incidence)}</td>
                      <td className="px-4 py-2 text-right text-gray-700 font-semibold">{formatDecimal((disease.Share_DALY || 0) * 100, 1)}%</td>
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
