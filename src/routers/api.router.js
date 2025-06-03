import { Router } from "express";
import productsRouter from "./api/products.router.js";

const apiRouter = Router();

apiRouter.use("/products", productsRouter);

export default apiRouter;
