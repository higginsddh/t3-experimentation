import { Alert } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

export function ErrorLoadingItems() {
  return (
    <Alert
      icon={<IconAlertCircle size={16} />}
      title="Error!"
      color="red"
      radius="md"
    >
      The shopping list was unable to load. Please try again!
    </Alert>
  );
}
