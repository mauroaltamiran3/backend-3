import { Router } from "express";
import { productsController } from "../../controllers/controller.js";

const productsRouter = Router();

productsRouter.post("/", productsController.createOne);
productsRouter.get("/", productsController.readAll);
productsRouter.get("/:id", productsController.readById);
productsRouter.put("/:id", productsController.updateById);
productsRouter.delete("/:id", productsController.destroyById);

export default productsRouter;
