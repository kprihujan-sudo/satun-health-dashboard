import { useState } from 'react';
import { useHealthData } from '@/hooks/useHealthData';
import { Navigation, MenuTab } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { DiseaseChart } from '@/components/DiseaseChart';
import { DiseaseTable } from '@/components/DiseaseTable';
import { DistrictTable } from '@/components/DistrictTable';
import { LEHALETrendChart } from '@/components/LEHALETrendChart';
import { SpecificDiseasesTable } from '@/components/SpecificDiseasesTable';
import { DiseaseDistrictMatrix } from '@/components/DiseaseDistrictMatrix';
import { MOPHGroupsTable } from '@/components/MOPHGroupsTable';
import { Spinner } from '@/components/ui/spinner';

/**
 * Design Philosophy: Clinical Intelligence Dashboard - Professional Exclusive
 * - Multi-tab navigation for comprehensive data exploration
 * - Trend analysis with 7-year historical data
 * - Professional medical aesthetic with clinical blue and teal accents
 * - Data-first hierarchy with clear visual prioritization
 */
export default function Home() {
  const [activeTab, setActiveTab] = useState<MenuTab>('overview');
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

  const { overview, diseases, districts, le_hale_trend, specific_diseases, disease_district_matrix, moph_groups } = data;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <HeroSection
              deaths={overview.deaths}
              daly={overview.daly_total}
              yll={overview.yll_total}
              yld={overview.yld_total}
              le={overview.le}
              hale={overview.hale}
              year={overview.year}
            />

            <section>
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
                        <strong>Top Disease:</strong> Cancer leads with 17.21% of DALY burden
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-600 font-bold mr-2">•</span>
                      <span>
                        <strong>Injury Impact:</strong> Accidents and injuries account for 12.14% of DALY
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-600 font-bold mr-2">•</span>
                      <span>
                        <strong>Unknown Causes:</strong> {overview.unknown_cause} deaths from unknown causes (R99)
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 font-bold mr-2">•</span>
                      <span>
                        <strong>Life Expectancy:</strong> LE {overview.le.toFixed(2)} years, HALE {overview.hale.toFixed(2)} years
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <DiseaseTable data={diseases} title="Complete Disease Summary" />
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 font-poppins mb-6">
                District Health Status
              </h2>
              <DistrictTable data={districts} title="Health Metrics by District" />
            </section>
          </div>
        )}

        {/* LE/HALE Trend Tab */}
        {activeTab === 'le-hale-trend' && (
          <div className="space-y-8">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 font-poppins mb-2">
                Life Expectancy & Healthy Life Expectancy Trend Analysis
              </h2>
              <p className="text-gray-700">
                7-year historical data (2562-2568) showing trends in life expectancy and healthy life expectancy by gender
              </p>
            </div>
            {le_hale_trend && le_hale_trend.length > 0 && (
              <LEHALETrendChart data={le_hale_trend} />
            )}
          </div>
        )}

        {/* Disease Summary Tab */}
        {activeTab === 'disease-summary' && (
          <div className="space-y-8">
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 font-poppins mb-2">
                Disease Summary
              </h2>
              <p className="text-gray-700">
                Comprehensive overview of 14 major disease groups with mortality and morbidity data
              </p>
            </div>
            <DiseaseChart data={diseases} title="Disease Burden by DALY" />
            <DiseaseTable data={diseases} title="Disease Summary Table" />
          </div>
        )}

        {/* District Analysis Tab */}
        {activeTab === 'district-analysis' && (
          <div className="space-y-8">
            <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 font-poppins mb-2">
                District Health Analysis
              </h2>
              <p className="text-gray-700">
                Health metrics and risk assessment for all 7 districts in Satun Province
              </p>
            </div>
            <DistrictTable data={districts} title="District Health Status" />
          </div>
        )}

        {/* Disease × District Matrix Tab */}
        {activeTab === 'disease-matrix' && (
          <div className="space-y-8">
            <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 font-poppins mb-2">
                Disease × District Matrix
              </h2>
              <p className="text-gray-700">
                Heat map showing DALY impact of each disease across all districts
              </p>
            </div>
            {disease_district_matrix && disease_district_matrix.length > 0 && (
              <DiseaseDistrictMatrix data={disease_district_matrix} />
            )}
          </div>
        )}

        {/* Specific Diseases Tab */}
        {activeTab === 'specific-diseases' && (
          <div className="space-y-8">
            <div className="bg-pink-50 border-2 border-pink-200 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 font-poppins mb-2">
                Specific Diseases (ICD-10 Codes)
              </h2>
              <p className="text-gray-700">
                Detailed analysis of 100 specific diseases with ICD-10 classification
              </p>
            </div>
            {specific_diseases && specific_diseases.length > 0 && (
              <SpecificDiseasesTable data={specific_diseases} />
            )}
          </div>
        )}

        {/* MOPH Groups Tab */}
        {activeTab === 'moph-groups' && (
          <div className="space-y-8">
            <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 font-poppins mb-2">
                MOPH Disease Groups
              </h2>
              <p className="text-gray-700">
                Disease classification according to Ministry of Public Health standards and ICD-10 chapters
              </p>
            </div>
            {moph_groups && moph_groups.length > 0 && (
              <MOPHGroupsTable data={moph_groups} />
            )}
          </div>
        )}

        {/* Footer */}
        <section className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mt-12 mb-8">
          <h3 className="text-lg font-bold text-gray-800 font-poppins mb-3">
            About This Dashboard
          </h3>
          <p className="text-sm text-gray-700 mb-3">
            This comprehensive health dashboard presents data for Satun Province covering multiple dimensions of health status including mortality, disability, life expectancy, and disease burden. The dashboard integrates data from multiple sources and provides trend analysis for strategic health planning.
          </p>
          <p className="text-xs text-gray-600">
            <strong>Data Source:</strong> Satun Province Health Department | <strong>Years Covered:</strong> 2562-2568 | <strong>Last Updated:</strong> 2025
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
