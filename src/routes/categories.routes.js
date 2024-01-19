import express from "express";
import jwt from "../middlewares/jwt.mdlwr.js";
import checkAdmin from "../middlewares/check-admin.mdlwr.js";
import { CategoriesController } from "../controllers/categories.controller.js";

const initCategoriesRoutes = (app) => {
    const categoriesRouter = express.Router();

    categoriesRouter.get("/all", CategoriesController.readAll);



    app.use("/categories", categoriesRouter);
};

export default initCategoriesRoutes;
