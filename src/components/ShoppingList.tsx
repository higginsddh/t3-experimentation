import React from "react";
import { trpc } from "../utils/trpc";
import { LoadingOverlay } from "@mantine/core";
import { ErrorLoadingItems } from "./ShoppingList/ErrorLoadingItems";
import { ShoppingListCreate } from "./ShoppingList/ShoppingListCreate";
import { ShoppingListExistingItems } from "./ShoppingList/ShoppingListExistingItems";

const ShoppingList: React.FC = () => {
  const {
    data: items,
    isInitialLoading: isLoadingItems,
    isError: isErrorFetchingItems,
  } = trpc.shoppingList.getAll.useQuery(undefined, {
    onSuccess: (data) => {
      console.log(
        data.map((d) => ({
          order: d.order,
          text: d.text,
        }))
      );
    },
  });

  return (
    <div style={{ position: "relative" }}>
      {isLoadingItems ? <LoadingOverlay visible overlayBlur={2} /> : null}

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
