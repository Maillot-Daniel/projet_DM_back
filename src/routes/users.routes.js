import express from "express";
import jwt from "../middlewares/jwt.mdlwr.js";
//import checkAdmin from "../middlewares/check-admin.mdlwr.js";
import { UsersController } from "../controllers/users.controller.js";

const initUsersRoutes = (app) => {
    const router = express.Router();

    router.post("/", UsersController.create); // OK
    router.post("/sign-in", UsersController.signIn); // OK

    router.get("/:userId", jwt, UsersController.readUserById); // OK
    //router.get("/allUsers", jwt, checkAdmin, UsersController.readAllUsers); // A VOIR

    router.put("/:userId", jwt, UsersController.update); // OK

    router.delete("/:userId", jwt, UsersController.deleteOne); // OK



    app.use("/users", router);
};

export default initUsersRoutes;
