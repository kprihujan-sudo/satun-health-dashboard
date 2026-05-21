import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface YearSelectorProps {
  selectedYear1: number;
  selectedYear2: number;
  onYear1Change: (year: number) => void;
  onYear2Change: (year: number) => void;
  availableYears: number[];
}

export function YearSelector({
  selectedYear1,
  selectedYear2,
  onYear1Change,
  onYear2Change,
  availableYears,
}: YearSelectorProps) {
  return (
    <Card className="p-4 mb-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Select Years to Compare</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Year 1</label>
          <div className="flex flex-wrap gap-2">
            {availableYears.map((year) => (
              <Button
                key={year}
                onClick={() => onYear1Change(year)}
                variant={selectedYear1 === year ? 'default' : 'outline'}
                size="sm"
              >
                {year}
              </Button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Year 2</label>
          <div className="flex flex-wrap gap-2">
            {availableYears.map((year) => (
              <Button
                key={year}
                onClick={() => onYear2Change(year)}
                variant={selectedYear2 === year ? 'default' : 'outline'}
                size="sm"
              >
                {year}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
