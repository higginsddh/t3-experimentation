import { useState } from "react";
import { trpc } from "../../utils/trpc";
import { RecipeForm } from "./RecipeForm";

export function RecipeFormCreate({ onClose }: { onClose: () => void }) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const utils = trpc.useUtils();

  const { mutate: addItem, isLoading: saving } =
    trpc.recipes.addRecipe.useMutation({
      onSuccess: () => {
        utils.recipes.getAll.invalidate();
        onClose();
      },

      onError: () => {
        setErrorMessage("Error occurred saving...");
      },
    });

  return (
    <RecipeForm
      errorMessage={errorMessage}
      initialValues={{
        title: "",
        tags: [],
        ingredients: [{ id: "", name: "" }],
        link: "",
        notes: "",
        photo: "",
      }}
      onClose={onClose}
      saving={saving}
      onSave={(values) => addItem(values)}
    />
  );
}
