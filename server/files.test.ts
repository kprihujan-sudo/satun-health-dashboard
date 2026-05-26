/**
 * Tests for file storage procedures
 * Tests cover: list, update, delete, and get operations with ownership checks
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { TRPCError } from "@trpc/server";

// Mock the db module
vi.mock("./db", () => ({
  getFilesByUser: vi.fn(),
  getFileById: vi.fn(),
  deleteFileById: vi.fn(),
  updateFileMetadata: vi.fn(),
}));

import * as db from "./db";
import { filesRouter } from "./routers/files";
// Use tRPC v11 router.createCaller pattern
const createCaller = filesRouter.createCaller;

const mockUser = {
  id: 1,
  openId: "test-open-id",
  name: "Test User",
  email: "test@example.com",
  loginMethod: "email",
  role: "user" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

const mockFile = {
  id: 10,
  userId: 1,
  filename: "test.pdf",
  mimeType: "application/pdf",
  fileSize: 1024,
  storageKey: "uploads/1/test_abc123.pdf",
  storageUrl: "/manus-storage/uploads/1/test_abc123.pdf",
  description: "Test file",
  category: "report",
  createdAt: new Date(),
  updatedAt: new Date(),
};

function createAuthContext() {
  return {
    user: mockUser,
    req: {} as any,
    res: {} as any,
  };
}

describe("files.list", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns files for authenticated user", async () => {
    vi.mocked(db.getFilesByUser).mockResolvedValue([mockFile]);
    const caller = createCaller(createAuthContext());
    const result = await caller.list();
    expect(result).toHaveLength(1);
    expect(result[0].filename).toBe("test.pdf");
    expect(db.getFilesByUser).toHaveBeenCalledWith(1);
  });

  it("returns empty array when user has no files", async () => {
    vi.mocked(db.getFilesByUser).mockResolvedValue([]);
    const caller = createCaller(createAuthContext());
    const result = await caller.list();
    expect(result).toHaveLength(0);
  });
});

describe("files.get", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns file for owner", async () => {
    vi.mocked(db.getFileById).mockResolvedValue(mockFile);
    const caller = createCaller(createAuthContext());
    const result = await caller.get({ id: 10 });
    expect(result.filename).toBe("test.pdf");
  });

  it("throws NOT_FOUND when file does not exist", async () => {
    vi.mocked(db.getFileById).mockResolvedValue(undefined);
    const caller = createCaller(createAuthContext());
    await expect(caller.get({ id: 999 })).rejects.toThrow(TRPCError);
  });

  it("throws FORBIDDEN when file belongs to another user", async () => {
    vi.mocked(db.getFileById).mockResolvedValue({ ...mockFile, userId: 99 });
    const caller = createCaller(createAuthContext());
    await expect(caller.get({ id: 10 })).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
  });
});

describe("files.update", () => {
  beforeEach(() => vi.clearAllMocks());

  it("updates file metadata for owner", async () => {
    vi.mocked(db.getFileById).mockResolvedValue(mockFile);
    vi.mocked(db.updateFileMetadata).mockResolvedValue(undefined);
    const caller = createCaller(createAuthContext());
    const result = await caller.update({ id: 10, description: "Updated", category: "data" });
    expect(result.success).toBe(true);
    expect(db.updateFileMetadata).toHaveBeenCalledWith(10, {
      description: "Updated",
      category: "data",
    });
  });

  it("throws FORBIDDEN when updating another user's file", async () => {
    vi.mocked(db.getFileById).mockResolvedValue({ ...mockFile, userId: 99 });
    const caller = createCaller(createAuthContext());
    await expect(
      caller.update({ id: 10, description: "Hack" })
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});

describe("files.delete", () => {
  beforeEach(() => vi.clearAllMocks());

  it("deletes file for owner", async () => {
    vi.mocked(db.getFileById).mockResolvedValue(mockFile);
    vi.mocked(db.deleteFileById).mockResolvedValue(undefined);
    const caller = createCaller(createAuthContext());
    const result = await caller.delete({ id: 10 });
    expect(result.success).toBe(true);
    expect(db.deleteFileById).toHaveBeenCalledWith(10);
  });

  it("throws NOT_FOUND when file does not exist", async () => {
    vi.mocked(db.getFileById).mockResolvedValue(undefined);
    const caller = createCaller(createAuthContext());
    await expect(caller.delete({ id: 999 })).rejects.toThrow(TRPCError);
  });

  it("throws FORBIDDEN when deleting another user's file", async () => {
    vi.mocked(db.getFileById).mockResolvedValue({ ...mockFile, userId: 99 });
    const caller = createCaller(createAuthContext());
    await expect(caller.delete({ id: 10 })).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
  });
});
