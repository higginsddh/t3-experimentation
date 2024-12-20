import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import type { Prisma, PrismaClient } from "@prisma/client";
import { env } from "../../../env/server.mjs";
import cloudinary from "cloudinary";

const recipeBase = z.object({
  title: z.string().min(1),
  notes: z.string(),
  link: z.string().optional(),
  photo: z.string().optional(),
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
  photo: true,
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
        input.photo === null ||
        input.photo === "" ||
        input.photo !== originalItem?.photo
      ) {
        await deleteImageIfSet(ctx.prisma, input);
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
      await deleteImageIfSet(ctx.prisma, input);

      await ctx.prisma.recipe.deleteMany({
        where: {
          id: {
            equals: input.id,
          },
        },
      });
    }),
});

async function deleteImageIfSet(
  prismaClient: PrismaClient<Prisma.PrismaClientOptions, never>,
  input: {
    id: string;
  },
) {
  const originalItem = await prismaClient.recipe.findFirst({
    where: {
      id: input.id,
    },
  });

  if (originalItem?.photo) {
    cloudinary.v2.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_KEY,
      api_secret: env.CLOUDINARY_SECRET,
    });

    await cloudinary.v2.uploader.destroy(originalItem.photo);
  }
}
