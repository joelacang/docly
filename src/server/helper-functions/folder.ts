import type { Prisma } from "@prisma/client";

export async function createFolder({}: {
  elementId: string;
  loggedUserId: string;
  transaction: Prisma.TransactionClient;
  workspaceId: string;
  parentFolderId: string;
});
