import type { ShoppingListItem } from "@prisma/client";
import { ShoppingListExistingItem } from "./ShoppingListItem";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { trpc } from "../../utils/trpc";
import { ShoppingListDeleteItems } from "./ShoppingListDeleteItems";
import { getReorderedItems } from "./ShoppingListExistingItems.functions";
import { NonBlockingLoader } from "../NonBlockingLoader";

export function ShoppingListExistingItems({
  items,
}: {
  items: Array<ShoppingListItem>;
}) {
  const utils = trpc.useUtils();
  console.log(items);

  const { mutate: reorder, isLoading } = trpc.shoppingList.reorder.useMutation({
    async onMutate(args) {
      // Cancel outgoing fetches (so they don't overwrite our optimistic update)
      await utils.shoppingList.getAll.cancel();

      const previousData = utils.shoppingList.getAll.getData();

      utils.shoppingList.getAll.setData(undefined, (old) => {
        return getReorderedItems(args, old);
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
        () => ctx?.previousData ?? [],
      );
    },
  });

  return (
    <>
      <DragDropContext
        onDragEnd={(result) => {
          if (typeof result.destination?.index === "number" && items) {
            if (result.source.index === result.destination.index) {
              return;
            }

            let precedingId: string | null;
            if (result.destination.index === 0) {
              precedingId = null;
            } else if (result.source.index > result.destination.index) {
              precedingId = items[result.destination.index - 1]?.id ?? null;
            } else {
              precedingId = items[result.destination.index]?.id ?? null;
            }

            reorder({
              id: result.draggableId,
              precedingId,
            });
          }
        }}
      >
        <Droppable droppableId="droppable">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              <>
                {items?.map((i, index) => (
                  <ShoppingListExistingItem key={i.id} item={i} index={index} />
                ))}
              </>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <ShoppingListDeleteItems items={items} />

      {isLoading ? <NonBlockingLoader /> : null}
    </>
  );
}
