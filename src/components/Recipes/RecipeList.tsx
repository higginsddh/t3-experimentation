import { ActionIcon, Badge, Button, Card, Group, Text } from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";

export function RecipeList() {
  return (
    <>
      <Card withBorder>
        <Group position="apart" mb="xs">
          <Text weight={500}>Brown butter cod</Text>
          <Group spacing="xs">
            <ActionIcon>
              <IconEdit />
            </ActionIcon>
            <ActionIcon>
              <IconTrash />
            </ActionIcon>
          </Group>
        </Group>
        <Group mb="xs">This is a recipe from Blue Apron.</Group>
        <Group position="apart">
          <Group>
            <Badge color="red" variant="light">
              Seafood
            </Badge>
          </Group>
          <Button size="xs" variant="light">
            Add to shopping list
          </Button>
        </Group>
      </Card>
    </>
  );
}
