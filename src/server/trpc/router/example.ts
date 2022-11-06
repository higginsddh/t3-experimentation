import { z } from "zod";

import { router, publicProcedure, protectedProcedure } from "../trpc";

export const exampleRouter = router({
  hello: publicProcedure
    .input(z.object({ text: z.string().nullish() }).nullish())
    .query(({ input }) => {
      return {
        greeting: `Hello ${input?.text ?? "world"}`,
      };
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),
  testMutate: protectedProcedure.mutation(({ ctx }) => {
    return ctx.prisma.example.create({
      data: {},
    });
  }),
  testGet: protectedProcedure.query(async ({ ctx }) => {
    const c = await ctx.prisma.example.count();
    return `Count: ${c}`;
  }),
});
