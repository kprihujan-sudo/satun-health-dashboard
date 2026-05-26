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
