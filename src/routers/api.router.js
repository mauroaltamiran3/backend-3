import { Router } from "express";
import productsRouter from "./api/products.router.js";
import mocksRouter from "./api/mocks.router.js";
import usersRouter from "./api/users.router.js";
import authRouter from "./api/auth.router.js";
import { sumar } from "calculator-tuki-backend";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/products", productsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/mocks", mocksRouter);
apiRouter.get("/sumar/:n1/:n2", (req, res) => {
  const { n1, n2 } = req.params;
  res.status(200).json({ result: sumar(n1, n2) });
});
apiRouter.get("/sumar/pocos", (req, res) => {
  let total = 1;
  for (let i = 1; i < 100; i++) {
    total = total + i * i;
  }
  res.json({ total });
});
apiRouter.get("/sumar/muchos", (req, res) => {
  let total = 1;
  for (let i = 1; i < 10000000000; i++) {
    total = total + i * i;
  }
  res.json({ total });
});

export default apiRouter;
