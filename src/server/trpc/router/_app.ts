import { router } from "../trpc";
import { recipeRouter } from "./recipes";
import { shoppingListRouter } from "./shoppingList";

export const appRouter = router({
  shoppingList: shoppingListRouter,
  recipes: recipeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
