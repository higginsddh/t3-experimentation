import {
  TextInput,
  Button,
  Modal,
  Flex,
  TagsInput,
  Stack,
  FileInput,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import ReceipeFormIngredients, {
  type Ingredient,
} from "./RecipeFormIngredients";

export function CreateRecipe({ onClose }: { onClose: () => void }) {
  const form = useForm<{
    title: string;
  }>({
    initialValues: {
      title: "",
      // tags: [],
      // ingredients: [{ id: "", name: "" }],
    },
  });

  return (
    <>
      <Modal opened={true} onClose={onClose} title="Add Recipe">
        <form
          onSubmit={form.onSubmit((v) => {
            console.log(v);
          })}
        >
          <Stack gap="sm">
            <TextInput
              withAsterisk
              label="Title"
              width={"100%"}
              {...form.getInputProps("title")}
            />

            {/* <ReceipeFormIngredients {...form.getInputProps("ingredients")} /> */}

            <FileInput label="Photo" placeholder="Select photo of receipt" />

            <TagsInput
              {...form.getInputProps("tags")}
              label="Tags"
              data={["Seafood", "Vegetarian"]}
            />

            <TextInput label="Link" type="url" />

            <Textarea label="Notes" />
          </Stack>

          <Flex justify="flex-end" mt="md">
            <Button color="blue" type="submit">
              Save
            </Button>
          </Flex>
        </form>
      </Modal>
    </>
  );
}
