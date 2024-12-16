import { LoadingOverlay } from "@mantine/core";
import { trpc } from "../../utils/trpc";
import { RecipeForm } from "./RecipeForm";
import { useState } from "react";

export function RecipeFormUpdate({
  id,
  onClose,
}: {
  id: string;
  onClose: () => void;
}) {
  const utils = trpc.useUtils();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data: recipes, isLoading } = trpc.recipes.getAll.useQuery();

  // TODO: Handle error
  const { mutate: updateItem, isLoading: saving } =
    trpc.recipes.updateRecipe.useMutation({
      onSuccess: () => {
        utils.recipes.getAll.invalidate();
        onClose();
      },

      onError: () => {
        setErrorMessage("Error occurred saving...");
      },
    });

  // TODO: Handle not found
  const recipe = recipes?.find((r) => r.id === id);
  return isLoading || !recipe ? (
    <LoadingOverlay />
  ) : (
    <RecipeForm
      errorMessage={errorMessage}
      initialValues={{
        ...recipe,
        photo: recipe.photo ?? "",
        link: recipe.link ?? "",
        // TODO
        ingredients: [],
      }}
      onClose={onClose}
      saving={saving}
      onSave={(values) =>
        updateItem({
          id,
          ...values,
        })
      }
    />
  );
}
