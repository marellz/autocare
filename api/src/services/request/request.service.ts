import type { NewRequest, Request } from "../../db/models/request.model";
import { RequestModel } from "../../db/sequelize";
class RequestService {
  static async findAll(where = {}) {
    const requests = await RequestModel.findAll({ where });
    return requests;
  }
  
  static async findOne(where = {}) {
    const requests = await RequestModel.findOne({ where });
    return requests;
  }

  static async findById(id: string) {
    const request = await RequestModel.findByPk(id);
    return request;
  }

  static async create(payload: NewRequest) {
    const request = await RequestModel.create(payload);
    return request;
  }

  static async update(id: string, data: Partial<Request>) {
    data.updatedAt = new Date();
    const request = await RequestModel.update(data, {
      where: { id },
    });
    return request;
  }

  static async destroy(id: string) {
    const request = await RequestModel.destroy({
      where: { id },
    });
    return request;
  }
}

export default RequestService;
