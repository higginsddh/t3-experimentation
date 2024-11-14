import { Checkbox, Flex, NumberInput, TextInput } from "@mantine/core";

export type ShoppingListItemValues = {
  text: string;
  quantity: number;
  purchased?: boolean;
};

export function ShoppingListItemForm({
  icon,
  values,
  onValuesChange,
  showPurchasedCheckbox,
  hideQuantity,
}: {
  icon: JSX.Element;
  values: ShoppingListItemValues;
  onValuesChange(args: ShoppingListItemValues): void;
  showPurchasedCheckbox?: boolean;
  hideQuantity?: boolean;
}) {
  return (
    <Flex columnGap={"md"} mb="sm">
      {showPurchasedCheckbox ? (
        <Checkbox
          onChange={(e) => {
            onValuesChange({
              ...values,
              purchased: e.currentTarget.checked,
            });
          }}
          checked={values.purchased ?? false}
          styles={{
            root: {
              alignSelf: "center",
              width: "20px",
            },
          }}
        />
      ) : null}

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
          input: {
            textDecoration: values.purchased ? "line-through" : undefined,
          },
          root: {
            flexGrow: 1,
          },
        }}
      />

      {!hideQuantity ? (
        <NumberInput
          value={values.quantity}
          onChange={(e) => {
            if (e === "") {
              e = 1;
            } else if (typeof e === "string") {
              e = parseInt(e);
            }

            onValuesChange({
              ...values,
              quantity: e ?? 1,
            });
          }}
          required
          max={99}
          min={1}
          aria-label="Shopping list quantity"
          styles={{
            input: {
              textDecoration: values.purchased ? "line-through" : undefined,
            },
            root: {
              width: "65px",
            },
          }}
        />
      ) : null}

      {icon}
    </Flex>
  );
}
