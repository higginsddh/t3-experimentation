import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import type { Prisma, PrismaClient } from "@prisma/client";
import { env } from "../../../env/server.mjs";
import type { Container } from "@azure/cosmos";
import { CosmosClient } from "@azure/cosmos";
import cloudinary from "cloudinary";

const recipeBase = z.object({
  title: z.string().min(1),
  notes: z.string(),
  link: z.string().optional(),
  photos: z.array(z.string()),
  ingredients: z.array(z.string()),
  tags: z.array(z.string()),
});

export type RecipeBaseType = z.infer<typeof recipeBase>;

const recipeExisting = recipeBase.extend({
  id: z.string(),
});

const recipeUpdate = recipeExisting.partial({
  title: true,
  notes: true,
  link: true,
  photos: true,
  ingredients: true,
  tags: true,
});

export const recipeRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const recipes = await ctx.prisma.recipe.findMany({
      orderBy: [
        {
          title: "asc",
        },
      ],
    });

    return recipes as Array<z.infer<typeof recipeExisting>>;
  }),

  addRecipe: publicProcedure
    .input(recipeBase)
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.recipe.create({
        data: {
          ...input,
        },
      });
    }),

  updateRecipe: publicProcedure
    .input(recipeUpdate)
    .mutation(async ({ input, ctx }) => {
      const originalItem = await ctx.prisma.recipe.findFirst({
        where: {
          id: input.id,
        },
      });

      if (
        originalItem?.photos &&
        typeof originalItem.photos === "object" &&
        Array.isArray(originalItem.photos)
      ) {
        const originalPhotos = originalItem.photos as Prisma.JsonArray;

        for (let i = 0; i < originalPhotos.length; i++) {
          const originalPhoto = originalPhotos[i] as string;
          if (!input.photos || !input.photos.includes(originalPhoto)) {
            await deleteImageIfSet(ctx.prisma, input, originalPhoto);
          }
        }
      }

      await ctx.prisma.recipe.update({
        where: {
          id: input.id,
        },
        data: {
          ...input,
        },
      });
    }),

  deleteRecipe: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const originalItem = await ctx.prisma.recipe.findFirst({
        where: {
          id: input.id,
        },
      });

      if (
        originalItem?.photos &&
        typeof originalItem.photos === "object" &&
        Array.isArray(originalItem.photos)
      ) {
        const originalPhotos = originalItem.photos as Prisma.JsonArray;

        for (let i = 0; i < originalPhotos.length; i++) {
          const originalPhoto = originalPhotos[i] as string;
          await deleteImageIfSet(ctx.prisma, input, originalPhoto);
        }
      }

      await ctx.prisma.recipe.deleteMany({
        where: {
          id: {
            equals: input.id,
          },
        },
      });
    }),

  importRecipes: publicProcedure.mutation(async ({ ctx }) => {
    const originalRecipes = await getRecipes();
    for (let i = 0; i < originalRecipes.length; i++) {
      const originalRecipe = originalRecipes[i];
      if (!!originalRecipe) {
        await ctx.prisma.recipe.create({
          data: {
            title: originalRecipe.title,
            notes: originalRecipe.notes,
            ingredients: originalRecipe.ingredients?.map((i) => i.name) ?? [],
            photos: originalRecipe.files?.map((f) => f.url) ?? [],
            tags: originalRecipe.tags?.map((t) => t.name) ?? [],
            link: originalRecipe.link,
          },
        });
      }
    }
  }),

  addToShoppingList: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const originalItem = await ctx.prisma.recipe.findFirst({
        where: {
          id: input.id,
        },
      });

      if (originalItem && originalItem.ingredients) {
        const ingredients = originalItem.ingredients as Prisma.JsonArray;

        if (ingredients.length > 0) {
          const currentList = await ctx.prisma.shoppingListItem.findMany({
            orderBy: [
              {
                order: "asc",
              },
            ],
          });
          const currentMaxOrder = currentList.reduce((acc, listItem) => {
            if (listItem.order > acc) {
              return listItem.order;
            } else {
              return acc;
            }
          }, 0);
          let addCount = 0;
          for (let i = 0; i < ingredients.length; i++) {
            const ingredient = ingredients[i] as string;
            const existingItem = currentList.find(
              (listItem) =>
                listItem.text?.toLowerCase() === ingredient.toLowerCase(),
            );
            if (existingItem) {
              await ctx.prisma.shoppingListItem.update({
                data: {
                  quantity: existingItem.quantity + 1,
                },
                where: {
                  id: existingItem.id,
                },
              });
            } else {
              await ctx.prisma.shoppingListItem.create({
                data: {
                  text: ingredient,
                  quantity: 1,
                  order: currentMaxOrder + 1 + addCount,
                },
              });
              addCount++;
            }
          }
        }
      }
    }),
});

async function deleteImageIfSet(
  prismaClient: PrismaClient<Prisma.PrismaClientOptions, never>,
  input: {
    id: string;
  },
  photo: string,
) {
  if (photo) {
    cloudinary.v2.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_KEY,
      api_secret: env.CLOUDINARY_SECRET,
    });

    await cloudinary.v2.uploader.destroy(photo);
  }
}

let container: Container | null = null;
async function getContainer() {
  if (container) {
    return container;
  }

  const client = new CosmosClient(
    "AccountEndpoint=https://restauranttracker.documents.azure.com:443/;AccountKey=82ZvKAIecGTIR9dE0V19rAirHcJmhG9UheCDWyshfO61CCSaIkDVnxZwII8Ovys3qhnijMm8BVxjaV2r9QIfWw==;",
  );
  const { database } = await client.databases.createIfNotExists({
    id: "RestaurantTracker",
  });
  const r = await database.containers.createIfNotExists({
    id: "Recipes",
  });
  container = r.container;

  return container;
}

export type CosmosBase = {
  type: string;
};

export type CosmosRecipe = {
  title: string;
  notes: string;
  ingredients?: Array<{ id: string; name: string }>;
  files?: Array<{ url: string; id: string }>;
  tags?: Array<{ name: string }>;
  link?: string;
} & CosmosBase;

async function getRecipes() {
  const container = await getContainer();

  const { resources } = await container.items
    .query("SELECT * FROM c WHERE c.type = 'recipe'")
    .fetchAll();

  return resources as Array<CosmosRecipe>;
}
