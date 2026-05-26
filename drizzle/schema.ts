import { bigint, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Table for storing uploaded file metadata.
 * Actual file bytes are stored in S3; this table tracks references.
 */
export const uploadedFiles = mysqlTable("uploaded_files", {
  id: int("id").autoincrement().primaryKey(),
  /** Foreign key referencing the user who uploaded the file */
  userId: int("userId").notNull(),
  /** Original filename as provided by the user */
  filename: varchar("filename", { length: 255 }).notNull(),
  /** MIME type of the file */
  mimeType: varchar("mimeType", { length: 128 }).notNull(),
  /** File size in bytes */
  fileSize: bigint("fileSize", { mode: "number" }).notNull(),
  /** S3 storage key for retrieving the file */
  storageKey: varchar("storageKey", { length: 512 }).notNull(),
  /** Accessible URL path via /manus-storage/{key} */
  storageUrl: varchar("storageUrl", { length: 512 }).notNull(),
  /** Optional description or note about the file */
  description: text("description"),
  /** Category tag for organizing files (e.g., "report", "data", "image") */
  category: varchar("category", { length: 64 }).default("general").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UploadedFile = typeof uploadedFiles.$inferSelect;
export type InsertUploadedFile = typeof uploadedFiles.$inferInsert;