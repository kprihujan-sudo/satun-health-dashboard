import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export type MenuTab = 
  | 'overview' 
  | 'le-hale-trend' 
  | 'le-hale-gap'
  | 'disease-summary' 
  | 'disease-details'
  | 'disease-groups'
  | 'average-age'
  | 'mortality-trends'
  | 'district-analysis' 
  | 'district-comparison'
  | 'disease-matrix' 
  | 'specific-diseases' 
  | 'moph-groups';

interface NavigationProps {
  activeTab: MenuTab;
  onTabChange: (tab: MenuTab) => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'overview', label: 'Overview', thaiLabel: 'ภาพรวม', icon: '📊' },
    { id: 'le-hale-gap', label: 'LE-HALE Gap Analysis', thaiLabel: 'วิเคราะห์ช่องว่างระหว่าง LE และ HALE', icon: '❤️' },
    { id: 'le-hale-trend', label: 'LE/HALE Trend (7 Years)', thaiLabel: 'แนวโน้ม LE/HALE (7 ปี)', icon: '📈' },
    { id: 'disease-summary', label: 'Disease Summary', thaiLabel: 'สรุปโรค', icon: '🏥' },
    { id: 'disease-details', label: 'Disease Details', thaiLabel: 'รายละเอียดโรค', icon: '🔍' },
    { id: 'disease-groups', label: 'Disease Group Analysis', thaiLabel: 'วิเคราะห์กลุ่มโรค', icon: '📊' },
    { id: 'average-age', label: 'Average Age at Death', thaiLabel: 'อายุเฉลี่ยที่เสียชีวิต', icon: '👥' },
    { id: 'mortality-trends', label: 'Mortality Trends', thaiLabel: 'แนวโน้มการตาย', icon: '📉' },
    { id: 'district-analysis', label: 'District Analysis', thaiLabel: 'วิเคราะห์อำเภอ', icon: '🗺️' },
    { id: 'district-comparison', label: 'District Comparison', thaiLabel: 'เปรียบเทียบอำเภอ', icon: '⚖️' },
    { id: 'disease-matrix', label: 'Disease × District Matrix', thaiLabel: 'เมทริกซ์โรค × อำเภอ', icon: '🔗' },
    { id: 'specific-diseases', label: 'Specific Diseases', thaiLabel: 'โรคเฉพาะ', icon: '🔬' },
    { id: 'moph-groups', label: 'MOPH Disease Groups', thaiLabel: 'กลุ่มโรคสสส.', icon: '📋' },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-900 to-blue-800 text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div>
              <span className="text-2xl font-bold font-poppins block">📊 Burden of Disease and Population Health Status Dashboard</span>
              <span className="text-sm text-teal-200 font-poppins">แดชบอร์ดวิเคราะห์ภาระโรคและสถานะสุขภาพประชากร</span>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-wrap justify-end">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id as MenuTab)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all group relative ${
                  activeTab === item.id
                    ? 'bg-teal-500 text-white shadow-lg'
                    : 'bg-blue-700 hover:bg-blue-600 text-blue-100'
                }`}
                title={item.thaiLabel}
              >
                <span className="mr-1">{item.icon}</span>
                <span className="hidden lg:inline">{item.label}</span>
                <span className="lg:hidden text-xs">{item.icon}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden py-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 w-full bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded-lg font-medium"
          >
            <span className="text-xl">{menuItems.find(m => m.id === activeTab)?.icon}</span>
            <span>{menuItems.find(m => m.id === activeTab)?.label}</span>
            <ChevronDown className={`ml-auto transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <div className="mt-2 space-y-2 bg-blue-800 p-3 rounded-lg">
              {menuItems.map((item) => (
                  <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id as MenuTab);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === item.id
                      ? 'bg-teal-500 text-white'
                      : 'bg-blue-700 hover:bg-blue-600 text-blue-100'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  <div>
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs opacity-80">{item.thaiLabel}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
