import { ActionIcon, Flex, Input, TextInput } from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { v4 } from "uuid";

export type Ingredient = {
  id: string;
  name: string;
};

export default function ReceipeFormIngredients({
  value,
  onChange,
}: {
  value: Array<Ingredient>;
  onChange: (newValue: Array<Ingredient>) => void;
}) {
  return (
    <>
      <div>
        <Input.Label>Ingredients</Input.Label>
        {value.map((field, fieldIndex) => {
          function addNewItem() {
            onChange(
              value.toSpliced(fieldIndex + 1, 0, {
                id: v4(),
                name: "",
              }),
            );
          }

          return (
            <Flex gap={"sm"} mt={"md"} align={"center"} key={field.id}>
              <div
                style={{
                  flexGrow: 1,
                }}
              >
                <TextInput
                  value={field.name}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addNewItem();
                    }
                  }}
                  onChange={(e) => {
                    onChange(
                      value.map((v) => {
                        if (v.id === field.id) {
                          return {
                            ...v,
                            name: e.currentTarget.value,
                          };
                        } else {
                          return v;
                        }
                      }),
                    );
                  }}
                  rightSection={
                    value.length > 1 ? (
                      <ActionIcon
                        variant="default"
                        onClick={() => {
                          onChange(value.filter((v) => v.id !== field.id));
                        }}
                      >
                        <IconTrash />
                      </ActionIcon>
                    ) : null
                  }
                />
              </div>

              <ActionIcon
                variant="default"
                onClick={() => {
                  addNewItem();
                }}
              >
                <IconPlus />
              </ActionIcon>
            </Flex>
          );
        })}
      </div>
    </>
  );
}
