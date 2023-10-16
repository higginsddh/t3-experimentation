import { ActionIcon } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import type { ShoppingListItemValues } from "./ShoppingListItemForm";
import { ShoppingListItemForm } from "./ShoppingListItemForm";
import type { ShoppingListItemLive } from "../liveblocks.config";
import { useMutation } from "../liveblocks.config";
import { LiveObject } from "@liveblocks/client";
import { v4 as uuidv4 } from "uuid";

const newItemDefaultValues = {
  text: "",
  quantity: 1,
};

// let newItemCount = 0;
export function ShoppingListCreate() {
  const [newItemValues, setNewItemValues] =
    useState<ShoppingListItemValues>(newItemDefaultValues);
  const addItemToLiveBlock = useMutation(
    ({ storage }, newValues: ShoppingListItemValues) => {
      const shoppingListToUpdate = storage.get("shoppingList");

      shoppingListToUpdate.insert(
        new LiveObject<ShoppingListItemLive>({
          id: uuidv4(),
          text: newValues.text,
          purchased: newValues.purchased ?? false,
          quantity: newValues.quantity,
        }),
        0,
      );

      setNewItemValues(newItemDefaultValues);
    },
    [],
  );

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addItemToLiveBlock(newItemValues);
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
    </>
  );
}
