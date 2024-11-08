import React from "react";
import { LoadingOverlay } from "@mantine/core";
import { ErrorLoadingItems } from "./ShoppingList/ErrorLoadingItems";
import { ShoppingListCreate } from "./ShoppingList/ShoppingListCreate";
import { ShoppingListExistingItems } from "./ShoppingList/ShoppingListExistingItems";
import { ShoppingListItem } from "../models/ShoppingListItem";

const ShoppingList: React.FC = () => {
  // const {
  //   data: items,
  //   isInitialLoading: isLoadingItems,
  //   isError: isErrorFetchingItems,
  // } = trpc.shoppingList.getAll.useQuery(undefined, {});
  const isLoadingItems = false;
  const isErrorFetchingItems = false;
  const items: Array<ShoppingListItem> = [];
  return (
    <div style={{ position: "relative" }}>
      {isLoadingItems ? (
        <LoadingOverlay visible overlayProps={{ blur: 2 }} />
      ) : null}

      {isErrorFetchingItems ? (
        <ErrorLoadingItems />
      ) : (
        <>
          <ShoppingListCreate />

          <ShoppingListExistingItems items={items ?? []} />
        </>
      )}
    </div>
  );
};

export default ShoppingList;
