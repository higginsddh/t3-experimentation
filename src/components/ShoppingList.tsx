import React from "react";
import { ShoppingListCreate } from "./ShoppingList/ShoppingListCreate";
import { ShoppingListExistingItems } from "./ShoppingList/ShoppingListExistingItems";
import {
  usePersistListToLocalStorage,
  useRoom,
  useStorage,
} from "./liveblocks.config";
import { LoadingOverlay } from "@mantine/core";

const ShoppingList: React.FC = () => {
  const items = useStorage((root) => root.shoppingList);
  const room = useRoom();

  usePersistListToLocalStorage();

  return (
    <>
      <div style={{ position: "relative" }}>
        <ShoppingListCreate />

        <ShoppingListExistingItems
          items={items?.map((i) => ({ ...i })) ?? []}
        />
      </div>

      {room.getStorageStatus() === "not-loaded" ? (
        <LoadingOverlay visible overlayProps={{ blur: 2 }} />
      ) : null}
    </>
  );
};

export default ShoppingList;
