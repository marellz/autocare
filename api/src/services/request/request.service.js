import { RequestModel } from "#db/sequelize.js";

class RequestService {
  static async findAll(where = {}) {
    const requests = await RequestModel.findAll({ where });
    return requests;
  }
  
  static async findOne(where = {}) {
    const requests = await RequestModel.findOne({ where });
    return requests;
  }

  static async findById(id) {
    const request = await RequestModel.findByPk(id);
    return request;
  }

  static async create(payload) {
    const request = await RequestModel.create(payload);
    return request;
  }

  static async update(id, data) {
    console.log({ id, data });
    const request = await RequestModel.update(data, {
      where: { id },
    });
    return request;
  }

  static async delete(id) {
    const request = await RequestModel.destroy({
      where: { id },
    });
    return request;
  }
}

export default RequestService;
