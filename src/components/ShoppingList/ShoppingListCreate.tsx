import { ActionIcon } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { trpc } from "../../utils/trpc";
import { NonBlockingLoader } from "../NonBlockingLoader";
import type { ShoppingListItemValues } from "./ShoppingListItemForm";
import { ShoppingListItemForm } from "./ShoppingListItemForm";

const newItemDefaultValues = {
  text: "",
  quantity: 1,
};

let newItemCount = 0;
export function ShoppingListCreate() {
  const [newItemValues, setNewItemValues] =
    useState<ShoppingListItemValues>(newItemDefaultValues);
  const utils = trpc.useUtils();

  const { mutate: addItem, isLoading } = trpc.shoppingList.addItem.useMutation({
    async onMutate(newItem) {
      // Cancel outgoing fetches (so they don't overwrite our optimistic update)
      await utils.shoppingList.getAll.cancel();

      const previousData = utils.shoppingList.getAll.getData();

      newItemCount++;
      utils.shoppingList.getAll.setData(undefined, (old) => [
        {
          id: `newitem${newItemCount}`,
          order: 0,
          purchased: false,
          ...newItem,
        },
        ...(old ?? []),
      ]);

      setNewItemValues(newItemDefaultValues);

      return { previousData };
    },

    onSettled: () => {
      utils.shoppingList.getAll.invalidate();
    },

    onError(err, newItem, ctx) {
      setNewItemValues(newItem);

      // If the mutation fails, use the context-value from onMutate
      utils.shoppingList.getAll.setData(
        undefined,
        () => ctx?.previousData ?? [],
      );
    },
  });

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addItem(newItemValues);
        }}
      >
        <ShoppingListItemForm
          icon={
            <ActionIcon
              variant="filled"
              size={"lg"}
              component="button"
              type="submit"
              color="blue"
            >
              <IconPlus size={18} />
            </ActionIcon>
          }
          values={newItemValues}
          onValuesChange={setNewItemValues}
          hideQuantity
        />
      </form>

      {isLoading ? <NonBlockingLoader /> : null}
    </>
  );
}
