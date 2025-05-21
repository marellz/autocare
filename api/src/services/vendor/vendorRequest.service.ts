import { VendorRequestModel } from "#db/sequelize.js";

class VendorRequestService {
  static async findAll(where = {}) {
    return await VendorRequestModel.findAll({
      where,
    });
  }

  static async create(payload) {
    return await VendorRequestModel.create(payload);
  }

  static async findById(id) {
    return await VendorRequestModel.findByPk(id);
  }

  static async update(id, data) {
    const vendorRequest = await VendorRequestModel.update(data, {
      where: { id },
    });
    
    return vendorRequest;
  }
}

export default VendorRequestService;
