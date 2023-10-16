import type { LiveList } from "@liveblocks/client";
import { LiveObject, createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";
import { env } from "../env/client.mjs";
import { useEffect } from "react";

const client = createClient({
  publicApiKey: env.NEXT_PUBLIC_LIVEBLOCK_KEY,
});

export type ShoppingListItemLive = {
  id: string;
  text: string;
  quantity: number;
  purchased: boolean;
};

type Storage = {
  shoppingList: LiveList<LiveObject<ShoppingListItemLive>>;
};

const shoppingListStorageKey = "shoppingList";

export function usePersistListToLocalStorage() {
  const items = useStorage((root) => root.shoppingList);

  useEffect(() => {
    window.localStorage.setItem(shoppingListStorageKey, JSON.stringify(items));
  }, [items]);
}

export function getPersistedListFromLocalStorage() {
  if (typeof window === "undefined") {
    return [];
  }

  const storedList = window?.localStorage?.getItem(shoppingListStorageKey);
  if (storedList) {
    const parsedList = JSON.parse(storedList) as Array<ShoppingListItemLive>;
    return parsedList.map((l) => new LiveObject(l));
  } else {
    return [];
  }
}

export const { RoomProvider, useOthers, useMutation, useStorage, useRoom } =
  createRoomContext<Record<string, never>, Storage>(client);
