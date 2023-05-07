import { z } from "zod";
import type { Prisma } from "@prisma/client";
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

  deleteItems: publicProcedure
    .input(
      z.object({
        itemsToDelete: z.array(z.string()),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.shoppingListItem.deleteMany({
        where: {
          id: {
            in: input.itemsToDelete,
          },
        },
      });
    }),

  reorder: publicProcedure
    .input(
      z.object({
        id: z.string(),
        precedingId: z.string().nullable(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const shoppingListWhereInput: Array<Prisma.ShoppingListItemWhereInput> = [
        {
          id: input.id,
        },
      ];

      if (input.precedingId !== null) {
        shoppingListWhereInput.push({
          id: input.precedingId,
        });
      }

      const items = await ctx.prisma.shoppingListItem.findMany({
        where: {
          OR: shoppingListWhereInput,
        },
        select: {
          id: true,
          order: true,
        },
      });

      const itemMoving = items.find((i) => i.id === input.id);
      const newOrder =
        input.precedingId == null
          ? 0
          : (items.find((i) => i.id === input.precedingId)?.order ?? -1) + 1;

      if (itemMoving && itemMoving.order !== newOrder) {
        await ctx.prisma.shoppingListItem.updateMany({
          where: {
            order: {
              gt: itemMoving.order,
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
              gte: newOrder,
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
            order: newOrder,
          },
        });
      }
    }),
});
