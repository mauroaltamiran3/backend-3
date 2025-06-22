import {
  productsServices,
  usersService,
  cartsService,
  ticketService,
} from "../services/products.services.js";
import CustomError from "../helpers/errors/CustomError.js";
import errors from "../helpers/errors/errors.js";
import logger from "../helpers/logger.helper.js";

class Controller {
  constructor(service) {
    this.service = service;
  }

  createOne = async (req, res) => {
    const data = req.body;
    const response = await this.service.createOne(data);
    res.json201(response);
  };

  readAll = async (req, res) => {
    const filter = req.query;
    const response = await this.service.readAll(filter);
    if (response.length === 0) return res.json404();
    res.json200(response);
  };

  readById = async (req, res) => {
    const { id } = req.params;
    const response = await this.service.readById(id);
    if (!response) return res.json404();
    res.json200(response);
  };

  updateById = async (req, res) => {
    const { id } = req.params;
    const { data } = req.body;
    const response = await this.service.updateById(id, data);
    if (!response) return res.json404();
    res.json200(response);
  };

  destroyById = async (req, res) => {
    const { id } = req.params;
    const response = await this.service.destroyById(id);
    if (!response) return res.json404();
    res.json200(response);
  };

  updateStockById = async (req, res) => {
    try {
      const { id } = req.params;
      const { operacion } = req.body;
      const producto = await this.service.readById(id);
      if (!producto)
        return res.status(404).json({ mensaje: "Producto no encontrado" });

      if (operacion === "incrementar") producto.stock += 1;
      else if (operacion === "reducir" && producto.stock > 0)
        producto.stock -= 1;

      await producto.save();
      res.json({ mensaje: "Stock actualizado", stock: producto.stock });
    } catch (error) {
      logger.ERROR("Error al actualizar stock: " + error.message);
      res.status(500).json({
        mensaje: "Error al actualizar stock",
        detalles: error.message,
      });
    }
  };

  createFromCart = async (req, res) => {
    const { cid } = req.params;
    const user = req.user;
    logger.INFO("🧑 Usuario autenticado: " + JSON.stringify(req.user));
    try {
      logger.INFO(
        "🎯 TicketController → createFromCart alcanzado con cid: " + cid
      );
      const result = await this.service.createFromCart(cid, user);
      if (!result)
        return res.status(400).json({ mensaje: "No se pudo crear el ticket" });

      res.json201({
        mensaje: "Ticket generado correctamente",
        ticketId: result._id,
      });
    } catch (error) {
      logger.ERROR("❌ Error al crear ticket desde carrito: " + error.message);
      res.status(500).json({
        mensaje: "Error interno",
        detalles: error.message,
      });
    }
  };
}

export default Controller;

const productsController = new Controller(productsServices);
const usersController = new Controller(usersService);
const cartsController = new Controller(cartsService);
const ticketController = new Controller(ticketService);

export {
  productsController,
  usersController,
  cartsController,
  ticketController,
};
