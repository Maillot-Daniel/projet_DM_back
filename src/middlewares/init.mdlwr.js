import cors from "cors";
import helmet from "helmet";
import express from "express";

const initMiddlewares = (app) => {
  app.use(express.json()); // for parsing application/json
  app.use(express.urlencoded({ extended: true }));
  // permet à toutes les urls de fetch le serveur
  app.use(cors({ origin: "*" }));

  // necessaire pour des questions de sécurités
  app.use(helmet());
};

export default initMiddlewares;
