import { Button, Container, Flex } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { type NextPage } from "next";
import { RecipeForm } from "../components/Recipes/RecipeForm";
import { RecipeList } from "../components/Recipes/RecipeList";

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

      {opened ? <RecipeForm onClose={close} /> : null}
    </>
  );
};

export default Recipes;
