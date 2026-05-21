import { getRiskLevelBg } from '@/hooks/useHealthData';

interface RiskBadgeProps {
  level: string;
  className?: string;
}

export function RiskBadge({ level, className = '' }: RiskBadgeProps) {
  const bgClass = getRiskLevelBg(level);
  
  const textClass = level?.toLowerCase().includes('วิกฤต')
    ? 'text-red-700'
    : level?.toLowerCase().includes('สูง')
      ? 'text-amber-700'
      : level?.toLowerCase().includes('ปกติ')
        ? 'text-green-700'
        : 'text-gray-700';

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${bgClass} ${textClass} ${className}`}
    >
      {level}
    </span>
  );
}
