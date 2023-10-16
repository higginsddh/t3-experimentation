import { Center } from "@mantine/core";
import { IconGripVertical } from "@tabler/icons-react";
import { useState } from "react";
import type { ShoppingListItemValues } from "./ShoppingListItemForm";
import { ShoppingListItemForm } from "./ShoppingListItemForm";
import { Draggable } from "react-beautiful-dnd";
import type { ShoppingListItemLive } from "../liveblocks.config";
import { useMutation } from "../liveblocks.config";

export function ShoppingListExistingItem({
  item,
  index,
}: {
  item: ShoppingListItemLive;
  index: number;
}) {
  const updateItem = useMutation(
    ({ storage }, newValues: ShoppingListItemValues) => {
      const itemToUpdate = storage
        .get("shoppingList")
        .find((i) => i.get("id") === item.id);

      if (itemToUpdate) {
        itemToUpdate.set("text", newValues.text);
        itemToUpdate.set("quantity", newValues.quantity);
        itemToUpdate.set("purchased", newValues.purchased ?? false);
      }
    },
    [],
  );

  const [itemValues, setItemValues] = useState<ShoppingListItemValues>({
    text: item.text ?? "",
    quantity: item.quantity,
    purchased: item.purchased,
  });

  return (
    <>
      <Draggable draggableId={item.id} index={index}>
        {(provided) => (
          <div
            className="d-flex"
            ref={provided.innerRef}
            {...provided.draggableProps}
          >
            <ShoppingListItemForm
              showPurchasedCheckbox
              icon={
                <Center {...provided.dragHandleProps}>
                  <IconGripVertical size="1.2rem" />
                </Center>
              }
              values={itemValues}
              onValuesChange={(newValues) => {
                updateItem(newValues);
                setItemValues(newValues);
              }}
            />
          </div>
        )}
      </Draggable>
    </>
  );
}
