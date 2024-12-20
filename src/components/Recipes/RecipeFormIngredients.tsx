import { ActionIcon, Flex, Input, TextInput } from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
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
  const [idToReceiveFocus, setIdToReceiveFocus] = useState<string | null>(null);

  return (
    <>
      <div>
        <Input.Label>Ingredients</Input.Label>
        {value.map((field, fieldIndex) => {
          return (
            <Ingredient
              key={field.id}
              index={fieldIndex}
              field={field}
              idToReceiveFocus={idToReceiveFocus}
              setIdToReceiveFocus={setIdToReceiveFocus}
              value={value}
              onChange={onChange}
            />
          );
        })}
      </div>
    </>
  );
}

function Ingredient({
  index,
  field,
  idToReceiveFocus,
  setIdToReceiveFocus,
  onChange,
  value,
}: {
  index: number;
  field: Ingredient;
  idToReceiveFocus: string | null;
  setIdToReceiveFocus: (v: string | null) => void;
  onChange: (newValue: Array<Ingredient>) => void;
  value: Array<Ingredient>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (field.id === idToReceiveFocus) {
      if (inputRef.current) {
        inputRef.current.focus();
        setIdToReceiveFocus(null);
      }
    }
  }, [idToReceiveFocus, setIdToReceiveFocus, field.id]);

  function addNewItem() {
    onChange(
      value.toSpliced(index + 1, 0, {
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
          ref={inputRef}
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
}
