import type { TRPC_ERROR_CODE_KEY, TRPCError } from "@trpc/server";

export function generateSlug(text: string): string {
  const cleanedText = text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // replace spaces with -
    .replace(/[^a-z0-9\-]/g, "") // remove non-alphanumeric except hyphens
    .replace(/\-+/g, "-"); // collapse multiple hyphens

  const uniqueId = generateId(6); // you can customize the length
  return `${cleanedText}-${uniqueId.toLowerCase()}`;
}

export function generateId(length: number): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export const unAuthorized = {
  code: "UNAUTHORIZED" as TRPC_ERROR_CODE_KEY,
  message: "You are not allowed to perform this procedure.",
};

export const unknownError = (error: Error) => {
  return {
    name: "unknownError",
    code: "INTERNAL_SERVER_ERROR",
    message: "An unknown error occurred",
    cause: error,
  } satisfies TRPCError;
};
