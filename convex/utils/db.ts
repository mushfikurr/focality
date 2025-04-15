import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id, Doc, TableNames } from "../_generated/dataModel";

// Get a document by ID with proper error handling
export async function getDocumentOrThrow<T extends TableNames>(
  ctx: QueryCtx | MutationCtx,
  table: T,
  id: Id<T>,
  errorMessage?: string
): Promise<Doc<T>> {
  const document = await ctx.db.get(id);
  if (!document) {
    throw new Error(errorMessage || `${table} not found`);
  }
  return document;
}

// Get a document by a specific field using an index
export async function getDocumentByField<T extends TableNames>(
  ctx: QueryCtx | MutationCtx,
  table: T,
  indexName: string,
  fieldName: string,
  fieldValue: any
): Promise<Doc<T> | null> {
  return await ctx.db
    .query(table)
    .withIndex(indexName, (q) => q.eq(fieldName, fieldValue))
    .first();
}

// Get documents with pagination
export async function getPaginatedDocuments<T extends TableNames>(
  ctx: QueryCtx | MutationCtx,
  table: T,
  indexName: string,
  fieldName: string,
  fieldValue: any,
  limit: number = 10
) {
  return await ctx.db
    .query(table)
    .withIndex(indexName, (q) => q.eq(fieldName, fieldValue))
    .take(limit);
}

// Count documents matching a condition using unique to get count
export async function countDocuments<T extends TableNames>(
  ctx: QueryCtx | MutationCtx,
  table: T,
  indexName: string,
  fieldName: string,
  fieldValue: any
): Promise<number> {
  const count = await ctx.db
    .query(table)
    .withIndex(indexName, (q) => q.eq(fieldName, fieldValue))
    .unique();
  
  return count?.length || 0;
}
