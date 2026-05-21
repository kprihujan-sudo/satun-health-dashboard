import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface RankItem {
  rank: number;
  name: string;
  value: number;
  unit?: string;
  trend?: number;
}

interface RankingTableProps {
  title: string;
  items: RankItem[];
  type: 'top' | 'bottom';
  description?: string;
}

export function RankingTable({ title, items, type, description }: RankingTableProps) {
  const isTop = type === 'top';
  const bgColor = isTop ? 'from-green-50 to-teal-50' : 'from-red-50 to-orange-50';
  const borderColor = isTop ? 'border-green-200' : 'border-red-200';
  const rankColor = isTop ? 'text-green-600' : 'text-red-600';

  return (
    <Card className={`p-6 bg-gradient-to-br ${bgColor} border-2 ${borderColor}`}>
      <h3 className="text-lg font-bold text-gray-800 font-poppins mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-gray-600 mb-4">{description}</p>
      )}
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.rank} className="flex items-center gap-4 bg-white p-3 rounded-lg border border-gray-200">
            <div className={`text-2xl font-bold ${rankColor} w-8 text-center`}>
              #{item.rank}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-800">{item.name}</div>
              <div className="text-sm text-gray-600">
                {item.value !== undefined ? item.value.toLocaleString() : 'N/A'} {item.unit || ''}
              </div>
            </div>
            {item.trend !== undefined && (
              <div className={`flex items-center gap-1 font-semibold ${
                item.trend > 0 ? 'text-red-600' : 'text-green-600'
              }`}>
                {item.trend > 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>{item.trend > 0 ? '+' : ''}{item.trend.toFixed(1)}%</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
