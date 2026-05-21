import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDecimal } from '@/hooks/useHealthData';

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

interface LEHALEGapVisualizationProps {
  leHaleTrend: LEHALETrendData[];
}

export function LEHALEGapVisualization({ leHaleTrend }: LEHALEGapVisualizationProps) {
  const chartData = leHaleTrend.map(d => ({
    year: d.Year,
    le: d.LE_Total,
    hale: d.HALE_Total,
    gap: d.Gap_Total,
  }));

  const latestYear = leHaleTrend[leHaleTrend.length - 1];
  const gapPercentage = (latestYear.Gap_Total / latestYear.LE_Total) * 100;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-sm font-semibold text-blue-600 mb-2">Life Expectancy (LE)</div>
              <div className="text-4xl font-bold text-blue-900">{formatDecimal(latestYear.LE_Total, 2)}</div>
              <div className="text-xs text-blue-700 mt-2">Years (2568)</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-teal-50 to-teal-100">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-sm font-semibold text-teal-600 mb-2">Healthy Life Expectancy (HALE)</div>
              <div className="text-4xl font-bold text-teal-900">{formatDecimal(latestYear.HALE_Total, 2)}</div>
              <div className="text-xs text-teal-700 mt-2">Years (2568)</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-red-50 to-red-100">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-sm font-semibold text-red-600 mb-2">LE-HALE Gap</div>
              <div className="text-4xl font-bold text-red-900">{formatDecimal(latestYear.Gap_Total, 2)}</div>
              <div className="text-xs text-red-700 mt-2">{gapPercentage.toFixed(1)}% of LE</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>LE vs HALE Trend (7 Years)</CardTitle>
          <CardDescription>Life Expectancy and Healthy Life Expectancy comparison</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <defs>
                <linearGradient id="colorLE" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorHALE" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="year" />
              <YAxis domain={[70, 85]} />
              <Tooltip 
                formatter={(value) => formatDecimal(value as number, 2)}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="le" 
                stroke="#3b82f6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorLE)"
                name="Life Expectancy (LE)"
              />
              <Area 
                type="monotone" 
                dataKey="hale" 
                stroke="#10b981" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorHALE)"
                name="Healthy Life Expectancy (HALE)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>LE-HALE Gap by Year</CardTitle>
          <CardDescription>Years of life lived with disability or poor health</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip 
                formatter={(value) => formatDecimal(value as number, 2)}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
              />
              <Bar dataKey="gap" fill="#ef4444" name="Gap (Years)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Gap Analysis by Gender</CardTitle>
          <CardDescription>LE-HALE gap differences between males and females</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-sm font-semibold text-blue-600 mb-3">Male (♂)</div>
              <div className="space-y-2 text-sm">
                <div>LE: <span className="font-semibold text-blue-900">{formatDecimal(latestYear.LE_Male, 2)}</span></div>
                <div>HALE: <span className="font-semibold text-teal-600">{formatDecimal(latestYear.HALE_Male, 2)}</span></div>
                <div className="pt-2 border-t border-blue-200 mt-2">
                  Gap: <span className="font-bold text-red-600">{formatDecimal(latestYear.Gap_Male, 2)}</span> years
                </div>
              </div>
            </div>

            <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
              <div className="text-sm font-semibold text-pink-600 mb-3">Female (♀)</div>
              <div className="space-y-2 text-sm">
                <div>LE: <span className="font-semibold text-pink-900">{formatDecimal(latestYear.LE_Female, 2)}</span></div>
                <div>HALE: <span className="font-semibold text-teal-600">{formatDecimal(latestYear.HALE_Female, 2)}</span></div>
                <div className="pt-2 border-t border-pink-200 mt-2">
                  Gap: <span className="font-bold text-red-600">{formatDecimal(latestYear.Gap_Female, 2)}</span> years
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
