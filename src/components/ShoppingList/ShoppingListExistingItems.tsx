import type { ShoppingListItem } from "@prisma/client";
import { ShoppingListExistingItem } from "./ShoppingListItem";

export function ShoppingListExistingItems({
  items,
}: {
  items: Array<ShoppingListItem>;
}) {
  return (
    <>
      {items?.map((i) => (
        <ShoppingListExistingItem key={i.id} item={i} />
      ))}
    </>
  );
}
