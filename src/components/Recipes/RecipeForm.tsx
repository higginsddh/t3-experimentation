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
  Anchor,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import ReceipeFormIngredients, {
  type Ingredient,
} from "./RecipeFormIngredients";
import type { RecipeBaseType } from "../../server/trpc/router/recipes";
import { useEffect, useRef, useState } from "react";
import { env } from "../../env/client.mjs";
import { ImagePreview } from "./ImagePreview";
import { NonBlockingLoader } from "../NonBlockingLoader";
import React from "react";

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
  const saveInProgress = fileUploading || saving;
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
                  <Anchor
                    component="button"
                    type="button"
                    c="red"
                    size="sm"
                    onClick={() => {
                      form.setValues({
                        photos: form
                          .getValues()
                          .photos.filter((u) => u !== photo),
                      });
                    }}
                  >
                    Remove
                  </Anchor>
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
              <NonBlockingLoader />
            )}

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
                disabled={saveInProgress}
              >
                Cancel
              </Button>
              <Button color="blue" type="submit" loading={saveInProgress}>
                Save
              </Button>
            </Flex>
          </Flex>
        </form>
      </Modal>
    </>
  );
}
