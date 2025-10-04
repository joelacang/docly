import type { CreateBaseElement, ElementPreview } from "@/types/element";
import type { Element, Prisma } from "@prisma/client";
import { generateSlug } from ".";
import {
  ElementPreviewPrismaSelection,
  type ElementPreviewSelected,
} from "./prisma";
import { TRPCError } from "@trpc/server";

export function convertToElementPreview(
  data: ElementPreviewSelected,
): ElementPreview {
  const { createdBy, owners, ...others } = data;

  return {
    ...others,
    createdBy,
    owners: owners.map((o) => o.owner),
  };
}

export async function createElement({
  data,
  transaction,
  loggedUserId,
}: {
  data: CreateBaseElement;
  transaction: Prisma.TransactionClient;
  loggedUserId: string;
}): Promise<ElementPreview> {
  const { elementType, ...otherFields } = data;

  const createdElement = await transaction.element.create({
    data: {
      ...otherFields,
      slug: generateSlug(data.name, 24),
      createdById: loggedUserId,
      type: elementType,
    },
    select: { id: true },
  });

  await transaction.elementOwner.create({
    data: {
      elementId: createdElement.id,
      ownerId: loggedUserId,
      createdById: loggedUserId,
    },
  });

  const elementData = await transaction.element.findUnique({
    where: { id: createdElement.id },
    select: ElementPreviewPrismaSelection,
  });

  if (!elementData)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Element could not be found",
    });

  const element = convertToElementPreview(elementData);

  return element;
}
