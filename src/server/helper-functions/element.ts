import type { CreateElement } from "@/types/element";
import type { Element, Prisma } from "@prisma/client";
import { generateSlug } from ".";

export async function createElement({
  data,
  transaction,
  loggedUserId,
}: {
  data: CreateElement;
  transaction: Prisma.TransactionClient;
  loggedUserId: string;
}): Promise<Element> {
  const { otherOwnerIds, ...otherFields } = data;

  console.log({ loggedUserId, slug: generateSlug(data.name) });
  const element = await transaction.element.create({
    data: {
      ...otherFields,
      slug: generateSlug(data.name),
      createdById: loggedUserId,
    },
  });

  await transaction.elementOwner.create({
    data: {
      elementId: element.id,
      ownerId: loggedUserId,
      createdById: loggedUserId,
    },
  });

  if (data.otherOwnerIds.length) {
    await transaction.elementOwner.createMany({
      data: otherOwnerIds.map((ownerId) => ({
        elementId: element.id,
        ownerId,
        createdById: loggedUserId,
      })),
    });
  }

  return element;
}

export const ElementPreviewPrismaSelection = {
  id: true,
  name: true,
  slug: true,
  status: true,
  access: true,
  type: true,
  color: true,
};
