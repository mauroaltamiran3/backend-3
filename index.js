import "./src/helpers/env.js";
import express from "express";
import cookieParser from "cookie-parser";
import compression from "express-compression";
import cluster from "cluster";
import { cpus } from "os";
import { serve, setup } from "swagger-ui-express";
import swaggerSpecs from "./src/helpers/swagger.helper.js";
import dbConnect from "./src/helpers/dbConnect.helper.js";
import indexRouter from "./src/routers/index.router.js";
import winston from "./src/middlewares/winston.mid.js";
import errorHandler from "./src/middlewares/errorHandler.mid.js";
import pathHandler from "./src/middlewares/pathHandler.mid.js";
import argvs from "./src/helpers/arguments.helper.js";
import logger from "./src/helpers/logger.helper.js";

/* server settings */
const server = express();
const port = process.env.PORT || 8080;
const ready = async () => {
  logger.INFO(`Server ready on port ${port} and mode ${argvs.mode}`);
  logger.INFO("server ready on pid " + process.pid);
  await dbConnect(process.env.LINK_DB);
};
server.listen(port, ready);

/* middlewares settings */
server.use(
  compression({
    brotli: { enable: true, zlib: {} },
  })
);
server.use(cookieParser());
server.use(express.json());
server.use(winston);
server.use(express.urlencoded({ extended: true }));
server.use(express.static("public"));

/* router settings */
server.use("/", indexRouter);
server.use(errorHandler);
server.use(pathHandler);

server._router?.stack?.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(`🛣️ Ruta activa: ${r.route.path}`);
  }
});
