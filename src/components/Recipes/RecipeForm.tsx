"use client";

import {
  TextInput,
  Button,
  Modal,
  Flex,
  TagsInput,
  Stack,
  FileInput,
  Textarea,
  LoadingOverlay,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import ReceipeFormIngredients, {
  type Ingredient,
} from "./RecipeFormIngredients";
import type { RecipeBaseType } from "../../server/trpc/router/recipes";
import { useState } from "react";

type FormData = {
  title: string;
  tags: Array<string>;
  ingredients: Array<Ingredient>;
  link: string;
  notes: string;
  photo: string;
};

export function RecipeForm({
  initialValues,
  onClose,
  onSave,
  saving,
  errorMessage,
}: {
  initialValues: FormData;
  onClose: () => void;
  onSave: (values: RecipeBaseType) => void;
  saving: boolean;
  errorMessage: string | null;
}) {
  const form = useForm<FormData>({
    initialValues,
  });
  const [ingredients, setIngredients] = useState<Array<Ingredient>>(
    initialValues.ingredients,
  );

  form.watch("ingredients", (v) => setIngredients(v.value));
  return (
    <>
      <Modal opened={true} onClose={onClose} title="Add Recipe">
        <form
          onSubmit={form.onSubmit(() => {
            const values = form.getValues();
            onSave({
              ...values,
              ingredients: values.ingredients.map((i) => i.name),
            });
          })}
        >
          {saving ? (
            <LoadingOverlay visible overlayProps={{ blur: 2 }} />
          ) : null}

          <Stack gap="sm">
            <TextInput
              withAsterisk
              label="Title"
              required
              {...form.getInputProps("title")}
            />

            <ReceipeFormIngredients
              value={ingredients}
              onChange={(v) =>
                form.setValues({
                  ingredients: v,
                })
              }
            />

            <FileInput label="Photo" placeholder="Select photo of recipe" />

            <TagsInput
              {...form.getInputProps("tags")}
              label="Tags"
              data={["Seafood", "Vegetarian"]}
            />

            <TextInput
              label="Link"
              type="url"
              {...form.getInputProps("link")}
            />

            <Textarea label="Notes" {...form.getInputProps("notes")} />
          </Stack>

          <Flex justify="space-between" mt="md">
            <div>
              {(errorMessage ?? "") !== "" ? (
                <Text c="red">{errorMessage}</Text>
              ) : null}
            </div>
            <Flex justify="end" gap="md">
              <Button color="gray" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button color="blue" type="submit">
                Save
              </Button>
            </Flex>
          </Flex>
        </form>
      </Modal>
    </>
  );
}
