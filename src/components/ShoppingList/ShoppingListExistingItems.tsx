import type { ShoppingListItem } from "@prisma/client";
import { ShoppingListExistingItem } from "./ShoppingListItem";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

export function ShoppingListExistingItems({
  items,
}: {
  items: Array<ShoppingListItem>;
}) {
  return (
    <DragDropContext
      onDragEnd={(result) => {
        // reorderShoppingListItems({
        //   id: result.draggableId,
        //   order: result.destination?.index ?? 0,
        // });
      }}
    >
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
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
  );
}
