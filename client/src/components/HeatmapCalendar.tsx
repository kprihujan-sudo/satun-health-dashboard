import { Card } from '@/components/ui/card';

interface HeatmapData {
  month: string;
  year: number;
  value: number;
}

interface HeatmapCalendarProps {
  data: HeatmapData[];
  title?: string;
  unit?: string;
}

export function HeatmapCalendar({ data, title = 'Mortality Trends', unit = 'Deaths' }: HeatmapCalendarProps) {
  // Group by year
  const years = Array.from(new Set(data.map(d => d.year))).sort();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Find min/max for color scale
  const values = data.map(d => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  const getColor = (value: number) => {
    const normalized = (value - minValue) / (maxValue - minValue);
    if (normalized < 0.2) return 'bg-blue-100';
    if (normalized < 0.4) return 'bg-blue-300';
    if (normalized < 0.6) return 'bg-yellow-300';
    if (normalized < 0.8) return 'bg-orange-400';
    return 'bg-red-600 text-white';
  };

  return (
    <Card className="p-6 overflow-x-auto">
      <h3 className="text-lg font-bold text-gray-800 font-poppins mb-4">{title}</h3>
      <div className="space-y-4">
        {years.map((year) => (
          <div key={year}>
            <h4 className="font-semibold text-gray-700 mb-2">Year {year}</h4>
            <div className="grid grid-cols-12 gap-1">
              {months.map((month, idx) => {
                const monthData = data.find(d => d.year === year && d.month === month);
                const value = monthData?.value || 0;
                return (
                  <div
                    key={`${year}-${month}`}
                    className={`p-2 rounded text-center text-xs font-semibold ${getColor(value)}`}
                    title={`${month} ${year}: ${value} ${unit}`}
                  >
                    <div className="text-xs">{month}</div>
                    <div className="text-xs">{value}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-xs text-gray-600">
        <p className="font-semibold mb-2">Color Scale:</p>
        <div className="flex gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100 border border-gray-300"></div>
            <span>Low</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-300"></div>
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-600"></div>
            <span>High</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
