import { ActionIcon } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { NonBlockingLoader } from "../NonBlockingLoader";
import type { ShoppingListItemValues } from "./ShoppingListItemForm";
import { ShoppingListItemForm } from "./ShoppingListItemForm";

const newItemDefaultValues = {
  text: "",
  quantity: 1,
};

// let newItemCount = 0;
export function ShoppingListCreate() {
  const [newItemValues, setNewItemValues] =
    useState<ShoppingListItemValues>(newItemDefaultValues);
  const isLoading = false;

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          // addItem(newItemValues);
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
        />
      </form>

      {isLoading ? <NonBlockingLoader /> : null}
    </>
  );
}
