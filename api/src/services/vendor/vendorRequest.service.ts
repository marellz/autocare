import {
  RequestModel,
  // RequestModel,
  VendorModel,
  VendorRequestModel,
} from "../../db/sequelize";
import type {
  NewVendorRequest,
  VendorRequest,
} from "../../db/models/vendorRequest.model";
import { WhereOptions } from "sequelize";
class VendorRequestService {
  /**
   * WHERE FINDING ALL:
   *
   * FINDING:
   * - vendorId
   * - requestId,
   * - vendor.phone
   * - request.phone
   */

  static async findPendingVendorRequests(phone: string) {
    const vendors = await VendorRequestModel.findAll({
      where: { price: null, condition: null },
      include: [
        {
          model: VendorModel,
          where: {
            phone, // You could also use { [Op.is]: null }
          },
          required: true,
        },
        {
          model: RequestModel,
          required: true,
          where: { status: "pending" },
        },
      ],
    });

    return vendors;
  }

  static async findOne(where: {
    vendorId?: string;
    requestId?: string;
    status?: string;
  }) {
    // find vendorRequests where vendorPhone === phone
    const vendorRequest = await VendorRequestModel.findOne({
      where: {
        ...where,
      },
      include: [
        VendorModel,
        RequestModel
      ]
    });

    return vendorRequest;
  }

  static async findAll(where: WhereOptions<VendorRequest>) {
    // find vendorRequests where vendorPhone === phone
    // find where price === null && condition === null && availability === null
    const vendorRequests = await VendorRequestModel.findAll({
      where: {
        ...where,
      },
      include: [VendorModel, RequestModel],
    });

    return vendorRequests;
  }

  static async create(payload: NewVendorRequest) {
    return await VendorRequestModel.create(payload);
  }

  static async findById(id: string) {
    return await VendorRequestModel.findByPk(id);
  }

  static async update(id: number | string, data: Partial<VendorRequest>) {
    const vendorRequest = await VendorRequestModel.update(data, {
      where: { id },
    });

    return vendorRequest;
  }
}

export default VendorRequestService;
