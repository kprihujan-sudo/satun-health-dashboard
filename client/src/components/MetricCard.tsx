import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'blue' | 'teal' | 'amber' | 'red';
  className?: string;
}

const colorStyles = {
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    icon: 'text-blue-500',
  },
  teal: {
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    text: 'text-teal-700',
    icon: 'text-teal-500',
  },
  amber: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    icon: 'text-amber-500',
  },
  red: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    icon: 'text-red-500',
  },
};

export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  color = 'blue',
  className = '',
}: MetricCardProps) {
  const styles = colorStyles[color];

  return (
    <Card className={`${styles.bg} border-2 ${styles.border} p-6 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className={`text-3xl font-bold ${styles.text} font-poppins`}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-2">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className={`${styles.icon} text-2xl ml-4`}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
