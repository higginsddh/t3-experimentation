import { TextInput, Button, Modal, Flex, TagsInput } from "@mantine/core";
import { useForm } from "@mantine/form";

export function CreateRecipe({ onClose }: { onClose: () => void }) {
  const form = useForm<{ title: string; tags: Array<string> }>({
    initialValues: {
      title: "",
      tags: [],
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
          <TextInput
            withAsterisk
            label="Title"
            width={"100%"}
            {...form.getInputProps("title")}
          />

          <TagsInput
            {...form.getInputProps("tags")}
            label="Tags"
            data={["Seafood", "Vegetarian"]}
          />

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
