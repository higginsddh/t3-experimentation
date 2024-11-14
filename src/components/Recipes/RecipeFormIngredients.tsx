import { ActionIcon, Flex, Input, TextInput } from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useRef } from "react";
export type Ingredient = {
  id: string;
  name: string;
};

export default function ReceipeFormIngredients({
  value,
} // onChange,
: {
  value: Array<Ingredient>;
  onChange: (newValue: Array<Ingredient>) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div ref={containerRef}>
        <Input.Label>Ingredients</Input.Label>
        {value.map((field) => (
          <Flex gap={"sm"} align={"center"} key={field.id}>
            <div
              style={{
                flexGrow: 1,
              }}
            >
              <TextInput
                rightSection={
                  <ActionIcon variant="default">
                    <IconTrash />
                  </ActionIcon>
                }
              />
            </div>

            <ActionIcon variant="default">
              <IconPlus />
            </ActionIcon>
          </Flex>
          //   <div className="input-group mb-3" key={field.id}>
          //     <input
          //       className="form-control"
          //     //   onKeyDown={(e) => {
          //     //     if (e.key === "Enter") {
          //     //       e.preventDefault();
          //     //       insertNewItem(insert, index, containerRef);
          //     //     }
          //     //   }}
          //     //   {...register(getInputElementName(index))}
          //     />
          //     <Button
          //       className="me-2"
          //       color="secondary"
          //       type="button"
          //       onClick={() => insertNewItem(insert, index, containerRef)}
          //     >
          //       <FontAwesomeIcon icon={faPlus} />
          //     </Button>

          //     <Button
          //       color="secondary"
          //       type="button"
          //       onClick={() => {
          //         if (fields.length > 1) {
          //           remove(index);
          //         } else {
          //           update(index, {
          //             ...field,
          //             name: "",
          //           });
          //         }
          //       }}
          //     >
          //       <FontAwesomeIcon icon={faTrash} />
          //     </Button>
          //   </div>
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

// function getInputElementName(index: number): `ingredients.${number}.name` {
//   return `ingredients.${index}.name`;
// }
