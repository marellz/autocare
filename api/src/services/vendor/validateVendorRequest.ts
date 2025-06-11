import { Interaction } from "../../db/models/interaction.model";
import VendorRequestService from "./vendorRequest.service";

export const validateVendorRequest = async (interaction: Interaction) => {
  const { vendorId, requestId } = interaction;
  if (!vendorId) return;

  const _vendorRequest = await VendorRequestService.findOne({
    vendorId,
    requestId,
  });

  if (!_vendorRequest) return;

  return _vendorRequest.get();
};
