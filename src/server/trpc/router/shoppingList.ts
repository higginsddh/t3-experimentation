import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const shoppingListRouter = router({
  addItem: publicProcedure
    .input(z.object({ text: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.shoppinglistitem.create({
        data: {
          item: input.text,
        },
      });
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.shoppinglistitem.findMany();
  }),
});
