import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import type { Prisma } from "@prisma/client";
import { env } from "../../../env/server.mjs";
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
            await deleteImageIfSet(originalPhoto);
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
          await deleteImageIfSet(originalPhoto);
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

async function deleteImageIfSet(photo: string) {
  if (photo) {
    cloudinary.v2.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_KEY,
      api_secret: env.CLOUDINARY_SECRET,
    });

    await cloudinary.v2.uploader.destroy(photo);
  }
}
