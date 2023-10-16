import { Affix, Button } from "@mantine/core";
import type { ShoppingListItemLive } from "../liveblocks.config";
import { useMutation } from "../liveblocks.config";

export function ShoppingListDeleteItems({
  items,
}: {
  items: Array<ShoppingListItemLive>;
}) {
  const deletePurchasedItems = useMutation(({ storage }) => {
    const shoppingList = storage.get("shoppingList");

    items
      .filter((i) => i.purchased)
      .forEach((i) => {
        const index = shoppingList.findIndex((l) => l.get("id") === i.id);
        shoppingList.delete(index);
      });
  }, []);

  const itemsToDelete = items.filter((i) => i.purchased).map((i) => i.id);
  if (itemsToDelete.length === 0) {
    return null;
  }

  return (
    <>
      <Affix position={{ bottom: 20, left: 20 }}>
        <Button onClick={() => deletePurchasedItems()} color="red">
          Remove Checked Items
        </Button>
      </Affix>
    </>
  );
}
