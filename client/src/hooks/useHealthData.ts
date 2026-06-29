import { useEffect, useState } from 'react';
import { fetchAllSheets, parseNum } from '@/lib/googleSheets';

export interface HealthData {
  overview: {
    year: number;
    deaths: number;
    daly_total: number;
    yll_total: number;
    yld_total: number;
    le: number;
    hale: number;
    le_hale_gap: number;
    healthy_life_pct: number;
    population: number;
    daly_rate_per100k: number;
    unknown_cause: number;
  };
  diseases: Array<{
    Disease_group: string;
    Deaths: number;
    YLL: number;
    YLD_incidence: number;
    DALY_incidence: number;
    'Share_deaths_%': number;
    'Share_DALY_%': number;
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
  le_hale_trend: Array<{
    Year: number;
    LE_Male: number;
    LE_Female: number;
    LE_Total: number;
    HALE_Male: number;
    HALE_Female: number;
    HALE_Total: number;
    Gap_Male: number;
    Gap_Female: number;
    Gap_Total: number;
    Healthy_Life_pct: number;
  }>;
  specific_diseases: Array<{
    ICD10: string;
    Disease: string;
    Deaths: number;
    Avg_age: number;
    YLL: number;
    DALY_incidence: number;
  }>;
  disease_district_matrix: Array<{ District: string; [key: string]: string | number }>;
  moph_groups: Array<Record<string, any>>;
}

function transformData(raw: Awaited<ReturnType<typeof fetchAllSheets>>): HealthData {
  // --- Disease Group ---
  const diseases = raw.diseaseGroup
    .filter(r => r['Disease_group'] && r['Disease_group'].trim())
    .map(r => ({
      Disease_group: r['Disease_group'],
      Deaths: parseNum(r['Deaths']),
      YLL: parseNum(r['YLL']),
      YLD_incidence: parseNum(r['YLD_incidence']),
      DALY_incidence: parseNum(r['DALY_incidence']),
      'Share_deaths_%': parseNum(r['Share_deaths_%']),
      'Share_DALY_%': parseNum(r['Share_DALY_%']),
    }));

  // --- คำนวณ overview จาก Summary_Disease_Group (รวมทุกโรค) ---
  const totalDeaths = diseases.reduce((sum, d) => sum + d.Deaths, 0);
  const totalDALY = diseases.reduce((sum, d) => sum + d.DALY_incidence, 0);
  const totalYLL = diseases.reduce((sum, d) => sum + d.YLL, 0);
  const totalYLD = diseases.reduce((sum, d) => sum + d.YLD_incidence, 0);

  // --- LE/HALE จาก LE_HALE_Source แถวปีล่าสุด ---
  const leHaleSorted = raw.leHale
    .filter(r => r['Year'] && parseNum(r['Year']) > 0)
    .sort((a, b) => parseNum(b['Year']) - parseNum(a['Year']));
  const latestLeHale = leHaleSorted[0] ?? {};

  // --- Population จาก Summary_District (รวมทุกอำเภอ) ---
  const totalPop = raw.district
    .filter(r => r['District'] && r['District'].trim())
    .reduce((sum, r) => sum + parseNum(r['Population_ref']), 0);

  // --- DALY rate per 100k ---
  const dalyRate = totalPop > 0 ? (totalDALY / totalPop) * 100000 : 0;

  // --- Unknown cause ---
  const unknownDisease = diseases.find(d =>
    d.Disease_group.includes('ไม่ทราบสาเหตุ') || d.Disease_group.includes('R99')
  );

  const overview = {
    year: parseNum(latestLeHale['Year'] || '2568'),
    deaths: Math.round(totalDeaths),
    daly_total: totalDALY,
    yll_total: totalYLL,
    yld_total: totalYLD,
    le: parseNum(latestLeHale['LE_Total']),
    hale: parseNum(latestLeHale['HALE_Total']),
    le_hale_gap: parseNum(latestLeHale['Gap_Total']),
    healthy_life_pct: parseNum(latestLeHale['Healthy_Life_%']),
    population: Math.round(totalPop),
    daly_rate_per100k: dalyRate,
    unknown_cause: unknownDisease?.Deaths ?? 0,
  };

  // --- Districts ---
  const districts = raw.district
    .filter(r => r['District'] && r['District'].trim())
    .map(r => ({
      District: r['District'],
      Deaths: parseNum(r['Deaths']),
      YLL: parseNum(r['YLL']),
      YLD_incidence: parseNum(r['YLD_incidence']),
      DALY_incidence: parseNum(r['DALY_incidence']),
      Population_ref: parseNum(r['Population_ref']),
      Death_rate_per100k: parseNum(r['Death_rate_per100k']),
      DALY_rate_per100k: parseNum(r['DALY_rate_per100k']),
      Risk_level: r['Risk_level'] ?? '',
    }));

  // --- LE/HALE Trend ---
  const le_hale_trend = raw.leHale
    .filter(r => r['Year'] && parseNum(r['Year']) > 0)
    .map(r => ({
      Year: parseNum(r['Year']),
      LE_Male: parseNum(r['LE_Male']),
      LE_Female: parseNum(r['LE_Female']),
      LE_Total: parseNum(r['LE_Total']),
      HALE_Male: parseNum(r['HALE_Male']),
      HALE_Female: parseNum(r['HALE_Female']),
      HALE_Total: parseNum(r['HALE_Total']),
      Gap_Male: parseNum(r['Gap_Male']),
      Gap_Female: parseNum(r['Gap_Female']),
      Gap_Total: parseNum(r['Gap_Total']),
      Healthy_Life_pct: parseNum(r['Healthy_Life_%']),
    }))
    .sort((a, b) => a.Year - b.Year);

  // --- Specific Diseases ---
  const specific_diseases = raw.specificDisease
    .filter(r => r['ICD10'] && r['Disease'])
    .map(r => ({
      ICD10: r['ICD10'],
      Disease: r['Disease'],
      Deaths: parseNum(r['Deaths']),
      Avg_age: parseNum(r['Avg_age']),
      YLL: parseNum(r['YLL']),
      DALY_incidence: parseNum(r['DALY_incidence']),
    }));

  // --- Disease × District Matrix ---
  const disease_district_matrix: Array<{ District: string; [key: string]: string | number }> = raw.matrix
    .filter(r => r['District'] && r['District'].trim())
    .map(r => {
      const row: { District: string; [key: string]: string | number } = { District: r['District'] };
      Object.keys(r).forEach(k => {
        if (k !== 'District' && k.trim()) {
          row[k] = parseNum(r[k]);
        }
      });
      return row;
    });

  return {
    overview,
    diseases,
    districts,
    le_hale_trend,
    specific_diseases,
    disease_district_matrix,
    moph_groups: [],
  };
}

export function useHealthData() {
  const [data, setData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchAllSheets()
      .then(raw => {
        if (cancelled) return;
        const transformed = transformData(raw);
        setData(transformed);
        setLoading(false);
      })
      .catch(err => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'ไม่สามารถโหลดข้อมูลจาก Google Sheets ได้');
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  return { data, loading, error };
}

export function getRiskLevelColor(riskLevel: string): string {
  const level = riskLevel?.toLowerCase() || '';
  if (level.includes('วิกฤต')) return '#ef4444';
  if (level.includes('สูง')) return '#f59e0b';
  if (level.includes('ปกติ')) return '#10b981';
  return '#6b7280';
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
