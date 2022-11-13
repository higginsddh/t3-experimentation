import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { shoppingListRouter } from "./shoppingList";

export const appRouter = router({
  example: exampleRouter,
  shoppingList: shoppingListRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
