import { productsServices } from "../services/products.services.js";

class Controller {
  constructor(service) {
    this.service = service;
  }

  createOne = async (req, res) => {
    const { method, originalUrl } = req;
    const data = req.body;
    const response = await this.service.createOne(data);
    return res.status(201).json({ response, method, originalUrl });
  };
  readAll = async (req, res) => {
    const { method, originalUrl } = req;
    const filter = req.query;
    const response = await this.service.readAll(filter);
    return res.status(200).json({ response, method, originalUrl });
  };
  readById = async (req, res) => {
    const { method, originalUrl } = req;
    const { id } = req.params;
    const response = await this.service.readById(id);

    return res.status(200).json({ response, method, originalUrl });
  };
  updateById = async (req, res) => {
    const { method, originalUrl } = req;
    const { id } = req.params;
    const { data } = req.body;
    const response = await this.service.updateById(id, data);
    return res.status(200).json({ response, method, originalUrl });
  };
  destroyById = async (req, res) => {
    const { method, originalUrl } = req;
    const { id } = req.params;
    const response = await this.service.destroyById(id);
    return res.status(200).json({ response, method, originalUrl });
  };
}

const productsController = new Controller(productsServices);
export { productsController };
