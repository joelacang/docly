import type { CreateBaseElement } from "@/types/element";
import type { Element, Prisma } from "@prisma/client";
import { generateSlug } from ".";

export async function createElement({
  data,
  transaction,
  loggedUserId,
}: {
  data: CreateBaseElement;
  transaction: Prisma.TransactionClient;
  loggedUserId: string;
}): Promise<Element> {
  const { elementType, ...otherFields } = data;

  console.log({ loggedUserId, slug: generateSlug(data.name) });
  const element = await transaction.element.create({
    data: {
      ...otherFields,
      slug: generateSlug(data.name),
      createdById: loggedUserId,
      type: elementType,
    },
  });

  await transaction.elementOwner.create({
    data: {
      elementId: element.id,
      ownerId: loggedUserId,
      createdById: loggedUserId,
    },
  });

  return element;
}
