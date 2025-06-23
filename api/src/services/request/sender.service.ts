import { Request } from "../../db/models/request.model";
import VendorService from "../vendor/vendor.service";
import VendorRequestService from "../vendor/vendorRequest.service";
import { InteractionTypes } from "../../db/models/interaction.model";
import { sendMessageAndLogInteraction } from "../notification/notify.service";
import { VendorRequestStatusEnum } from "../../db/models/vendorRequest.model";

export const sendRequestToVendors = async (request: Request) => {
  const requestBrand = request.capturedDetails.carBrand;
  if (!requestBrand) return; // todo: handle this?, carBrand must not be missing

  // automatically send to brand Vendors
  const vendors = await VendorService.findAll({
    where: {
      brands: requestBrand
    }
  });

  if (!vendors.length) {
    // todo: else, notify admin for missing vendors
    return;
  }

  const requestItem = Object.values(request.capturedDetails).join(" ");

  await Promise.all(
    vendors.map(async (v) => {
      // outbound to each vendor
      const _vendor = v.get();
      const message = `Client is looking for a part: ${requestItem}. Please respond with "#${request.id}...". If available, please quote with price and condition. e.g "#4343 available, 15k new"`;

      await sendMessageAndLogInteraction({
        phone: _vendor.phone,
        message,
        requestId: request.id,
        vendorId: _vendor.id,
        type: InteractionTypes.SYSTEM_VENDOR_REQUEST,
      });

      //
      await VendorRequestService.create({
        vendorId: _vendor.id,
        requestId: request.id,
        status: VendorRequestStatusEnum.PENDING
      });
    }),
  );
};