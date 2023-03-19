import { Button, Container, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { type NextPage } from "next";
import { CreateRecipe } from "../components/Recipes/CreateRecipe";
import { RecipeList } from "../components/Recipes/RecipeList";

const Recipes: NextPage = () => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Container>
        <Group position="right" mb="md">
          <Button color="blue" onClick={open}>
            Add Recipe
          </Button>
        </Group>
        <RecipeList />
      </Container>

      {opened ? <CreateRecipe onClose={close} /> : null}
    </>
  );
};

export default Recipes;
