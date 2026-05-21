import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ComparisonData {
  label: string;
  year1: number;
  year2: number;
  difference: number;
  percentChange: number;
}

interface DataComparisonProps {
  data: ComparisonData[];
  year1: number;
  year2: number;
  title: string;
  metric: string;
}

export function DataComparison({ data, year1, year2, title, metric }: DataComparisonProps) {
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');

  const chartData = data.map(item => ({
    label: item.label,
    [year1]: item.year1,
    [year2]: item.year2,
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        <div className="flex gap-2">
          <Button
            onClick={() => setViewMode('chart')}
            variant={viewMode === 'chart' ? 'default' : 'outline'}
            size="sm"
          >
            Chart
          </Button>
          <Button
            onClick={() => setViewMode('table')}
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
          >
            Table
          </Button>
        </div>
      </div>

      {viewMode === 'chart' ? (
        <Card className="p-4">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={year1} fill="#3b82f6" />
              <Bar dataKey={year2} fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      ) : (
        <Card className="p-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">Item</th>
                <th className="px-3 py-2 text-right font-semibold">{year1}</th>
                <th className="px-3 py-2 text-right font-semibold">{year2}</th>
                <th className="px-3 py-2 text-right font-semibold">Difference</th>
                <th className="px-3 py-2 text-right font-semibold">% Change</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="px-3 py-2">{item.label}</td>
                  <td className="px-3 py-2 text-right">{item.year1.toLocaleString()}</td>
                  <td className="px-3 py-2 text-right">{item.year2.toLocaleString()}</td>
                  <td className={`px-3 py-2 text-right font-semibold ${item.difference >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {item.difference >= 0 ? '+' : ''}{item.difference.toLocaleString()}
                  </td>
                  <td className={`px-3 py-2 text-right font-semibold ${item.percentChange >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {item.percentChange >= 0 ? '+' : ''}{item.percentChange.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
