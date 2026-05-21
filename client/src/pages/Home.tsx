import { useHealthData } from '@/hooks/useHealthData';
import { HeroSection } from '@/components/HeroSection';
import { DiseaseChart } from '@/components/DiseaseChart';
import { DiseaseTable } from '@/components/DiseaseTable';
import { DistrictTable } from '@/components/DistrictTable';
import { Spinner } from '@/components/ui/spinner';

/**
 * Design Philosophy: Clinical Intelligence Dashboard
 * - Professional medical aesthetic with clinical blue (#1e3a5f) and teal accents (#10b981)
 * - Data-first hierarchy with clear visual prioritization
 * - Precision typography and structured layouts
 * - Interactive elements that reveal complexity without overwhelming
 */
export default function Home() {
  const { data, loading, error } = useHealthData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Spinner className="w-12 h-12 text-blue-600" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error Loading Data</h1>
          <p className="text-gray-600">{error || 'Failed to load health data'}</p>
        </div>
      </div>
    );
  }

  const { overview, diseases, districts } = data;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-6 px-4 shadow-lg">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold font-poppins">Satun Health Dashboard</h1>
          <p className="text-blue-100 mt-2">Comprehensive Health Data Analysis</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section with Main Metrics */}
        <HeroSection
          deaths={overview.deaths}
          daly={overview.daly_total}
          yll={overview.yll_total}
          yld={overview.yld_total}
          le={overview.le}
          hale={overview.hale}
          year={overview.year}
        />

        {/* Disease Analysis Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 font-poppins mb-6">
            Disease Analysis
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <DiseaseChart data={diseases} title="Top 10 Diseases by DALY Impact" />
            </div>
            <div className="bg-gradient-to-br from-teal-50 to-blue-50 p-6 rounded-lg border-2 border-teal-200">
              <h3 className="text-lg font-bold text-gray-800 font-poppins mb-4">
                Key Insights
              </h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-teal-600 font-bold mr-2">•</span>
                  <span>
                    <strong>Top Disease:</strong> Cancer leads with{' '}
                    {diseases[0]?.Disease_group === 'มะเร็ง'
                      ? '17.21%'
                      : diseases.find((d) => d.Disease_group === 'มะเร็ง')?.['Share_DALY_%']
                        ? `${(diseases.find((d) => d.Disease_group === 'มะเร็ง')!['Share_DALY_%'] * 100).toFixed(1)}%`
                        : 'significant'}{' '}
                    of DALY burden
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 font-bold mr-2">•</span>
                  <span>
                    <strong>Injury Impact:</strong> Accidents and injuries account for 12.14%
                    of DALY
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2">•</span>
                  <span>
                    <strong>Unknown Causes:</strong> {overview.unknown_cause} deaths from
                    unknown causes (R99)
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-2">•</span>
                  <span>
                    <strong>Life Expectancy:</strong> LE {overview.le.toFixed(2)} years, HALE{' '}
                    {overview.hale.toFixed(2)} years
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Disease Detailed Table */}
          <DiseaseTable data={diseases} title="Complete Disease Summary" />
        </section>

        {/* District Analysis Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 font-poppins mb-6">
            District Health Status
          </h2>
          <DistrictTable data={districts} title="Health Metrics by District" />
        </section>

        {/* Footer Info */}
        <section className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mt-12 mb-8">
          <h3 className="text-lg font-bold text-gray-800 font-poppins mb-3">
            About This Dashboard
          </h3>
          <p className="text-sm text-gray-700 mb-3">
            This dashboard presents comprehensive health data for Satun Province for the year
            2568 (2025). It includes mortality data, disability-adjusted life years (DALY),
            years of life lost (YLL), and years lived with disability (YLD).
          </p>
          <p className="text-xs text-gray-600">
            <strong>Data Source:</strong> Satun Province Health Department | <strong>Year:</strong>{' '}
            2568 | <strong>Last Updated:</strong> 2025
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-6 px-4 text-center text-sm">
        <p>&copy; 2025 Satun Province Health Dashboard. All rights reserved.</p>
      </footer>
    </div>
  );
}
