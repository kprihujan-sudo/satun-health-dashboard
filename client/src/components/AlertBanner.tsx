import { AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';

export type AlertLevel = 'critical' | 'warning' | 'info';

interface Alert {
  level: AlertLevel;
  title: string;
  message: string;
  detail?: string;
}

interface AlertBannerProps {
  alerts: Alert[];
}

export function AlertBanner({ alerts }: AlertBannerProps) {
  if (alerts.length === 0) return null;

  const getAlertStyle = (level: AlertLevel) => {
    switch (level) {
      case 'critical':
        return 'bg-red-50 border-red-300 text-red-900';
      case 'warning':
        return 'bg-amber-50 border-amber-300 text-amber-900';
      case 'info':
        return 'bg-blue-50 border-blue-300 text-blue-900';
    }
  };

  const getAlertIcon = (level: AlertLevel) => {
    switch (level) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      case 'info':
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-3 mb-6">
      {alerts.map((alert, idx) => (
        <Card key={idx} className={`p-4 border-2 ${getAlertStyle(alert.level)}`}>
          <div className="flex items-start gap-3">
            <div className="mt-0.5">{getAlertIcon(alert.level)}</div>
            <div className="flex-1">
              <h4 className="font-bold text-sm mb-1">{alert.title}</h4>
              <p className="text-sm">{alert.message}</p>
              {alert.detail && (
                <p className="text-xs opacity-75 mt-1">{alert.detail}</p>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
