import express from "express";
import { CommentsController } from "../controllers/comments.controller.js";
import jwt from "../middlewares/jwt.mdlwr.js";
import checkAdmin from "../middlewares/check-admin.mdlwr.js";

const initCommentsRoutes = (app) => {
    const commentsRouter = express.Router();

    commentsRouter.post("/", jwt, CommentsController.create);
    commentsRouter.get("/All/:reqRecipe_id", jwt, CommentsController.readAll);
    commentsRouter.put("/", jwt, checkAdmin, CommentsController.update);
    commentsRouter.delete("/:comment_id", jwt, checkAdmin, CommentsController.deleteOne);

    app.use("/comments", commentsRouter);
};

export default initCommentsRoutes;
