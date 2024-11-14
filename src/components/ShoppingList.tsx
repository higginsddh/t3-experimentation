import React, { useEffect, useState } from "react";
import { LoadingOverlay } from "@mantine/core";
import { ErrorLoadingItems } from "./ShoppingList/ErrorLoadingItems";
import { ShoppingListCreate } from "./ShoppingList/ShoppingListCreate";
import { ShoppingListExistingItems } from "./ShoppingList/ShoppingListExistingItems";
import type { ShoppingListItem } from "../models/ShoppingListItem";
import { addRxPlugin, toTypedRxJsonSchema } from "rxdb";
import type {
  ExtractDocumentTypeFromTypedRxJsonSchema,
  RxCollection,
  RxDatabase,
  RxJsonSchema,
} from "rxdb";
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";
import { createRxDatabase } from "rxdb";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";

addRxPlugin(RxDBDevModePlugin);

const shoppingListSchema = {
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
      maxLength: 100, // <- the primary key must have set maxLength
    },
    text: {
      type: "string",
    },
    purchased: {
      type: "boolean",
    },
    quantity: {
      type: "number",
    },
  },
  required: ["id", "text", "purchased", "quantity"],
} as const;
const schemaTyped = toTypedRxJsonSchema(shoppingListSchema);

// aggregate the document type from the schema
export type HeroDocType = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof schemaTyped
>;

// create the typed RxJsonSchema from the literal typed object.
export const heroSchema: RxJsonSchema<HeroDocType> = shoppingListSchema;

export type ShoppingListCollection = RxCollection<
  HeroDocType,
  unknown,
  unknown
>;
export type MyDatabaseCollections = {
  shoppinglist: ShoppingListCollection;
};
export type MyDatabase = RxDatabase<MyDatabaseCollections>;

const ShoppingList: React.FC = () => {
  // const {
  //   data: items,
  //   isInitialLoading: isLoadingItems,
  //   isError: isErrorFetchingItems,
  // } = trpc.shoppingList.getAll.useQuery(undefined, {});
  const isLoadingItems = false;
  const isErrorFetchingItems = false;
  const [items, setItems] = useState<Array<ShoppingListItem>>([]);

  useEffect(() => {
    (async () => {
      const myDatabase: MyDatabase = await createRxDatabase({
        name: "mydatabase",
        storage: getRxStorageDexie(),
        ignoreDuplicate: true,
      });

      await myDatabase.addCollections({
        shoppinglist: {
          schema: shoppingListSchema,
        },
      });

      await myDatabase.shoppinglist.insert({
        id: "todo2",
        text: "Test Item",
        quantity: 2,
        purchased: false,
      });

      myDatabase.shoppinglist
        .find()
        .exec()
        .then((r) => setItems(r));
    })();
  }, []);

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
