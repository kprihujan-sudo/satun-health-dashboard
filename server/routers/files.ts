/**
 * File Storage Router
 * Handles listing, metadata updates, and deletion of uploaded files.
 * Actual file upload is handled via a dedicated multipart POST endpoint
 * in server/_core/index.ts to support streaming large files.
 */
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { deleteFileById, getFileById, getFilesByUser, updateFileMetadata } from "../db";
import { protectedProcedure, router } from "../_core/trpc";

export const filesRouter = router({
  /** List all files belonging to the authenticated user */
  list: protectedProcedure.query(async ({ ctx }) => {
    const files = await getFilesByUser(ctx.user.id);
    return files;
  }),

  /** Update description and/or category of a file */
  update: protectedProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
        description: z.string().max(1000).optional(),
        category: z.string().max(64).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const file = await getFileById(input.id);
      if (!file) {
        throw new TRPCError({ code: "NOT_FOUND", message: "File not found" });
      }
      if (file.userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });
      }
      await updateFileMetadata(input.id, {
        description: input.description,
        category: input.category,
      });
      return { success: true };
    }),

  /** Delete a file record (ownership verified) */
  delete: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const file = await getFileById(input.id);
      if (!file) {
        throw new TRPCError({ code: "NOT_FOUND", message: "File not found" });
      }
      if (file.userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });
      }
      await deleteFileById(input.id);
      return { success: true };
    }),

  /** Get a single file's metadata */
  get: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      const file = await getFileById(input.id);
      if (!file) {
        throw new TRPCError({ code: "NOT_FOUND", message: "File not found" });
      }
      if (file.userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });
      }
      return file;
    }),
});
