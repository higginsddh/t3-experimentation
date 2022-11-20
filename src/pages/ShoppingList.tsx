import React from "react";
import { trpc } from "../utils/trpc";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowsUpDown,
  faPlus,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import {
  ActionIcon,
  createStyles,
  Flex,
  Input,
  LoadingOverlay,
  NumberInput,
  TextInput,
} from "@mantine/core";
import { IconArrowsMoveVertical, IconPlus } from "@tabler/icons";

type ShoppingListItemValues = {
  text: string;
  quantity: number;
};
const newItemDefaultValues = {
  text: "",
  quantity: 1,
};

const ShoppingList: React.FC = () => {
  const [newItemValues, setNewItemValues] =
    useState<ShoppingListItemValues>(newItemDefaultValues);
  const utils = trpc.useContext();
  // const { data: sessionData } = useSession();

  const { mutate: addItem, isLoading: isAddingItem } =
    trpc.shoppingList.addItem.useMutation({
      onSuccess: () => {
        utils.shoppingList.getAll.invalidate();
        setNewItemValues(newItemDefaultValues);
      },
    });

  const { data: items, isLoading: isLoadingItems } =
    trpc.shoppingList.getAll.useQuery();

  return (
    <>
      {isLoadingItems ? <Spinner /> : null}
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

      {items?.map((i) => (
        <ShoppingListItemForm
          key={i.id}
          icon={
            <ActionIcon variant="filled" size={"lg"}>
              <IconArrowsMoveVertical size={18} />
            </ActionIcon>
          }
          values={{
            text: i.item,
            quantity: i.quantity,
          }}
          onValuesChange={() => {
            return;
          }}
        />
      ))}
    </>
  );
};

export default ShoppingList;

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
        placeholder="Add quantity..."
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
  return (
    <div style={{ width: 400, position: "relative" }}>
      <LoadingOverlay visible overlayBlur={2} />
      {/* ...other content */}
    </div>
  );
}
