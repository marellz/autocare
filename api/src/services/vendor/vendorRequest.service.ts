import { VendorRequestModel } from "../../db/sequelize";
import type { NewVendorRequest, VendorRequest } from "../../db/models/vendorRequest.model";

class VendorRequestService {
  static async findAll(where = {}) {
    return await VendorRequestModel.findAll({
      where,
    });
  }

  static async create(payload: NewVendorRequest) {
    return await VendorRequestModel.create(payload);
  }

  static async findById(id: string) {
    return await VendorRequestModel.findByPk(id);
  }

  static async update(id: string, data: Partial<VendorRequest>) {
    const vendorRequest = await VendorRequestModel.update(data, {
      where: { id },
    });
    
    return vendorRequest;
  }
}

export default VendorRequestService;
