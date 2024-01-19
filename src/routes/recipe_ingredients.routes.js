import express from "express";
import { Recipe_ingredientsController } from "../controllers/recipe_ingredients.controller.js";
import jwt from "../middlewares/jwt.mdlwr.js";
import checkAdmin from "../middlewares/check-admin.mdlwr.js";

const initRecipeIngredientsRoutes = (app) => {
    const recipe_ingredientsRouter = express.Router();

    recipe_ingredientsRouter.post("/", jwt, checkAdmin, Recipe_ingredientsController.create);
    recipe_ingredientsRouter.get("/All/:reqRecipe_id", jwt, Recipe_ingredientsController.readAll);
    recipe_ingredientsRouter.put("/", jwt, checkAdmin, Recipe_ingredientsController.update);
    recipe_ingredientsRouter.delete("/:recipe_ingredients_id", jwt, checkAdmin, Recipe_ingredientsController.deleteOne);

    app.use("/recipe_ingredients", recipe_ingredientsRouter);
};

export default initRecipeIngredientsRoutes;
