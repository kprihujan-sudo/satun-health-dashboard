import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface StatItem {
  label: string;
  value: number | string;
  change?: number;
  unit?: string;
  isPositive?: boolean;
}

interface SummaryStatisticsProps {
  title: string;
  stats: StatItem[];
  description?: string;
}

export function SummaryStatistics({ title, stats, description }: SummaryStatisticsProps) {
  return (
    <Card className="p-6 mb-6">
      <h3 className="text-xl font-bold text-gray-800 font-poppins mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-gray-600 mb-4">{description}</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-gradient-to-br from-blue-50 to-teal-50 p-4 rounded-lg border border-blue-200">
            <div className="text-sm text-gray-600 font-medium mb-1">{stat.label}</div>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold text-gray-800">
                {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                {stat.unit && <span className="text-sm ml-1">{stat.unit}</span>}
              </div>
              {stat.change !== undefined && (
                <div className={`flex items-center gap-1 text-sm font-semibold ${
                  stat.isPositive ? 'text-red-600' : 'text-green-600'
                }`}>
                  {stat.isPositive ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>{stat.isPositive ? '+' : ''}{stat.change.toFixed(1)}%</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
