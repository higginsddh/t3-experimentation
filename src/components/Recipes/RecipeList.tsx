import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Flex,
  Group,
  Text,
} from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";

export function RecipeList() {
  return (
    <>
      <Card withBorder>
        <Flex justify="space-between" mb="xs">
          <Text fw={500}>Brown butter cod</Text>
          <Group gap="xs">
            <ActionIcon variant="subtle" color="gray">
              <IconEdit />
            </ActionIcon>
            <ActionIcon variant="subtle" color="gray">
              <IconTrash />
            </ActionIcon>
          </Group>
        </Flex>
        <Group mb="xs">This is a recipe from Blue Apron.</Group>
        <Flex justify="space-between">
          <Group>
            <Badge color="red" variant="light">
              Seafood
            </Badge>
          </Group>
          <Button size="xs" variant="light" radius="lg">
            Add to shopping list
          </Button>
        </Flex>
      </Card>
    </>
  );
}
