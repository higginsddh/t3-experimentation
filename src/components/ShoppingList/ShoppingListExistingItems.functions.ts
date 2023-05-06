// import type { ShoppingListItem } from "@prisma/client";

import { ShoppingListItem } from "./ShoppingListItemType";

export function getReorderedItems(
  args: { id: string; precedingId: string | null },
  old: ShoppingListItem[] | undefined
) {
  if (!old) {
    return old;
  }

  const result = localReorder(old, args.id, args.precedingId);

  return result;
}

function localReorder(
  list: Array<ShoppingListItem>,
  id: string,
  precedingJobId: string | null
) {
  let result = Array.from(list);
  const item = result.find((i) => i.id === id);

  if (item) {
    result = result.filter((i) => i.id !== id);

    if (precedingJobId === null) {
      result = [item, ...result];
    } else {
      const precedingJobIndex =
        (result.findIndex((i) => i.id === precedingJobId) ?? -1) + 1;
      result.splice(precedingJobIndex, 0, item);
    }
  }

  return result.map((item, index) => ({
    ...item,
    order: index,
  }));
}
