import React from "react";
import { trpc } from "../utils/trpc";
import { useState } from "react";
import {
  ActionIcon,
  Alert,
  Flex,
  LoadingOverlay,
  NumberInput,
  TextInput,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconArrowsMoveVertical,
  IconPlus,
} from "@tabler/icons";
import { type ShoppingListItem } from "@prisma/client";

type ShoppingListItemValues = {
  text: string;
  quantity: number;
};

const ShoppingList: React.FC = () => {
  const {
    data: items,
    isInitialLoading: isLoadingItems,
    isError: isErrorFetchingItems,
  } = trpc.shoppingList.getAll.useQuery();

  return (
    <div style={{ position: "relative" }}>
      {isLoadingItems ? <Spinner /> : null}

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

function ErrorLoadingItems() {
  return (
    <Alert
      icon={<IconAlertCircle size={16} />}
      title="Error!"
      color="red"
      radius="md"
    >
      The shopping list was unable to load. Please try again!
    </Alert>
  );
}

const newItemDefaultValues = {
  text: "",
  quantity: 1,
};

function ShoppingListExistingItems({
  items,
}: {
  items: Array<ShoppingListItem>;
}) {
  return (
    <>
      {items?.map((i) => (
        <ShoppingListItemForm
          key={i.id}
          icon={
            <ActionIcon variant="filled" size={"lg"}>
              <IconArrowsMoveVertical size={18} />
            </ActionIcon>
          }
          values={{
            text: i.text,
            quantity: i.quantity,
          }}
          onValuesChange={() => {
            return;
          }}
        />
      ))}
    </>
  );
}

let newItemCount = 0;
function ShoppingListCreate() {
  const [newItemValues, setNewItemValues] =
    useState<ShoppingListItemValues>(newItemDefaultValues);
  const utils = trpc.useContext();

  const { mutate: addItem } = trpc.shoppingList.addItem.useMutation({
    async onMutate(newItem) {
      // Cancel outgoing fetches (so they don't overwrite our optimistic update)
      await utils.shoppingList.getAll.cancel();

      const previousData = utils.shoppingList.getAll.getData();

      newItemCount++;
      utils.shoppingList.getAll.setData((old) => [
        { id: `newitem${newItemCount}`, order: 0, ...newItem },
        ...(old ?? []),
      ]);

      setNewItemValues(newItemDefaultValues);

      return { previousData };
    },

    onSettled: () => {
      utils.shoppingList.getAll.invalidate();
    },

    onError(err, newItem, ctx) {
      setNewItemValues(newItem);

      // If the mutation fails, use the context-value from onMutate
      utils.shoppingList.getAll.setData(() => ctx?.previousData ?? []);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        addItem(newItemValues);
      }}
    >
      <ShoppingListItemForm
        icon={
          <ActionIcon
            variant="filled"
            size={"lg"}
            component="button"
            type="submit"
          >
            <IconPlus size={18} />
          </ActionIcon>
        }
        values={newItemValues}
        onValuesChange={setNewItemValues}
      />
    </form>
  );
}

function ShoppingListItemForm({
  icon,
  values,
  onValuesChange,
}: {
  icon: JSX.Element;
  values: ShoppingListItemValues;
  onValuesChange(args: ShoppingListItemValues): void;
}) {
  return (
    <Flex columnGap={"md"} mb="sm">
      <TextInput
        placeholder="Add item..."
        value={values.text}
        onChange={(e) =>
          onValuesChange({
            ...values,
            text: e.currentTarget.value,
          })
        }
        required
        aria-label="Shopping list item"
        styles={{
          root: {
            flexGrow: 1,
          },
        }}
      />

      <NumberInput
        value={values.quantity}
        onChange={(e) =>
          onValuesChange({
            ...values,
            quantity: e ?? 1,
          })
        }
        required
        max={99}
        aria-label="Shopping list quantity"
        styles={{
          root: {
            width: "65px",
          },
        }}
      />

      {icon}
    </Flex>
  );
}

function Spinner() {
  return <LoadingOverlay visible overlayBlur={2} />;
}
