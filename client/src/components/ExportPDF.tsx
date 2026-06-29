import { FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import html2pdf from 'html2pdf.js';

interface ExportPDFProps {
  elementId: string;
  fileName: string;
  title?: string;
}

export function ExportPDF({ elementId, fileName, title }: ExportPDFProps) {
  const handleExport = () => {
    const element = document.getElementById(elementId);
    if (!element) {
      alert('Content not found for export');
      return;
    }

    const options = {
      margin: 10,
      filename: `${fileName}_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait' as const, unit: 'mm', format: 'a4' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    };

    html2pdf().set(options).from(element).save();
  };

  return (
    <Button
      onClick={handleExport}
      variant="outline"
      size="sm"
      className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
      title={title || 'Export to PDF'}
    >
      <FileDown className="w-4 h-4" />
      <span className="hidden sm:inline">Export PDF</span>
      <span className="sm:hidden">PDF</span>
    </Button>
  );
}
