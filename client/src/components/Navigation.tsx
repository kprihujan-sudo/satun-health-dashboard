import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export type MenuTab = 
  | 'overview' 
  | 'le-hale-trend' 
  | 'disease-summary' 
  | 'district-analysis' 
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
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'le-hale-trend', label: 'LE/HALE Trend (7 Years)', icon: '📈' },
    { id: 'disease-summary', label: 'Disease Summary', icon: '🏥' },
    { id: 'district-analysis', label: 'District Analysis', icon: '🗺️' },
    { id: 'disease-matrix', label: 'Disease × District Matrix', icon: '🔗' },
    { id: 'specific-diseases', label: 'Specific Diseases', icon: '🔬' },
    { id: 'moph-groups', label: 'MOPH Disease Groups', icon: '📋' },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-900 to-blue-800 text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold font-poppins">📊 Satun Health Dashboard</span>
          </div>
          <div className="flex items-center gap-1 flex-wrap justify-end">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id as MenuTab)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === item.id
                    ? 'bg-teal-500 text-white shadow-lg'
                    : 'bg-blue-700 hover:bg-blue-600 text-blue-100'
                }`}
              >
                <span className="mr-1">{item.icon}</span>
                {item.label}
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
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
