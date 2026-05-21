import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatNumber, formatDecimal, getRiskLevelColor, getRiskLevelBg } from '@/hooks/useHealthData';

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

interface DistrictComparisonProps {
  districts: DistrictData[];
}

export function DistrictComparison({ districts }: DistrictComparisonProps) {
  const chartData = districts.map(d => ({
    district: d.District,
    deaths: d.Deaths,
    deathRate: Math.round(d.Death_rate_per100k * 10) / 10,
    dalyRate: Math.round(d.DALY_rate_per100k * 10) / 10,
    population: d.Population_ref,
  }));

  const scatterData = districts.map(d => ({
    district: d.District,
    deathRate: Math.round(d.Death_rate_per100k * 10) / 10,
    dalyRate: Math.round(d.DALY_rate_per100k * 10) / 10,
    population: d.Population_ref,
    riskLevel: d.Risk_level,
  }));

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Death Rate vs DALY Rate by District</CardTitle>
          <CardDescription>Comparing mortality and disease burden across districts (per 100,000 population)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="district" 
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
              <Bar yAxisId="left" dataKey="deathRate" fill="#ef4444" name="Death Rate/100k" />
              <Bar yAxisId="right" dataKey="dalyRate" fill="#3b82f6" name="DALY Rate/100k" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>District Health Status Comparison</CardTitle>
          <CardDescription>Comprehensive health metrics by district</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-blue-50 border-b-2 border-blue-200">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-blue-900">District</th>
                  <th className="px-4 py-2 text-right font-semibold text-blue-900">Population</th>
                  <th className="px-4 py-2 text-right font-semibold text-blue-900">Deaths</th>
                  <th className="px-4 py-2 text-right font-semibold text-blue-900">Death Rate/100k</th>
                  <th className="px-4 py-2 text-right font-semibold text-blue-900">DALY Rate/100k</th>
                  <th className="px-4 py-2 text-center font-semibold text-blue-900">Risk Level</th>
                </tr>
              </thead>
              <tbody>
                {districts
                  .sort((a, b) => b.DALY_rate_per100k - a.DALY_rate_per100k)
                  .map((district, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-2 font-medium text-gray-900">{district.District}</td>
                      <td className="px-4 py-2 text-right text-gray-700">{formatNumber(district.Population_ref)}</td>
                      <td className="px-4 py-2 text-right font-semibold text-red-600">{formatNumber(district.Deaths)}</td>
                      <td className="px-4 py-2 text-right text-orange-600">{formatDecimal(district.Death_rate_per100k)}</td>
                      <td className="px-4 py-2 text-right font-semibold text-blue-600">{formatDecimal(district.DALY_rate_per100k)}</td>
                      <td className="px-4 py-2 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          district.Risk_level.includes('วิกฤต') ? 'bg-red-100 text-red-700' :
                          district.Risk_level.includes('สูง') ? 'bg-amber-100 text-amber-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {district.Risk_level}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>District Risk Assessment</CardTitle>
          <CardDescription>Risk level distribution across districts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {districts.map((district, idx) => (
              <div 
                key={idx} 
                className={`p-4 rounded-lg border-l-4 ${
                  district.Risk_level.includes('วิกฤต') ? 'bg-red-50 border-red-500' :
                  district.Risk_level.includes('สูง') ? 'bg-amber-50 border-amber-500' :
                  'bg-green-50 border-green-500'
                }`}
              >
                <div className="font-semibold text-gray-900 mb-2">{district.District}</div>
                <div className="text-sm space-y-1 text-gray-700">
                  <div>Deaths: <span className="font-semibold text-red-600">{formatNumber(district.Deaths)}</span></div>
                  <div>Death Rate: <span className="font-semibold">{formatDecimal(district.Death_rate_per100k)}/100k</span></div>
                  <div>DALY Rate: <span className="font-semibold text-blue-600">{formatDecimal(district.DALY_rate_per100k)}/100k</span></div>
                  <div className="pt-2 border-t mt-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      district.Risk_level.includes('วิกฤต') ? 'bg-red-200 text-red-800' :
                      district.Risk_level.includes('สูง') ? 'bg-amber-200 text-amber-800' :
                      'bg-green-200 text-green-800'
                    }`}>
                      {district.Risk_level}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
