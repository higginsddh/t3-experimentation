import { router } from "../trpc";
import { authRouter } from "./auth";
import { shoppingListRouter } from "./shoppingList";

export const appRouter = router({
  shoppingList: shoppingListRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
