import { Center } from "@mantine/core";
import { IconGripVertical } from "@tabler/icons-react";
import { useState } from "react";
import type { ShoppingListItemValues } from "./ShoppingListItemForm";
import { ShoppingListItemForm } from "./ShoppingListItemForm";
import { Draggable } from "react-beautiful-dnd";
import { NonBlockingLoader } from "../NonBlockingLoader";
import type { ShoppingListItem } from "../../models/ShoppingListItem";

export function ShoppingListExistingItem({
  item,
  index,
}: {
  item: ShoppingListItem;
  index: number;
}) {
  const [itemValues, setItemValues] = useState<ShoppingListItemValues>({
    text: item.text ?? "",
    quantity: item.quantity,
    purchased: item.purchased,
  });

  // const { mutate: updateItem, isLoading } =
  //   trpc.shoppingList.updateItem.useMutation({
  //     async onMutate(updatedItem) {
  //       // Cancel outgoing fetches (so they don't overwrite our optimistic update)
  //       await utils.shoppingList.getAll.cancel();

  //       const previousData = utils.shoppingList.getAll.getData();

  //       utils.shoppingList.getAll.setData(undefined, (old) =>
  //         !old
  //           ? old
  //           : old.map((o) => {
  //               if (o.id === updatedItem.id) {
  //                 return {
  //                   ...o,
  //                   ...updatedItem,
  //                 };
  //               } else {
  //                 return o;
  //               }
  //             })
  //       );

  //       return { previousData };
  //     },

  //     onSettled: () => {
  //       utils.shoppingList.getAll.invalidate();
  //     },

  //     onError(err, newItem, ctx) {
  //       // If the mutation fails, use the context-value from onMutate
  //       utils.shoppingList.getAll.setData(
  //         undefined,
  //         () => ctx?.previousData ?? []
  //       );
  //     },
  //   });

  const isLoading = false;

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
                // updateItem({
                //   id: item.id,
                //   ...newValues,
                // });
                setItemValues(newValues);
              }}
            />
          </div>
        )}
      </Draggable>

      {isLoading ? <NonBlockingLoader /> : null}
    </>
  );
}
