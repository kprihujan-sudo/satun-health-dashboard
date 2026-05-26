import { useState } from 'react';
import { ChevronDown, FolderOpen } from 'lucide-react';
import { Link } from 'wouter';

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
  | 'specific-diseases';

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

  ];

  return (
    <nav className="bg-gradient-to-r from-blue-900 to-blue-800 text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div>
              <span className="text-2xl font-bold font-poppins block">📊 Burden of Disease and Population Health Status Dashboard - Satun</span>
              <span className="text-sm text-teal-200 font-poppins">แดชบอร์ดวิเคราะห์ภาระโรคและสถานะสุขภาพประชากร จังหวัดสตูล</span>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-wrap justify-end">
            <Link
              href="/files"
              className="px-3 py-2 rounded-lg text-sm font-medium transition-all bg-teal-700 hover:bg-teal-600 text-white flex items-center gap-1"
              title="จัดการไฟล์"
            >
              <FolderOpen size={14} />
              <span className="hidden lg:inline">Files</span>
            </Link>
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
        <div className="md:hidden">
          <div className="flex items-center justify-between py-2 mb-2">
            <span className="text-sm font-bold font-poppins truncate">📊 Satun Health Dashboard</span>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="ml-2 p-2 bg-blue-700 hover:bg-blue-600 rounded-lg"
            >
              <ChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} size={20} />
            </button>
          </div>

          {isOpen && (
            <div className="grid grid-cols-2 gap-2 bg-blue-800 p-2 rounded-lg max-h-96 overflow-y-auto">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id as MenuTab);
                    setIsOpen(false);
                  }}
                  className={`px-2 py-2 rounded text-xs font-medium transition-all text-center ${
                    activeTab === item.id
                      ? 'bg-teal-500 text-white'
                      : 'bg-blue-700 hover:bg-blue-600 text-blue-100'
                  }`}
                  title={item.thaiLabel}
                >
                  <div className="text-lg mb-1">{item.icon}</div>
                  <div className="line-clamp-2">{item.label}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
