import { Card } from '@/components/ui/card';

interface DistrictMapData {
  name: string;
  dalyRate: number;
  deathRate: number;
  population: number;
}

interface DistrictMapProps {
  districts: DistrictMapData[];
  title?: string;
}

export function DistrictMap({ districts, title = 'District Health Status Map' }: DistrictMapProps) {
  // Find min/max for color scale
  const dalyRates = districts.map(d => d.dalyRate);
  const minDALY = Math.min(...dalyRates);
  const maxDALY = Math.max(...dalyRates);

  const getColor = (dalyRate: number) => {
    const normalized = (dalyRate - minDALY) / (maxDALY - minDALY);
    if (normalized < 0.2) return 'bg-green-500 text-white';
    if (normalized < 0.4) return 'bg-yellow-400 text-gray-800';
    if (normalized < 0.6) return 'bg-orange-500 text-white';
    if (normalized < 0.8) return 'bg-red-500 text-white';
    return 'bg-red-700 text-white';
  };

  const getRiskLevel = (dalyRate: number) => {
    const normalized = (dalyRate - minDALY) / (maxDALY - minDALY);
    if (normalized < 0.2) return 'ปกติ';
    if (normalized < 0.4) return 'เตือน';
    if (normalized < 0.6) return 'ระวัง';
    if (normalized < 0.8) return 'อันตราย';
    return 'วิกฤต';
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-gray-800 font-poppins mb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {districts.map((district) => (
          <div
            key={district.name}
            className={`p-4 rounded-lg border-2 transition-all hover:shadow-lg ${getColor(district.dalyRate)}`}
          >
            <h4 className="font-bold text-sm mb-2">{district.name}</h4>
            <div className="space-y-1 text-xs">
              <div>DALY Rate: {district.dalyRate !== undefined ? district.dalyRate.toLocaleString() : 'N/A'} per 100k</div>
              <div>Death Rate: {district.deathRate !== undefined ? district.deathRate.toLocaleString() : 'N/A'} per 100k</div>
              <div>Population: {district.population !== undefined ? district.population.toLocaleString() : 'N/A'}</div>
              <div className="font-semibold mt-2">
                Risk Level: <span className="font-bold">{district.dalyRate !== undefined ? getRiskLevel(district.dalyRate) : 'N/A'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-xs text-gray-600">
        <p className="font-semibold mb-2">Risk Level Scale:</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500"></div>
            <span>ปกติ</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400"></div>
            <span>เตือน</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500"></div>
            <span>ระวัง</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500"></div>
            <span>อันตราย</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-700"></div>
            <span>วิกฤต</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
