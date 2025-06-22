// src/services/products.services.js
import MongoManager from "../dao/managers/mongo.manager.js";
import CartManager from "../dao/managers/cart.manager.js";
import crypto from "crypto";

import Product from "../dao/models/products.model.js";
import User from "../dao/models/users.model.js";
import Cart from "../dao/models/cart.model.js";
import Ticket from "../dao/models/ticket.model.js";
import logger from "../helpers/logger.helper.js";

const productsManager = new MongoManager(Product);
const usersManager = new MongoManager(User);
const ticketManager = new MongoManager(Ticket);
const cartsManager = new CartManager();
class Service {
  constructor(manager, model) {
    this.manager = manager;
    this.model = model;
  }

  createOne = async (data) => this.manager.createOne(data);
  readAll = async (filter) => this.manager.readAll(filter);
  readOne = async (obj) => this.manager.readOne(obj);
  readById = async (id) => this.manager.readById(id);
  updateOne = async (obj, data) => this.manager.updateOne(obj, data);
  updateById = async (id, data) => this.manager.updateById(id, data);
  destroyOne = async (obj) => this.manager.destroyOne(obj);
  destroyById = async (id) => this.manager.destroyById(id);
}

const productsServices = new Service(productsManager, Product);
const usersService = new Service(usersManager, User);

const cartsService = {
  ...new Service(cartsManager, Cart),
  readByIdWithPopulate: cartsManager.readByIdWithPopulate,
};

const baseTicketService = new Service(ticketManager, Ticket);

const ticketService = {
  ...baseTicketService,
  createFromCart: async (cid, user) => {
    logger.INFO("📦 Service → creando ticket desde carrito con cid:", cid);

    const carrito = await cartsService.readByIdWithPopulate(cid);
    if (!carrito || carrito.products.length === 0) {
      console.warn("⚠️ Carrito inválido o vacío.");
      return null;
    }

    let total = 0;
    const productosTicket = [];

    for (const item of carrito.products) {
      const producto = item.product;
      const cantidad = item.quantity;

      if (!producto) continue;

      if (producto.stock < cantidad) {
        throw new Error(`❌ Stock insuficiente para: ${producto.title}`);
      }

      producto.stock -= cantidad;
      await productsServices.updateById(producto._id, {
        stock: producto.stock,
      });

      total += producto.price * cantidad;
      productosTicket.push({
        title: producto.title,
        quantity: cantidad,
      });
    }

    const ticket = {
      code: crypto.randomUUID(),
      amount: total,
      purchaser: user?.email || "guest@fakemail.com",
      products: productosTicket,
      cartId: carrito._id,
    };

    carrito.products = [];
    await carrito.save();

    return await ticketManager.createOne(ticket);
  },
};

export { productsServices, usersService, cartsService, ticketService };
