import { Affix, Button } from "@mantine/core";
import { trpc } from "../../utils/trpc";
import { NonBlockingLoader } from "../NonBlockingLoader";
import { ShoppingListItem } from "./ShoppingListItemType";

export function ShoppingListDeleteItems({
  items,
}: {
  items: Array<ShoppingListItem>;
}) {
  const utils = trpc.useContext();

  const { mutate: deleteItems, isLoading } =
    trpc.shoppingList.deleteItems.useMutation({
      async onMutate(args) {
        // Cancel outgoing fetches (so they don't overwrite our optimistic update)
        await utils.shoppingList.getAll.cancel();

        const previousData = utils.shoppingList.getAll.getData();

        utils.shoppingList.getAll.setData(undefined, (old) => {
          return old?.filter((o) => !args.itemsToDelete.includes(o.id));
        });

        return { previousData };
      },

      onSettled: () => {
        utils.shoppingList.getAll.invalidate();
      },

      onError(err, newItem, ctx) {
        // If the mutation fails, use the context-value from onMutate
        utils.shoppingList.getAll.setData(
          undefined,
          () => ctx?.previousData ?? []
        );
      },
    });

  const itemsToDelete = items.filter((i) => i.purchased).map((i) => i.id);
  if (itemsToDelete.length === 0) {
    return null;
  }

  return (
    <>
      <Affix position={{ bottom: 20, left: 20 }}>
        <Button
          onClick={() =>
            deleteItems({
              itemsToDelete,
            })
          }
        >
          Remove Checked Items
        </Button>
      </Affix>

      {isLoading ? <NonBlockingLoader /> : null}
    </>
  );
}
