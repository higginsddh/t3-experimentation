"use client";

import React, { useEffect } from "react";
import { trpc } from "../../utils/trpc";
import { LoadingOverlay } from "@mantine/core";
import { ErrorLoadingItems } from "./ErrorLoadingItems";
import { ShoppingListCreate } from "./ShoppingListCreate";
import { ShoppingListExistingItems } from "./ShoppingListExistingItems";
import { clientPusher } from "../../clientServices/clientPusher";

const ShoppingList: React.FC = () => {
  const {
    data: items,
    isInitialLoading: isLoadingItems,
    isError: isErrorFetchingItems,
  } = trpc.shoppingList.getAll.useQuery(undefined, {});

  const utils = trpc.useUtils();
  useEffect(() => {
    const channel = clientPusher.subscribe("shopping-list");
    channel.bind("updated", function () {
      utils.shoppingList.getAll.invalidate();
    });
  }, [utils.shoppingList.getAll]);

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
