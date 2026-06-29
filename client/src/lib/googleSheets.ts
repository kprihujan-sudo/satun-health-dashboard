/**
 * Google Sheets CSV Fetcher
 * ดึงข้อมูลจาก Google Sheets ผ่าน public CSV export URL
 * รองรับการฝังใน Power BI (ไม่ต้อง authentication)
 */

const SHEET_ID = '1Q78VfsfGE03g3TJ6zA3Ph18hzWXU5s-c1WNihwFeTfQ';

/** สร้าง URL สำหรับดึงข้อมูล CSV จาก sheet ที่ระบุ */
export function getSheetCsvUrl(sheetName: string): string {
  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
}

/** แปลง CSV string เป็น array of objects */
export function parseCsv(csv: string): Record<string, string>[] {
  const lines = csv.trim().split('\n');
  if (lines.length < 2) return [];

  // แปลง CSV line เป็น array ของ fields (รองรับ quoted fields)
  const parseRow = (line: string): string[] => {
    const fields: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === ',' && !inQuotes) {
        fields.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    fields.push(current.trim());
    return fields;
  };

  const headers = parseRow(lines[0]);
  const result: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = parseRow(line);
    const obj: Record<string, string> = {};
    headers.forEach((h, idx) => {
      if (h) obj[h] = values[idx] ?? '';
    });
    // ข้ามแถวที่ว่างทั้งหมด
    if (Object.values(obj).every(v => !v)) continue;
    result.push(obj);
  }

  return result;
}

/** แปลง string ตัวเลขที่มีเครื่องหมาย comma เป็น number */
export function parseNum(val: string | undefined): number {
  if (!val) return 0;
  const cleaned = val.replace(/,/g, '').replace(/%/g, '').trim();
  const n = parseFloat(cleaned);
  return isNaN(n) ? 0 : n;
}

/** ดึงข้อมูล CSV จาก Google Sheet แล้วแปลงเป็น array of objects */
export async function fetchSheet(sheetName: string): Promise<Record<string, string>[]> {
  const url = getSheetCsvUrl(sheetName);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch sheet "${sheetName}": ${res.status}`);
  const text = await res.text();
  return parseCsv(text);
}

/** ดึงข้อมูลทุก sheet พร้อมกัน */
export async function fetchAllSheets() {
  const [
    diseaseGroup,
    district,
    leHale,
    specificDisease,
    matrix,
    integrated,
  ] = await Promise.all([
    fetchSheet('Summary_Disease_Group'),
    fetchSheet('Summary_District'),
    fetchSheet('LE_HALE_Source'),
    fetchSheet('Summary_Specific_Disease'),
    fetchSheet('Matrix_Disease_District'),
    fetchSheet('Integrated_Health_Summary'),
  ]);

  return { diseaseGroup, district, leHale, specificDisease, matrix, integrated };
}
