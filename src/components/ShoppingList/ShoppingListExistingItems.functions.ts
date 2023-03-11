import type { ShoppingListItem } from "@prisma/client";

export function getReorderedItems(
  args: { id: string; precedingId: string | null },
  old: ShoppingListItem[] | undefined
) {
  if (!old) {
    return old;
  }

  const oldItemIndex = old?.findIndex((o) => o.id === args.id);
  if (oldItemIndex === -1) {
    return old;
  }

  const newOrder = getNewOrder(args, old);

  return localReorder(old, oldItemIndex, newOrder);
}

function getNewOrder(
  args: { id: string; precedingId: string | null },
  old: ShoppingListItem[] | undefined
) {
  let newOrder = 0;
  if (args.precedingId !== null) {
    newOrder = (old?.find((o) => o.id === args.precedingId)?.order ?? -1) + 1;
  }
  return newOrder;
}

function localReorder<T>(list: Array<T>, startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);

  if (removed) {
    result.splice(endIndex, 0, removed);
  }

  return result.map((item, index) => ({
    ...item,
    order: index,
  }));
}
