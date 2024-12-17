import { Button, Container, Flex } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { type NextPage } from "next";
import { RecipeList } from "../components/Recipes/RecipeList";
import { RecipeFormCreate } from "../components/Recipes/RecipeFormCreate";

const Recipes: NextPage = () => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Container>
        <Flex justify="flex-end" mb="md">
          <Button color="blue" onClick={open}>
            Add Recipe
          </Button>
        </Flex>
        <RecipeList />
      </Container>

      {opened ? <RecipeFormCreate onClose={close} /> : null}
    </>
  );
};

export default Recipes;
