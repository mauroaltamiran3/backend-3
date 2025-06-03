import { productsManager } from "../dao/managers/mongo.manager";

class Service {
  constructor(manager) {
    this.manager = manager;
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

const productsServices = new Service(productsManager);
export { productsServices };
