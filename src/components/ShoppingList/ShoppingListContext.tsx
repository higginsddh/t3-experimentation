import { LiveList } from "@liveblocks/client";
import {
  RoomProvider,
  getPersistedListFromLocalStorage,
} from "../liveblocks.config";

export const ShoppingListContext: React.FunctionComponent<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <RoomProvider
      id="shoppingList"
      initialPresence={{}}
      initialStorage={{
        shoppingList: new LiveList([]),
      }}
    >
      {children}
    </RoomProvider>
  );
};
