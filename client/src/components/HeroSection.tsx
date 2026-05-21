import { Heart, Activity, TrendingUp, AlertCircle } from 'lucide-react';
import { MetricCard } from './MetricCard';
import { formatNumber, formatDecimal } from '@/hooks/useHealthData';

interface HeroSectionProps {
  deaths: number;
  daly: number;
  yll: number;
  yld: number;
  le: number;
  hale: number;
  year: number;
}

export function HeroSection({
  deaths,
  daly,
  yll,
  yld,
  le,
  hale,
  year,
}: HeroSectionProps) {
  return (
    <div className="mb-12">
      {/* Hero Banner */}
      <div
        className="relative h-80 rounded-lg overflow-hidden mb-8 bg-gradient-to-r from-blue-900 to-blue-700"
        style={{
          backgroundImage: `url('https://d2xsxph8kpxj0f.cloudfront.net/310519663563190258/SrYKdXrZM9co4J9gnuPjS2/satun-health-hero-k4j3aabtr66UA8zMCBNddo.webp')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col justify-center px-8">
          <h1 className="text-4xl font-bold text-white font-poppins mb-2">
            Burden of Disease and Population Health Status Dashboard
          </h1>
          <p className="text-xl text-teal-200 font-poppins">
            แดชบอร์ดวิเคราะห์ภาระโรคและสถานะสุขภาพประชากร
          </p>
          <p className="text-sm text-gray-200 mt-4">
            Health Data Analysis Year {year} | วิเคราะห์ข้อมูลสุขภาพประจำปี {year}
          </p>
        </div>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Deaths"
          value={formatNumber(deaths)}
          subtitle="Year 2568"
          icon={<AlertCircle size={24} />}
          color="red"
        />
        <MetricCard
          title="DALY Total"
          value={formatDecimal(daly, 1)}
          subtitle="Disability-Adjusted Life Years"
          icon={<Activity size={24} />}
          color="amber"
        />
        <MetricCard
          title="YLL Total"
          value={formatDecimal(yll, 1)}
          subtitle="Years of Life Lost"
          icon={<TrendingUp size={24} />}
          color="blue"
        />
        <MetricCard
          title="YLD Total"
          value={formatDecimal(yld, 1)}
          subtitle="Years Lived with Disability"
          icon={<Heart size={24} />}
          color="teal"
        />
      </div>

      {/* Life Expectancy Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <MetricCard
          title="Life Expectancy (LE)"
          value={formatDecimal(le, 2)}
          subtitle="Average life expectancy in years"
          color="blue"
        />
        <MetricCard
          title="Healthy Life Expectancy (HALE)"
          value={formatDecimal(hale, 2)}
          subtitle="Expected years in good health"
          color="teal"
        />
        <MetricCard
          title="LE-HALE Gap"
          value={formatDecimal(le - hale, 2)}
          subtitle="Years with disability/poor health"
          color="red"
        />
      </div>
    </div>
  );
}
