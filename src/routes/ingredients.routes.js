import express from "express";
import jwt from "../middlewares/jwt.mdlwr.js";
import checkAdmin from "../middlewares/check-admin.mdlwr.js";
import { IngredientsController } from "../controllers/ingredients.controller.js";

const initIngredientsRoutes = (app) => {
    const ingredientsRouter = express.Router();

    ingredientsRouter.get("/:ingredientId", jwt, IngredientsController.readOne); // OK

    //ingredientsRouter.get("/all", jwt, checkAdmin, IngredientsController.readAll); // A VOIR SI BESOIN

    ingredientsRouter.post("/", jwt, checkAdmin, IngredientsController.create); // OK (faire attention eviter plusieurs fois le meme ingredient)

    ingredientsRouter.put("/", jwt, checkAdmin, IngredientsController.update); // OK

    //ingredientsRouter.delete("/:ingredientId", jwt, checkAdmin, IngredientsController.deleteOne); // A VOIR SI BESOIN


    app.use("/ingredients", ingredientsRouter);
};

export default initIngredientsRoutes;
