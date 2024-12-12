import { z } from "zod";
import { router, publicProcedure } from "../trpc";

const recipeBase = z.object({
  title: z.string(),
  notes: z.string(),
  link: z.string().optional(),
  photo: z.string().optional(),
  ingredients: z.array(z.string()),
  tags: z.array(z.string()),
});

const recipeUpdate = recipeBase
  .extend({
    id: z.string(),
  })
  .partial({
    title: true,
    notes: true,
    link: true,
    photo: true,
    ingredients: true,
    tags: true,
  });

export const recipeRouter = router({
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
        itemsToDelete: z.array(z.string()),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.recipe.deleteMany({
        where: {
          id: {
            in: input.itemsToDelete,
          },
        },
      });
    }),
});
