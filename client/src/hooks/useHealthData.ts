import { useEffect, useState } from 'react';
import healthData from '@/data/health-data.json';

export interface HealthData {
  overview: {
    year: number;
    deaths: number;
    daly_total: number;
    yll_total: number;
    yld_total: number;
    le: number;
    hale: number;
    unknown_cause: number;
  };
  diseases: Array<{
    Disease_group: string;
    Deaths: number;
    YLL: number;
    YLD_incidence: number;
    DALY_incidence: number;
    'Share_deaths_%'?: number;
    'Share_DALY_%'?: number;
  }>;
  districts: Array<{
    District: string;
    Deaths: number;
    YLL: number;
    YLD_incidence: number;
    DALY_incidence: number;
    Population_ref: number;
    Death_rate_per100k: number;
    DALY_rate_per100k: number;
    Risk_level: string;
  }>;
  le_hale_trend: Array<Record<string, any>>;
  specific_diseases: Array<Record<string, any>>;
  disease_district_matrix: Array<Record<string, any>>;
  moph_groups: Array<Record<string, any>>;
  le_hale?: Array<Record<string, any>>;
  integrated?: Array<Record<string, any>>;
}

export function useHealthData() {
  const [data, setData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setData(healthData as HealthData);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load health data');
      setLoading(false);
    }
  }, []);

  return { data, loading, error };
}

export function getRiskLevelColor(riskLevel: string): string {
  const level = riskLevel?.toLowerCase() || '';
  if (level.includes('วิกฤต')) return '#ef4444'; // Red
  if (level.includes('สูง')) return '#f59e0b'; // Amber
  if (level.includes('ปกติ')) return '#10b981'; // Green
  return '#6b7280'; // Gray
}

export function getRiskLevelBg(riskLevel: string): string {
  const level = riskLevel?.toLowerCase() || '';
  if (level.includes('วิกฤต')) return 'bg-red-50';
  if (level.includes('สูง')) return 'bg-amber-50';
  if (level.includes('ปกติ')) return 'bg-green-50';
  return 'bg-gray-50';
}

export function formatNumber(num: number | undefined): string {
  if (num === undefined || num === null) return '0';
  return new Intl.NumberFormat('th-TH').format(Math.round(num));
}

export function formatDecimal(num: number | undefined, decimals = 2): string {
  if (num === undefined || num === null) return '0';
  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}
