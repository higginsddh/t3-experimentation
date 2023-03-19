import { Button, Group, Modal } from "@mantine/core";

export function CreateRecipe({ onClose }: { onClose: () => void }) {
  return (
    <>
      <Modal opened={true} onClose={onClose} title="Add Recipe">
        <Group></Group>

        <Group position="right">
          <Button color="blue">Save</Button>
        </Group>
      </Modal>
    </>
  );
}
