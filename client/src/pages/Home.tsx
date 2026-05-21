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
import { DiseaseDetailsChart } from '@/components/DiseaseDetailsChart';
import { DiseaseGroupAnalysis } from '@/components/DiseaseGroupAnalysis';
import { AverageAgeChart } from '@/components/AverageAgeChart';
import { MortalityTrends } from '@/components/MortalityTrends';
import { DistrictComparison } from '@/components/DistrictComparison';
import { LEHALEGapVisualization } from '@/components/LEHALEGapVisualization';
import { ExportPDF } from '@/components/ExportPDF';
import { SummaryStatistics } from '@/components/SummaryStatistics';
import { AlertBanner } from '@/components/AlertBanner';

import { AnalysisDescription } from '@/components/AnalysisDescription';

import { thaiLabels } from '@/data/thai-labels';
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

            {/* Alert Banner */}
            <AlertBanner alerts={[
              {
                level: 'critical',
                title: '⚠️ ระดับความเสี่ยงวิกฤต',
                message: 'อำเภอเมืองสตูล ละงู และทุ่งหว้า มีอัตรา DALY สูงกว่า 13,300 ต่อ 100,000 คน',
                detail: 'ต้องมีการเพิ่มโปรแกรมสุขภาพเฉพาะเจาะจงเพื่อลดภาระโรค'
              },
              {
                level: 'warning',
                title: '📊 ข้อมูลที่ต้องสนใจ',
                message: 'มะเร็งเป็นโรคที่มีภาระโรค (DALY) สูงสุด คิดเป็น 17.21% ของภาระโรคทั้งหมด',
                detail: 'ควรให้ความสำคัญกับการป้องกันและรักษามะเร็ง'
              }
            ]} />

            {/* Analysis Description */}
            <AnalysisDescription
              title="ภาพรวมสถานะสุขภาพจังหวัดสตูล"
              description={thaiLabels.overview}
              keyPoints={[
                `จำนวนผู้เสียชีวิต: ${overview.deaths.toLocaleString()} คน`,
                `ภาระโรค (DALY): ${overview.daly_total.toLocaleString()} ปี`,
                `อายุคาดเฉลี่ย (LE - Life Expectancy): ${overview.le} ปี`,
                `อายุคาดเฉลี่ยที่มีสุขภาพดี (HALE - Healthy Life Expectancy): ${overview.hale} ปี`,
                `ช่องว่าง LE-HALE: ${(overview.le - overview.hale).toFixed(2)} ปี (ปีที่มีความพิการ)`
              ]}
              interpretation="จังหวัดสตูลมีภาระโรคที่สูง โดยเฉพาะในอำเภอเมืองสตูล ละงู และทุ่งหว้า ที่มีอัตรา DALY สูงกว่า 13,000 ต่อ 100,000 คน ซึ่งแสดงว่าประชากรมีปัญหาสุขภาพที่จำเป็นต้องได้รับการดูแลอย่างเร่งด่วน"
            />

            {/* Summary Statistics */}
            <SummaryStatistics
              title="สรุปสถิติสำคัญ"
              description="ข้อมูลหลักของสุขภาพประชากรจังหวัดสตูล"
              stats={[
                { label: 'ผู้เสียชีวิต', value: overview.deaths, unit: 'คน' },
                { label: 'DALY (ภาระโรค)', value: Math.round(overview.daly_total), unit: 'ปี' },
                { label: 'YLL (ปีชีวิตสูญเสีย)', value: Math.round(overview.yll_total), unit: 'ปี' },
                { label: 'YLD (ปีพิการ)', value: Math.round(overview.yld_total), unit: 'ปี' }
              ]}
            />

            {/* Analysis Summary */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-lg border-2 border-blue-200">
              <h3 className="text-lg font-bold text-gray-800 font-poppins mb-4">📊 สรุปวิเคราะห์ภาพรวม</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <p><strong>ภาระโรคสูงสุด:</strong> อำเภอเมืองสตูล (13,762.6 ต่อ 100,000 คน) และ ละงู (13,561.8 ต่อ 100,000 คน)</p>
                <p><strong>โรคที่สำคัญที่สุด:</strong> มะเร็ง (17.21% ของ DALY) และ โรคไม่ทราบสาเหตุ (18.64% ของ DALY)</p>
                <p><strong>ข้อเสนอแนะ:</strong> ควรเพิ่มโปรแกรมป้องกันมะเร็ง ลดอุบัติเหตุ และตรวจสอบสาเหตุการตายที่ไม่ชัดเจน</p>
              </div>
            </div>

            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 font-poppins">
                  🏥 Disease Analysis (การวิเคราะห์โรค)
                </h2>
                <ExportPDF elementId="disease-analysis-section" fileName="Disease_Analysis" title="Export Disease Analysis" />
              </div>
              
              {/* Analysis Description */}
              <AnalysisDescription
                title="การวิเคราะห์โรคที่ส่งผลกระทบต่อประชากร"
                description={thaiLabels.diseaseAnalysis.description}
                keyPoints={thaiLabels.diseaseAnalysis.keyPoints}
                interpretation={thaiLabels.diseaseAnalysis.interpretation}
              />

              <div id="disease-analysis-section" className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
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
                        <strong>Life Expectancy:</strong> LE {overview.le} years, HALE {overview.hale} years
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              <DiseaseTable data={diseases} />
            </section>

            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 font-poppins">
                  🗺️ District Health Status (สถานะสุขภาพของแต่ละอำเภอ)
                </h2>
                <ExportPDF elementId="district-section" fileName="District_Health_Status" title="Export District Data" />
              </div>

              {/* Analysis Description */}
              <AnalysisDescription
                title="สถานะสุขภาพของแต่ละอำเภอ"
                description={thaiLabels.districtHealth.description}
                keyPoints={thaiLabels.districtHealth.keyPoints}
                interpretation={thaiLabels.districtHealth.interpretation}
              />

              <div id="district-section" className="mt-6">
                <DistrictTable data={districts} />
              </div>
            </section>

            {/* District Analysis Summary */}
            <section className="mt-8 bg-gradient-to-br from-teal-50 to-green-50 p-6 rounded-lg border-2 border-teal-200">
              <h3 className="text-lg font-bold text-gray-800 font-poppins mb-4">📊 สรุปวิเคราะห์สถานะสุขภาพอำเภอ</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <p><strong>อำเภอที่มีความเสี่ยงสูงสุด:</strong> เมืองสตูล ละงู ทุ่งหว้า ควนโดน ควนกาหลง (DALY rate {'>'} 13,300)</p>
                <p><strong>อำเภอที่มีความเสี่ยงต่ำสุด:</strong> ท่าแพ (DALY rate = 11,754.9)</p>
                <p><strong>ข้อเสนอแนะ:</strong> ต้องมีการเพิ่มโปรแกรมสุขภาพเฉพาะเจาะจงในอำเภอที่มีความเสี่ยงสูง โดยเฉพาะการป้องกันมะเร็ง ลดอุบัติเหตุ และการดูแลผู้สูงอายุ</p>
              </div>
            </section>

            {/* About This Dashboard */}
            <section className="mt-12 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-lg border-2 border-blue-200">
              <h2 className="text-2xl font-bold text-gray-800 font-poppins mb-4">📊 About This Dashboard</h2>
              <p className="text-gray-700 mb-3">
                This comprehensive health dashboard presents data for Satun Province covering multiple dimensions of health status including mortality, disability, life expectancy, and disease burden. The dashboard integrates data from multiple sources and provides trend analysis for strategic health planning.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">📋 Data Information:</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li><strong>Data Source:</strong> Satun Province Health Department</li>
                    <li><strong>Years Covered:</strong> 2562-2568</li>
                    <li><strong>Last Updated:</strong> 2025</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">📊 Developed by:</h3>
                  <p className="text-sm text-gray-700">
                    <strong>KASEM PRIHUJAN</strong><br />
                    Digital Health Sub-division<br />
                    Satun Provincial Health Office (สสจ.สตูล)
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* LE-HALE Gap Analysis Tab */}
        {activeTab === 'le-hale-gap' && (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800 font-poppins">
              ❤️ LE-HALE Gap Analysis (วิเคราะห์ช่องว่าง LE-HALE)
            </h1>
            
            <AnalysisDescription
              title={thaiLabels.leHaleGapAnalysis.title}
              description={thaiLabels.leHaleGapAnalysis.description}
              keyPoints={thaiLabels.leHaleGapAnalysis.keyPoints}
              interpretation={thaiLabels.leHaleGapAnalysis.interpretation}
            />

            {le_hale_trend && <LEHALEGapVisualization leHaleTrend={le_hale_trend} />}
          </div>
        )}

        {/* LE/HALE Trend Tab */}
        {activeTab === 'le-hale-trend' && (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800 font-poppins">
              📈 LE/HALE Trend (7 Years) (แนวโน้ม LE/HALE 7 ปี)
            </h1>
            <AnalysisDescription
              title="แนวโน้มการเปลี่ยนแปลง LE และ HALE"
              description={thaiLabels.leHaleTrend}
              keyPoints={[
                'LE (Life Expectancy) = อายุคาดเฉลี่ย',
                'HALE (Healthy Life Expectancy) = อายุคาดเฉลี่ยที่มีสุขภาพดี',
                'ข้อมูลแยกตามเพศชาย-หญิง'
              ]}
            />
            <LEHALETrendChart data={le_hale_trend} />
          </div>
        )}

        {/* Disease Summary Tab */}
        {activeTab === 'disease-summary' && (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800 font-poppins">
              🏥 Disease Summary (สรุปโรค)
            </h1>
            <AnalysisDescription
              title="สรุปข้อมูลโรค 14 ชนิดที่สำคัญ"
              description={thaiLabels.diseaseSummary}
              keyPoints={[
                'Deaths = จำนวนผู้เสียชีวิต',
                'YLL (Years of Life Lost) = ปีชีวิตที่สูญเสียจากการตาย',
                'YLD (Years Lived with Disability) = ปีชีวิตที่มีความพิการ',
                'DALY (Disability-Adjusted Life Years) = ปีชีวิตที่สูญเสีย = YLL + YLD'
              ]}
            />
            <DiseaseTable data={diseases} />
          </div>
        )}

        {/* Disease Details Tab */}
        {activeTab === 'disease-details' && (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800 font-poppins">
              🔍 Disease Details (รายละเอียดโรค)
            </h1>
            <AnalysisDescription
              title={thaiLabels.diseaseDetails}
              description="ข้อมูลรายละเอียดของแต่ละโรค พร้อมสถิติการตาย ปีชีวิตที่สูญเสีย และสัดส่วนของภาระโรค"
              keyPoints={[
                'Share_DALY_% = สัดส่วนของภาระโรคทั้งหมด',
                'โรคที่มี Share_DALY_% สูง = โรคที่ส่งผลกระทบต่อสุขภาพมากที่สุด'
              ]}
            />
            {diseases && <DiseaseDetailsChart data={diseases} />}
          </div>
        )}

        {/* Disease Group Analysis Tab */}
        {activeTab === 'disease-groups' && (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800 font-poppins">
              📊 Disease Group Analysis (วิเคราะห์กลุ่มโรค)
            </h1>
            <AnalysisDescription
              title={thaiLabels.diseaseGroupAnalysis}
              description="วิเคราะห์กลุ่มโรคตามการจำแนกประเภท เช่น โรคติดเชื้อ โรคไม่ติดเชื้อ และอุบัติเหตุ"
              keyPoints={[
                'โรคติดเชื้อ = โรคที่เกิดจากเชื้อโรค',
                'โรคไม่ติดเชื้อ = โรคเรื้อรัง เช่น มะเร็ง ความดันโลหิตสูง',
                'อุบัติเหตุ = การบาดเจ็บจากการตกลง การชน เป็นต้น'
              ]}
            />
            {diseases && <DiseaseGroupAnalysis diseases={diseases} />}
          </div>
        )}

        {/* Average Age at Death Tab */}
        {activeTab === 'average-age' && (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800 font-poppins">
              👥 Average Age at Death (อายุเฉลี่ยที่เสียชีวิต)
            </h1>
            <AnalysisDescription
              title={thaiLabels.averageAge}
              description="อายุเฉลี่ยที่เสียชีวิตจำแนกตามโรค แสดงว่าโรคใดที่ทำให้ผู้คนเสียชีวิตในวัยต่างๆ"
              keyPoints={[
                'โรคที่มีอายุเฉลี่ยต่ำ = ทำให้ผู้คนเสียชีวิตในวัยหนุ่มสาว',
                'โรคที่มีอายุเฉลี่ยสูง = ทำให้ผู้คนเสียชีวิตในวัยสูงอายุ',
                'ควรให้ความสำคัญกับโรคที่ทำให้ผู้คนเสียชีวิตในวัยหนุ่มสาว'
              ]}
            />
            {specific_diseases && <AverageAgeChart diseases={specific_diseases} />}
          </div>
        )}

        {/* Mortality Trends Tab */}
        {activeTab === 'mortality-trends' && (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800 font-poppins">
              📉 Mortality Trends (แนวโน้มการตาย)
            </h1>
            <AnalysisDescription
              title={thaiLabels.mortalityTrends}
              description="แนวโน้มการตายตามเวลา แสดงการเปลี่ยนแปลงของจำนวนผู้เสียชีวิตในแต่ละช่วงเวลา"
              keyPoints={[
                'ข้อมูลแสดงการเปลี่ยนแปลงของจำนวนผู้เสียชีวิตตามปี',
                'ช่วยในการวางแผนสุขภาพและการจัดสรรทรัพยากร',
                'ใช้ในการประเมินผลของโปรแกรมสุขภาพ'
              ]}
            />
            {le_hale_trend && <MortalityTrends leHaleTrend={le_hale_trend} />}
          </div>
        )}

        {/* District Analysis Tab */}
        {activeTab === 'district-analysis' && (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800 font-poppins">
              🗺️ District Analysis (วิเคราะห์อำเภอ)
            </h1>
            <AnalysisDescription
              title={thaiLabels.districtAnalysis}
              description="วิเคราะห์สถานะสุขภาพของแต่ละอำเภอในจังหวัดสตูล พร้อมระดับความเสี่ยง"
              keyPoints={[
                'Death Rate (อัตราการตาย) = จำนวนผู้เสียชีวิตต่อ 100,000 คน',
                'DALY Rate (อัตรา DALY) = ภาระโรคต่อ 100,000 คน',
                'Risk Level (ระดับความเสี่ยง) = ปกติ เตือน ระวัง อันตราย วิกฤต'
              ]}
            />
            <DistrictTable data={districts} />
          </div>
        )}

        {/* District Comparison Tab */}
        {activeTab === 'district-comparison' && (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800 font-poppins">
              ⚖️ District Comparison (เปรียบเทียบอำเภอ)
            </h1>
            <AnalysisDescription
              title={thaiLabels.districtComparison}
              description="เปรียบเทียบสถิติสุขภาพระหว่างอำเภอต่างๆ ด้วย Scatter chart และ Risk assessment"
              keyPoints={[
                'Scatter chart แสดงความสัมพันธ์ระหว่าง Death Rate และ DALY Rate',
                'อำเภอที่อยู่มุมขวาบน = มีความเสี่ยงสูง',
                'อำเภอที่อยู่มุมซ้ายล่าง = มีความเสี่ยงต่ำ'
              ]}
            />
            {districts && <DistrictComparison districts={districts} />}
          </div>
        )}

        {/* Disease × District Matrix Tab */}
        {activeTab === 'disease-matrix' && (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800 font-poppins">
              🔗 Disease × District Matrix (เมทริกซ์โรค × อำเภอ)
            </h1>
            <AnalysisDescription
              title={thaiLabels.diseaseDistrictMatrix}
              description="แสดงความสัมพันธ์ระหว่างโรคและอำเภอ โดยใช้สีแสดงระดับภาระโรค (DALY)"
              keyPoints={[
                'สีแดง = DALY สูง (ภาระโรคมาก)',
                'สีเหลือง = DALY ปานกลาง',
                'สีเขียว = DALY ต่ำ (ภาระโรคน้อย)',
                'ช่วยในการระบุโรคที่ส่งผลกระทบต่ออำเภอต่างๆ'
              ]}
            />
            {disease_district_matrix && <DiseaseDistrictMatrix data={disease_district_matrix} />}
          </div>
        )}

        {/* Specific Diseases Tab */}
        {activeTab === 'specific-diseases' && (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800 font-poppins">
              🔬 Specific Diseases (โรคเฉพาะ)
            </h1>
            <AnalysisDescription
              title={thaiLabels.specificDiseases}
              description="ข้อมูลโรคเฉพาะ 100 รหัส ICD-10 พร้อมสถิติครบถ้วน สามารถค้นหาและเรียงลำดับได้"
              keyPoints={[
                'ICD-10 = รหัสจำแนกโรคระหว่างประเทศ',
                'สามารถค้นหาโรคตามชื่อ ICD-10 code',
                'สามารถเรียงลำดับตามจำนวนผู้เสียชีวิต DALY เป็นต้น'
              ]}
            />
            {specific_diseases && <SpecificDiseasesTable data={specific_diseases} />}
          </div>
        )}

        {/* MOPH Disease Groups Tab */}
        {activeTab === 'moph-groups' && (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800 font-poppins">
              📋 MOPH Disease Groups (กลุ่มโรคสสส.)
            </h1>
            <AnalysisDescription
              title={thaiLabels.mophGroups}
              description="จำแนกโรคตามมาตรฐานของกระทรวงสาธารณสุข รวมถึง โรคติดเชื้อ โรคไม่ติดเชื้อ และอื่นๆ"
              keyPoints={[
                'โรคติดเชื้อ = โรคที่เกิดจากเชื้อโรค',
                'โรคไม่ติดเชื้อ = โรคเรื้อรัง เช่น มะเร็ง ความดันโลหิตสูง',
                'อุบัติเหตุและการบาดเจ็บ = ผลจากการตกลง การชน เป็นต้น',
                'ข้อมูลอื่นๆ = ข้อมูลที่ไม่สามารถจำแนกได้'
              ]}
            />
            {moph_groups && <MOPHGroupsTable data={moph_groups} />}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-bold mb-2">📊 Dashboard Information</h3>
              <p className="text-sm text-blue-100">Burden of Disease and Population Health Status Dashboard - Satun</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">📋 Data Source</h3>
              <p className="text-sm text-blue-100">Satun Province Health Department</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">👤 Developed by</h3>
              <p className="text-sm text-blue-100">KASEM PRIHUJAN | Digital Health Sub-division, Satun Provincial Health Office</p>
            </div>
          </div>
          <div className="border-t border-blue-700 mt-6 pt-6 text-center text-sm text-blue-100">
            <p>© 2025 Burden of Disease and Population Health Status Dashboard - Satun. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
