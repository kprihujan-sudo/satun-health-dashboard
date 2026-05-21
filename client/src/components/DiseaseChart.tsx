import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';
import { formatDecimal } from '@/hooks/useHealthData';

interface DiseaseData {
  Disease_group: string;
  Deaths: number;
  YLL: number;
  YLD_incidence: number;
  DALY_incidence: number;
  'Share_deaths_%'?: number;
  'Share_DALY_%'?: number;
}

interface DiseaseChartProps {
  data: DiseaseData[];
  title?: string;
}

export function DiseaseChart({ data, title = 'Top Diseases by DALY' }: DiseaseChartProps) {
  // Sort by DALY and take top 10
  const topDiseases = [...data]
    .sort((a, b) => (b.DALY_incidence || 0) - (a.DALY_incidence || 0))
    .slice(0, 10);

  const chartData = topDiseases.map((d) => ({
    name: d.Disease_group.length > 20 ? d.Disease_group.substring(0, 17) + '...' : d.Disease_group,
    fullName: d.Disease_group,
    DALY: Math.round(d.DALY_incidence),
    Deaths: d.Deaths,
  }));

  return (
    <Card className="p-6 border-2 border-blue-200">
      <h2 className="text-xl font-bold text-gray-800 font-poppins mb-4">{title}</h2>
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={100}
              tick={{ fontSize: 12 }}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '2px solid #1e3a5f',
                borderRadius: '8px',
              }}
              formatter={(value: any) => formatDecimal(value, 0)}
              labelFormatter={(label) => `Disease: ${label}`}
            />
            <Legend />
            <Bar dataKey="DALY" fill="#10b981" radius={[8, 8, 0, 0]} />
            <Bar dataKey="Deaths" fill="#1e3a5f" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
