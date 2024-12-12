import { router } from "../trpc";
import { authRouter } from "./auth";
import { recipeRouter } from "./recipes";
import { shoppingListRouter } from "./shoppingList";

export const appRouter = router({
  shoppingList: shoppingListRouter,
  recipes: recipeRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
