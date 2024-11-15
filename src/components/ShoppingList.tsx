"use client";

import React, { useEffect } from "react";
import { trpc } from "../utils/trpc";
import { LoadingOverlay } from "@mantine/core";
import { ErrorLoadingItems } from "./ShoppingList/ErrorLoadingItems";
import { ShoppingListCreate } from "./ShoppingList/ShoppingListCreate";
import { ShoppingListExistingItems } from "./ShoppingList/ShoppingListExistingItems";
import Pusher from "pusher-js";
import { env } from "../env/client.mjs";

const ShoppingList: React.FC = () => {
  const {
    data: items,
    isInitialLoading: isLoadingItems,
    isError: isErrorFetchingItems,
  } = trpc.shoppingList.getAll.useQuery(undefined, {});

  const utils = trpc.useContext();
  useEffect(() => {
    const pusher = new Pusher(env.NEXT_PUBLIC_PUSHER_ID, {
      cluster: "us2",
    });

    const channel = pusher.subscribe("shopping-list");
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
