import { Interaction, InteractionTypes } from "src/db/models/interaction.model";
import ReceiverService from "../receiver/receiver.service";
import { validateVendorRequest } from "../vendor/validateVendorRequest";

interface InboundMessageDetails {
  body: string;
  phone: string;
  name: string;
}

export const matchLastInteraction = async (
  lastInteraction: Interaction,
  inbound: InboundMessageDetails,
): Promise<{ error?: string; message: string }> => {
  const { body, phone, name } = inbound;

  switch (lastInteraction.type) {
    /**
     *
     * SYSTEM_REQUEST_UPDATE
     * description: system asked for more info
     * - parse more info from body, use missingDetails as guide
     * - handle request update from body
     *
     */
    case InteractionTypes.SYSTEM_REQUEST_UPDATE: {
      const response = await ReceiverService.handleRequestUpdate(
        lastInteraction,
        {
          body,
          phone,
        },
      );

      return response;
    }

    /**
     * SYSTEM_VENDOR_REQUEST 
     * description: vendor was assigned the request, handle the vendor response
     * - look for existing/last vendorResponse,
     * - extract details
     * - if missing, get back with missing info
     * - else if complete, send to existing vendors
     
     * SYSTEM_VENDOR_REQUEST_UPDATE
     * description: vendor was asked for more info, handle the vendor response and add onto vendorRequest
     * - find existing vendorResponse,
     * - parse body for missing info
     * - update vendorRequest
     */

    case InteractionTypes.SYSTEM_VENDOR_REQUEST:
    case InteractionTypes.SYSTEM_VENDOR_REQUEST_UPDATE: {
      const vendorRequest = await validateVendorRequest(lastInteraction);

      if (!vendorRequest)
        return {
          message: "Error",
          error: "Vendor request not found/valid.",
        };

      const response = await ReceiverService.handleVendorResponse(
        vendorRequest,
        inbound,
      );

      return response;
    }

    default: {
      /**
        SYSTEM_REQUEST_ACKNOWLEDGE:
        description: last interaction/request was completed, handle as new

        SYSTEM_REQUEST_RESPONSE:
        description: last interaction/request was handled and ended, handle as new

        SYSTEM_VENDOR_ACKNOWLEDGE:
        description: last interaction/request was handled as ended
       */

      const response = await ReceiverService.handleNewRequest({
        body,
        name,
        phone,
      });

      return response;
    }
  }
};
