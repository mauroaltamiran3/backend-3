import CustomRouter from "../../helpers/CustomRouter.helper.js";
import { productsController } from "../../controllers/controller.js";

// const productsRouter = Router();
class ProductsRouter extends CustomRouter {
  constructor() {
    super();
    this.init();
  }
  init = () => {
    this.create("/", ["PUBLIC"], productsController.createOne);
    this.read("/", ["PUBLIC"], productsController.readAll);
    this.read("/:id", ["PUBLIC"], productsController.readById);
    this.update("/:id", ["ADMIN"], productsController.updateById);
    this.destroy("/:id", ["ADMIN"], productsController.destroyById);
  };
}

const productsRouter = new ProductsRouter();

export default productsRouter.getRouter();
