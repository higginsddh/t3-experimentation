import { z } from "zod";

import { router, publicProcedure } from "../trpc";

const shoppingListBase = z.object({
  text: z.string(),
  quantity: z.number(),
  order: z.number().optional(),
  purchased: z.boolean().optional(),
});

const shoppingListUpdate = shoppingListBase
  .extend({
    id: z.string(),
  })
  .partial({
    order: true,
    quantity: true,
    text: true,
  });

export const shoppingListRouter = router({
  addItem: publicProcedure
    .input(shoppingListBase)
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.shoppingListItem.updateMany({
        data: {
          order: {
            increment: 1,
          },
        },
      });

      return await ctx.prisma.shoppingListItem.create({
        data: {
          text: input.text,
          quantity: input.quantity,
          order: 0,
        },
      });
    }),

  updateItem: publicProcedure
    .input(shoppingListUpdate)
    .mutation(({ input, ctx }) => {
      return ctx.prisma.shoppingListItem.update({
        where: {
          id: input.id,
        },
        data: {
          ...input,
        },
      });
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.shoppingListItem.findMany({
      orderBy: [
        {
          order: "asc",
        },
      ],
    });
  }),

  reorder: publicProcedure
    .input(
      z.object({
        id: z.string(),
        newOrder: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const item = await ctx.prisma.shoppingListItem.findFirst({
        where: {
          id: input.id,
        },
      });

      if (item && item.order !== input.newOrder) {
        await ctx.prisma.shoppingListItem.updateMany({
          where: {
            order: {
              gte: item.order,
            },
          },
          data: {
            order: {
              decrement: 1,
            },
          },
        });

        await ctx.prisma.shoppingListItem.updateMany({
          where: {
            order: {
              gte: input.newOrder,
            },
          },
          data: {
            order: {
              increment: 1,
            },
          },
        });

        await ctx.prisma.shoppingListItem.update({
          where: {
            id: input.id,
          },
          data: {
            order: input.newOrder,
          },
        });
      }
    }),
});
