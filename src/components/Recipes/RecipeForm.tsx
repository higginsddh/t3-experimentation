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
  Text,
  Group,
  Center,
  Loader,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import ReceipeFormIngredients, {
  type Ingredient,
} from "./RecipeFormIngredients";
import type { RecipeBaseType } from "../../server/trpc/router/recipes";
import { useEffect, useRef, useState } from "react";
import { env } from "../../env/client.mjs";
import { ImagePreview } from "./ImagePreview";
import React from "react";
import { trpc } from "../../utils/trpc";

type FormData = {
  title: string;
  tags: Array<string>;
  ingredients: Array<Ingredient>;
  link: string;
  notes: string;
  photos: Array<string>;
};

const width = 250;
export function RecipeForm({
  initialValues,
  onClose,
  onSave,
  saving,
  errorMessage,
  title,
}: {
  initialValues: FormData;
  onClose: () => void;
  onSave: (values: RecipeBaseType) => void;
  saving: boolean;
  errorMessage: string | null;
  title: string;
}) {
  const form = useForm<FormData>({
    initialValues,
  });
  const [ingredients, setIngredients] = useState<Array<Ingredient>>(
    initialValues.ingredients,
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: existingRecipes } = trpc.recipes.getAll.useQuery(undefined, {});
  const availableTags = getAvailableTags(existingRecipes);

  const [fileUploading, setFileUploading] = useState(false);

  useEffect(() => {
    if (form.getValues().title === "") {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      });
    }
  }, [form]);

  form.watch("ingredients", (v) => setIngredients(v.value));

  return (
    <>
      <Modal opened={true} onClose={onClose} title={title}>
        <form
          onSubmit={form.onSubmit(() => {
            const values = form.getValues();
            const payload = {
              ...values,
              ingredients: values.ingredients.map((i) => i.name),
            };

            onSave(payload);
          })}
        >
          <Stack gap="sm">
            <TextInput
              withAsterisk
              label="Title"
              required
              ref={inputRef}
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

            <Textarea label="Notes" {...form.getInputProps("notes")} />

            {form.getValues().photos.map((photo) => (
              <React.Fragment key={photo}>
                <Group>
                  <ImagePreview imagePath={photo} width={width} />
                </Group>
                <Center style={{ width }}>
                  <Button
                    size="sm"
                    variant="outline"
                    color="red"
                    onClick={() => {
                      form.setValues({
                        photos: form
                          .getValues()
                          .photos.filter((u) => u !== photo),
                      });
                    }}
                  >
                    Remove
                  </Button>
                </Center>
              </React.Fragment>
            ))}

            {!fileUploading ? (
              <FileInput
                label="Photo"
                placeholder="Add photo of recipe"
                accept="image/*"
                onChange={(file) => {
                  if (file) {
                    setFileUploading(true);
                    const fileData = new FormData();
                    fileData.append("file", file);
                    fileData.append(
                      "upload_preset",
                      env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
                    );
                    fileData.append(
                      "cloud_name",
                      env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                    );
                    fetch(
                      `https://api.cloudinary.com/v1_1/${env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                      {
                        method: "post",
                        body: fileData,
                      },
                    )
                      .then((resp) => resp.json())
                      .then((data) => {
                        setFileUploading(false);
                        const publicId = data.public_id as string;
                        form.setValues({
                          photos: [...form.getValues().photos, publicId],
                        });
                      })
                      .catch((err) => {
                        setFileUploading(false);

                        // TODO:
                        console.log(err);
                      });
                  }
                }}
              />
            ) : (
              <Loader />
            )}

            <TagsInput
              {...form.getInputProps("tags")}
              label="Tags"
              data={availableTags}
            />

            <TextInput
              label="Link"
              type="url"
              {...form.getInputProps("link")}
            />
          </Stack>

          <Flex justify="space-between" mt="md">
            <div>
              {(errorMessage ?? "") !== "" ? (
                <Text c="red">{errorMessage}</Text>
              ) : null}
            </div>
            <Flex justify="end" gap="md">
              <Button
                color="gray"
                type="button"
                onClick={onClose}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button color="blue" type="submit" loading={saving}>
                Save
              </Button>
            </Flex>
          </Flex>
        </form>
      </Modal>
    </>
  );
}

function getAvailableTags(recipes: Array<{ tags: Array<string> }> | undefined) {
  if (!recipes) {
    return [];
  }

  const distinctList: Array<string> = [];
  recipes.forEach((r) => {
    r.tags.forEach((t) => {
      if (!distinctList.some((l) => l.toLowerCase() === t.toLowerCase())) {
        distinctList.push(t);
      }
    });
  });

  return distinctList;
}
