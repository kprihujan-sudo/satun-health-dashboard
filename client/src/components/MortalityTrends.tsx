import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatNumber } from '@/hooks/useHealthData';

interface LEHALETrendData {
  Year: number;
  LE_Male: number;
  LE_Female: number;
  LE_Total: number;
  HALE_Male: number;
  HALE_Female: number;
  HALE_Total: number;
  Gap_Male: number;
  Gap_Female: number;
  Gap_Total: number;
}

interface MortalityTrendsProps {
  leHaleTrend: LEHALETrendData[];
}

export function MortalityTrends({ leHaleTrend }: MortalityTrendsProps) {
  const chartData = leHaleTrend.map(d => ({
    year: d.Year,
    gap: d.Gap_Total,
    gapMale: d.Gap_Male,
    gapFemale: d.Gap_Female,
    healthyPercent: Math.round((d.HALE_Total / d.LE_Total) * 100),
  }));

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>LE-HALE Gap Trend (7 Years)</CardTitle>
          <CardDescription>Years lived with disability/poor health - the gap between life expectancy and healthy life expectancy</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip 
                formatter={(value) => formatNumber(value as number)}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="gap" 
                stroke="#ef4444" 
                strokeWidth={3}
                name="Total Gap (Years)"
                dot={{ fill: '#ef4444', r: 5 }}
              />
              <Line 
                type="monotone" 
                dataKey="gapMale" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Male Gap"
                strokeDasharray="5 5"
              />
              <Line 
                type="monotone" 
                dataKey="gapFemale" 
                stroke="#ec4899" 
                strokeWidth={2}
                name="Female Gap"
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Healthy Life Percentage Trend</CardTitle>
          <CardDescription>Percentage of life expectancy spent in good health (HALE/LE)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="year" />
              <YAxis domain={[85, 95]} />
              <Tooltip 
                formatter={(value) => `${value}%`}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
              />
              <Bar dataKey="healthyPercent" fill="#10b981" name="Healthy Life %" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Gap Analysis Summary</CardTitle>
          <CardDescription>Years of life lived with disability or poor health</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {chartData.map((item, idx) => (
              <div key={idx} className="p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-lg border border-red-200">
                <div className="text-sm font-semibold text-gray-600 mb-1">Year {item.year}</div>
                <div className="text-3xl font-bold text-red-600 mb-2">{item.gap.toFixed(2)}</div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>♂ Male: {item.gapMale.toFixed(2)} years</div>
                  <div>♀ Female: {item.gapFemale.toFixed(2)} years</div>
                  <div className="pt-2 border-t border-red-200 mt-2">
                    <span className="text-teal-600 font-semibold">{item.healthyPercent}%</span> healthy life
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
