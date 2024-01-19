import express from "express";
import jwt from "../middlewares/jwt.mdlwr.js";
import checkAdmin from "../middlewares/check-admin.mdlwr.js";
import { RecipesController } from "../controllers/recipes.controller.js";

const initRecipesRoutes = (app) => {
    const recipesRouter = express.Router();

    recipesRouter.get("/:recipeId", jwt, RecipesController.readOne); // OK

    recipesRouter.get("/all", jwt, checkAdmin, RecipesController.readAll); // A VOIR SI BESOIN

    recipesRouter.post("/", jwt, checkAdmin, RecipesController.create); // OK (mais il faut qu'on ne puisse pas créer les memes recettes tester differents possibilites)

    recipesRouter.put("/", jwt, checkAdmin, RecipesController.update); // OK (mais faire attention Revoir aletre message quand il y a un champs incorrect)

    recipesRouter.delete("/:recipeId", jwt, checkAdmin, RecipesController.deleteOne);


    app.use("/recipes", recipesRouter);
};

export default initRecipesRoutes;
