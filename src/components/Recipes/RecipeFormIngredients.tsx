import { ActionIcon, Flex, Input, TextInput } from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useRef } from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div ref={containerRef}>
        <Input.Label>Ingredients</Input.Label>
        {value.map((field) => (
          <Flex gap={"sm"} mt={"md"} align={"center"} key={field.id}>
            <div
              style={{
                flexGrow: 1,
              }}
            >
              <TextInput
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
                onChange([...value, { id: v4(), name: "" }]);
              }}
            >
              <IconPlus />
            </ActionIcon>
          </Flex>
        ))}
      </div>
    </>
  );
}

// function insertNewItem(
//   insert: UseFieldArrayInsert<RecipeFormFields, "ingredients">,
//   index: number,
//   containerDiv: React.RefObject<HTMLDivElement>
// ) {
//   const newIndex = index + 1;
//   insert(
//     newIndex,
//     {
//       id: uuidv4(),
//       name: "",
//     },
//     {
//       shouldFocus: true,
//     }
//   );

//   setTimeout(() => {
//     const newInputCandidates = document.getElementsByName(
//       getInputElementName(newIndex)
//     );
//     newInputCandidates.forEach((c) => {
//       if (containerDiv.current && containerDiv.current.contains(c)) {
//         c.scrollIntoView(true);
//       }
//     });
//   });
// }
