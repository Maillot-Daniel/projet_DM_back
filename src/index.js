import express from "express";
import initMiddlewares from "./middlewares/init.mdlwr.js";
import initRoutes from "./routes/init.routes.js";

const app = express();
const PORT = process.env.PORT;

initMiddlewares(app)
initRoutes(app)

app.listen(PORT, () => {
    console.log("Server is running on port ", PORT);
});
