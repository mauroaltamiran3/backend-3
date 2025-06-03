import "dotenv/config.js";
import express from "express";
import dbConnect from "./src/helpers/dbConnect.helper.js";
import indexRouter from "./src/routers/index.router.js";
import pathHandler from "./src/middlewares/pathHandler.mid.js";

/* server settings */
const server = express();
const port = process.env.PORT || 8080;
const ready = async () => {
  console.log(`Server ready on port ${port}`);
  await dbConnect(process.env.LINK_DB);
};
server.listen(port, ready);

/* middlewares settings */
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(express.static("public"));

/* router settings */
server.use("/", indexRouter);
server.use(pathHandler);
