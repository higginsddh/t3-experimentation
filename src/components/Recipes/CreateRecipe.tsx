import { TextInput, Button, Group, Modal, Flex } from "@mantine/core";
import { Select } from "@mantine/core";
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
