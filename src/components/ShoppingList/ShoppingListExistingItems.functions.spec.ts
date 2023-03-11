import type { ShoppingListItem } from "@prisma/client";
import { getReorderedItems } from "./ShoppingListExistingItems.functions";
import { expect, test } from "vitest";

test("returns new order when moving item up", () => {
  const result = getReorderedItems(
    {
      id: "i-3",
      precedingId: "i-1",
    },
    [
      createShoppingListItem({
        id: "i-0",
        order: 0,
      }),
      createShoppingListItem({
        id: "i-1",
        order: 1,
      }),
      createShoppingListItem({
        id: "i-2",
        order: 2,
      }),
      createShoppingListItem({
        id: "i-3",
        order: 3,
      }),
    ]
  );

  expect(result).toEqual([
    createShoppingListItem({
      id: "i-0",
      order: 0,
    }),
    createShoppingListItem({
      id: "i-1",
      order: 1,
    }),
    createShoppingListItem({
      id: "i-3",
      order: 2,
    }),
    createShoppingListItem({
      id: "i-2",
      order: 3,
    }),
  ]);
});

function createShoppingListItem(
  defaults: Partial<ShoppingListItem>
): ShoppingListItem {
  return {
    id: "",
    text: "",
    order: 0,
    purchased: false,
    quantity: 1,
    ...defaults,
  };
}
