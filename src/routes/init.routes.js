import initRecipesRoutes from "./recipes.routes.js";
import initCategoriesRoutes from "./categories.routes.js";
import initCommentsRoutes from "./comments.routes.js";
import initUsersRoutes from "./users.routes.js";
import initIngredientsRoutes from "./ingredients.routes.js";
import initRecipeIngredientsRoutes from "./recipe_ingredients.routes.js";

const initRoutes = (app) => {
  initRecipesRoutes(app);
  initCategoriesRoutes(app);
  initCommentsRoutes(app);
  initUsersRoutes(app);
  initIngredientsRoutes(app);
  initRecipeIngredientsRoutes(app);
};

export default initRoutes;
