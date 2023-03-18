import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Container,
  Group,
  Text,
} from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { type NextPage } from "next";

const Recipes: NextPage = () => {
  return (
    <>
      <Container>
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
          <Group>This is a recipe from Blue Apron.</Group>
          <Group position="apart">
            <Group>
              <Badge color="red" variant="light">
                Seafood
              </Badge>
            </Group>
            <Button size="sm" variant="light">
              Add to shopping list
            </Button>
          </Group>
        </Card>
      </Container>
    </>
  );
};

export default Recipes;
