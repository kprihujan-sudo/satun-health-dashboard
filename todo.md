# Satun Health Dashboard - TODO

## Full-Stack Migration & File Storage Feature

- [x] ตรวจสอบโครงสร้างโปรเจกต์ปัจจุบัน
- [x] เพิ่มตาราง `uploaded_files` ใน drizzle/schema.ts
- [x] push migration ด้วย pnpm db:push
- [x] เพิ่ม query helpers ใน server/db.ts สำหรับ file operations
- [x] สร้าง tRPC router `files` ใน server/routers/files.ts (list, get, update, delete)
- [x] สร้าง upload endpoint POST /api/files/upload ใน server/_core/index.ts (multipart/form-data)
- [x] ติดตั้ง multer สำหรับ multipart handling
- [x] แก้ไข Home.tsx ให้ถูกต้องหลัง template upgrade
- [x] สร้างหน้า FileManager.tsx สำหรับ upload/list/edit/delete ไฟล์
- [x] อัปเดต App.tsx เพิ่ม route /files
- [x] เพิ่มลิงก์ Files ใน Navigation.tsx
- [x] เขียน vitest tests สำหรับ files router (server/files.test.ts) - 10 tests ผ่านทั้งหมด
- [x] ตรวจสอบสถานะและ save checkpoint

## Google Sheets Integration & Static/iframe Mode

- [x] เปลี่ยนแหล่งข้อมูลจาก local JSON มาเป็น Google Sheets CSV
- [x] สร้าง googleSheets.ts utility สำหรับดึงข้อมูล CSV จาก Google Sheets
- [x] เขียน useHealthData.ts ใหม่ให้คำนวณค่า overview จาก LE_HALE_Source + Summary_Disease_Group
- [x] แก้ไขค่า LE/HALE/Gap ให้ถูกต้อง (LE=80.03, HALE=73.07, Gap=6.96)
- [x] แก้ไขค่า Deaths/DALY/YLL/YLD ให้ถูกต้องโดยรวมจาก Summary_Disease_Group
- [x] เพิ่ม X-Frame-Options: ALLOWALL และ Content-Security-Policy: frame-ancestors * สำหรับ iframe/Power BI
- [x] ลบลิงก์ Files ออกจาก Navigation (ไม่จำเป็นสำหรับ public dashboard)
- [x] ลบ health-data.json local file
- [x] ตรวจสอบ TypeScript: ไม่มี errors
