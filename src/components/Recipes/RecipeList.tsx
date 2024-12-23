import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  Card,
  Flex,
  Group,
  LoadingOverlay,
  Text,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconEdit,
  IconPhoto,
  IconTrash,
} from "@tabler/icons-react";
import { trpc } from "../../utils/trpc";
import { modals } from "@mantine/modals";
import { useDisclosure } from "@mantine/hooks";
import { RecipeFormUpdate } from "./RecipeFormUpdate";
import { Cloudinary } from "@cloudinary/url-gen";
import { env } from "../../env/client.mjs";
import { NonBlockingLoader } from "../NonBlockingLoader";
import { Fragment } from "react";

export function RecipeList() {
  const {
    data: items,
    isInitialLoading: isLoadingItems,
    isError: isErrorFetchingItems,
  } = trpc.recipes.getAll.useQuery(undefined, {});
  const utils = trpc.useUtils();

  const { mutate: addToShoppingList, isLoading: addingItems } =
    trpc.recipes.addToShoppingList.useMutation({
      onSettled: () => {
        utils.shoppingList.getAll.invalidate();
      },
    });

  const cld = new Cloudinary({
    cloud: {
      cloudName: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    },
  });

  return (
    <>
      {addingItems ? <NonBlockingLoader /> : null}

      {isLoadingItems ? (
        <LoadingOverlay visible overlayProps={{ blur: 2 }} />
      ) : null}

      {isErrorFetchingItems ? (
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Error!"
          color="red"
          radius="md"
        >
          The recipes were not unable to load. Please try again!
        </Alert>
      ) : (
        <>
          {items?.map((item) => {
            return (
              <Card withBorder key={item.id} mb={"lg"}>
                <Flex justify="space-between" mb="xs">
                  <Group>
                    <Text fw={500}>
                      {(item.link?.trim() ?? "") !== "" ? (
                        <a href={item.link} target="_blank">
                          {item.title}
                        </a>
                      ) : (
                        item.title
                      )}
                    </Text>
                    {item.photos.map((p) => {
                      let url: string | null = null;
                      if (p) {
                        const myImage = cld.image(p);
                        url = myImage.toURL();
                      }

                      return (
                        <Fragment key={p}>
                          {url ? (
                            <ActionIcon
                              component="a"
                              href={url}
                              target="_blank"
                              variant="subtle"
                              color="blue"
                            >
                              <IconPhoto />
                            </ActionIcon>
                          ) : null}
                        </Fragment>
                      );
                    })}
                  </Group>
                  <Group gap="xs">
                    <EditRecipe id={item.id} />

                    <DeleteRecipe id={item.id} title={item.title} />
                  </Group>
                </Flex>
                <Group mb="xs">{item.notes}</Group>
                <Flex justify="space-between">
                  <Group>
                    {item.tags.map((tag) => (
                      <Badge color="red" variant="light" key={tag}>
                        {tag}
                      </Badge>
                    ))}
                  </Group>
                  <Button
                    size="xs"
                    variant="light"
                    radius="lg"
                    onClick={() => {
                      addToShoppingList({
                        id: item.id,
                      });
                    }}
                  >
                    Add to shopping list
                  </Button>
                </Flex>
              </Card>
            );
          })}
        </>
      )}
    </>
  );
}

function EditRecipe({ id }: { id: string }) {
  const [opened, handlers] = useDisclosure(false);

  return (
    <>
      <ActionIcon variant="subtle" color="gray">
        <IconEdit onClick={() => handlers.open()} />
      </ActionIcon>

      {opened ? (
        <RecipeFormUpdate id={id} onClose={() => handlers.close()} />
      ) : null}
    </>
  );
}

function DeleteRecipe({ id, title }: { id: string; title: string }) {
  const utils = trpc.useUtils();

  const { mutate: deleteRecipe } = trpc.recipes.deleteRecipe.useMutation({
    onSettled: () => {
      utils.recipes.getAll.invalidate();
    },
  });
  const openModal = () =>
    modals.openConfirmModal({
      withCloseButton: false,
      children: (
        <Text>
          Are you sure you want to delete <strong>{title}</strong>?
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      onConfirm: () => {
        deleteRecipe({
          id,
        });
      },
    });

  return (
    <>
      <ActionIcon variant="subtle" color="gray">
        <IconTrash onClick={openModal} />
      </ActionIcon>
    </>
  );
}
