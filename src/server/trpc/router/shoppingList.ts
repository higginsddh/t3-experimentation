import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const shoppingListRouter = router({
  addItem: publicProcedure
    .input(z.object({ text: z.string(), quantity: z.number() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.shoppingListItem.create({
        data: {
          item: input.text,
          quantity: input.quantity,
          order: 0,
        },
      });
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.shoppingListItem.findMany();
  }),
});
