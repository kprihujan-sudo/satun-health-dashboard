import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';

interface LEHALEData {
  Year: number;
  LE_Male?: number;
  LE_Female?: number;
  LE_Total?: number;
  HALE_Male?: number;
  HALE_Female?: number;
  HALE_Total?: number;
  Gap_Male?: number;
  Gap_Female?: number;
  Gap_Total?: number;
  'Healthy_Life_%'?: number;
  [key: string]: any;
}

interface LEHALETrendChartProps {
  data: LEHALEData[];
  title?: string;
}

export function LEHALETrendChart({ data, title = 'Life Expectancy & Healthy Life Expectancy Trend (7 Years)' }: LEHALETrendChartProps) {
  if (!data || data.length === 0) {
    return <div className="text-center text-gray-500">No data available</div>;
  }

  // เตรียมข้อมูลสำหรับกราฟ
  const chartData = data.map(item => ({
    year: item.Year,
    LE: item.LE_Total ? parseFloat(item.LE_Total.toString()) : 0,
    HALE: item.HALE_Total ? parseFloat(item.HALE_Total.toString()) : 0,
    LE_Male: item.LE_Male ? parseFloat(item.LE_Male.toString()) : 0,
    LE_Female: item.LE_Female ? parseFloat(item.LE_Female.toString()) : 0,
    HALE_Male: item.HALE_Male ? parseFloat(item.HALE_Male.toString()) : 0,
    HALE_Female: item.HALE_Female ? parseFloat(item.HALE_Female.toString()) : 0,
  }));

  return (
    <Card className="p-6 bg-white border-2 border-blue-200">
      <h3 className="text-lg font-bold text-gray-800 font-poppins mb-4">{title}</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LE Trend */}
        <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-lg border border-blue-100">
          <h4 className="text-sm font-bold text-gray-700 mb-3">Life Expectancy (LE) Trend</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="year" 
                stroke="#666"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#666"
                style={{ fontSize: '12px' }}
                domain={[70, 85]}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}
                formatter={(value) => value.toFixed(2)}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="LE" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 5 }}
                activeDot={{ r: 7 }}
                name="LE Total"
                connectNulls
              />
              <Line 
                type="monotone" 
                dataKey="LE_Male" 
                stroke="#60a5fa" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#60a5fa', r: 4 }}
                name="LE Male"
                connectNulls
              />
              <Line 
                type="monotone" 
                dataKey="LE_Female" 
                stroke="#f87171" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#f87171', r: 4 }}
                name="LE Female"
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* HALE Trend */}
        <div className="bg-gradient-to-br from-teal-50 to-white p-4 rounded-lg border border-teal-100">
          <h4 className="text-sm font-bold text-gray-700 mb-3">Healthy Life Expectancy (HALE) Trend</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="year" 
                stroke="#666"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#666"
                style={{ fontSize: '12px' }}
                domain={[65, 80]}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}
                formatter={(value) => value.toFixed(2)}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="HALE" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 5 }}
                activeDot={{ r: 7 }}
                name="HALE Total"
                connectNulls
              />
              <Line 
                type="monotone" 
                dataKey="HALE_Male" 
                stroke="#6ee7b7" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#6ee7b7', r: 4 }}
                name="HALE Male"
                connectNulls
              />
              <Line 
                type="monotone" 
                dataKey="HALE_Female" 
                stroke="#fbbf24" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#fbbf24', r: 4 }}
                name="HALE Female"
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {chartData.length > 0 && (
          <>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="text-xs text-gray-600">Latest LE (2568)</p>
              <p className="text-lg font-bold text-blue-700">{chartData[chartData.length - 1].LE.toFixed(2)}</p>
            </div>
            <div className="bg-teal-50 p-3 rounded-lg border border-teal-200">
              <p className="text-xs text-gray-600">Latest HALE (2568)</p>
              <p className="text-lg font-bold text-teal-700">{chartData[chartData.length - 1].HALE.toFixed(2)}</p>
            </div>
            <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
              <p className="text-xs text-gray-600">LE Change (2562-2568)</p>
              <p className="text-lg font-bold text-amber-700">
                {(chartData[chartData.length - 1].LE - chartData[0].LE).toFixed(2)}
              </p>
            </div>
            <div className="bg-red-50 p-3 rounded-lg border border-red-200">
              <p className="text-xs text-gray-600">HALE Change (2562-2568)</p>
              <p className="text-lg font-bold text-red-700">
                {(chartData[chartData.length - 1].HALE - chartData[0].HALE).toFixed(2)}
              </p>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
