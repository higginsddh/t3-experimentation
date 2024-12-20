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

type FormData = {
  title: string;
  tags: Array<string>;
  ingredients: Array<Ingredient>;
  link: string;
  notes: string;
  photo: string;
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

  const [imagePath, setImagePath] = useState<string | null>(
    initialValues.photo,
  );
  const [file, setFile] = useState<File | null>(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState<
    string | null
  >(null);

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
      {fileUploading ? <LoadingOverlay visible zIndex={1500} /> : null}

      <Modal opened={true} onClose={onClose} title={title}>
        <form
          onSubmit={form.onSubmit(() => {
            const values = form.getValues();
            const payload = {
              ...values,
              ingredients: values.ingredients.map((i) => i.name),
            };

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
                  onSave({
                    ...payload,
                    photo: publicId,
                  });
                })
                .catch((err) => {
                  setFileUploading(true);

                  // TODO:
                  console.log(err);
                });
            } else {
              onSave(payload);
            }
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

            {imagePath || selectedImagePreview ? (
              <>
                <Group>
                  {selectedImagePreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={selectedImagePreview}
                      width={width}
                      alt="Image Preview"
                    />
                  ) : imagePath ? (
                    <ImagePreview imagePath={imagePath} width={width} />
                  ) : null}
                </Group>
                <Center style={{ width }}>
                  <Anchor
                    component="button"
                    type="button"
                    c="red"
                    size="sm"
                    onClick={() => {
                      setSelectedImagePreview(null);
                      setImagePath(null);
                      form.setValues({
                        photo: "",
                      });
                    }}
                  >
                    Remove
                  </Anchor>
                </Center>
              </>
            ) : null}

            <FileInput
              label="Photo"
              placeholder="Select photo of recipe"
              accept="image/*"
              onChange={(f) => {
                setFile(f);

                if (f) {
                  setSelectedImagePreview(URL.createObjectURL(f));
                } else {
                  setSelectedImagePreview(null);
                }
              }}
            />

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
