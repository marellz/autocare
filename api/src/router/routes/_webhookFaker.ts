import express, { Request, Response } from "express";
import ReceiverService from "../../services/receiver/receiver.service";
import { InteractionCache } from "../../services/interaction/interaction.cache";
import {
  InteractionDirectionEnum,
  InteractionTypes,
} from "../../db/models/interaction.model";
import VendorRequestService from "../../services/vendor/vendorRequest.service";
import { sendWhatsapp } from "../../services/twilio/twillio.service";
import InteractionService from "../../services/interaction/interaction.service";
import { RequestStatusEnum } from "../../db/models/request.model";
import RequestService from "../../services/request/request.service";

const router = express.Router();
router.post("/", async (req: Request, res: Response) => {
  const { From: sender, Body: body, ProfileName: name, WaId: phone } = req.body;

  const found = InteractionCache.get(phone); // gets the very last/newest

  /**
   * no last interaction, treat as new request
   *
   */

  if (!found) {
    const { response } = await handleNewRequest({ sender, body, name, phone });

    res.status(200).send({
      message: "No previous interaction found, treated as new request",
      response,
    });

    return;
  }

  /**
      if found, run a switch on the type of interaction
    */

  const getVendorRequest = async () => {
    if (!found.vendorId)
      throw new Error("Vendor ID is null for vendor request interaction");
    const vendorRequest = await VendorRequestService.findOne({
      vendorId: found.vendorId!,
      requestId: found.requestId,
    });

    if (!vendorRequest) throw new Error("Vendor request not found");

    return vendorRequest.get();
  };

  switch (found.type) {
    case InteractionTypes.SYSTEM_REQUEST_UPDATE: {
      // system asked for more info, handle the request

      // save inbound interaction
      InteractionService.create({
        requestId: found.requestId,
        direction: InteractionDirectionEnum.INBOUND,
        type: InteractionTypes.CLIENT_REQUEST_UPDATE,
        phone,
        message: body,
      });
      const _request = await RequestService.findOne({
        id: found.requestId,
      });

      if (!_request) throw new Error("Request not found. Invalid request.");

      const request = _request.get();

      const { response, missingDetails } =
        await ReceiverService.handleRequestUpdate(request, body);

      const interactionType = missingDetails
        ? InteractionTypes.SYSTEM_REQUEST_UPDATE
        : InteractionTypes.SYSTEM_REQUEST_ACKNOWLEDGE;

      // save outbound interaction
      InteractionService.create({
        requestId: found.requestId,
        direction: InteractionDirectionEnum.OUTBOUND,
        type: interactionType,
        phone,
        message: response,
      });

      break;
    }

    case InteractionTypes.SYSTEM_VENDOR_REQUEST: {
      // vendor was assigned the request, handle the vendor response
      const vendorRequest = await getVendorRequest();
      const { response, missingDetails, available } =
        await ReceiverService.handleVendorResponse(vendorRequest, body);

      if (!available) {
        // do nothing

        return;
      }

      let interactionType = InteractionTypes.SYSTEM_VENDOR_ACKNOWLEDGE;
      if (missingDetails) {
        // respond to retrieve more info
        interactionType = InteractionTypes.SYSTEM_VENDOR_REQUEST_UPDATE;
      }

      InteractionService.create({
        direction: InteractionDirectionEnum.OUTBOUND,
        phone,
        type: interactionType,
        message: response,
        requestId: found.requestId,
      });

      sendWhatsapp({ to: sender, body: response });

      break;
    }

    case InteractionTypes.SYSTEM_VENDOR_REQUEST_UPDATE: {
      // vendor was asked for more info, handle the vendor response and add onto vendorRequest
      const vendorRequest = await getVendorRequest();
      ReceiverService.handleVendorRequestUpdate(vendorRequest, body);
      break;
    }

    default:
      {
        /**
        * InteractionTypes.SYSTEM_REQUEST_ACKNOWLEDGE:
        request was ended, so handle a new one

        * InteractionTypes.SYSTEM_REQUEST_RESPONSE:
        request was handled and ended, treat as new Request

        * InteractionTypes.SYSTEM_VENDOR_ACKNOWLEDGE:
        treat as new Request
       */

        await handleNewRequest({ body, name, phone, sender });
      }

      res.status(200).send({
        message: "Webhook received and processed",
        interaction: found,
      });
  }
});

export default router;

const handleNewRequest = async ({
  body,
  name,
  phone,
  sender,
}: {
  body: string;
  name: string;
  phone: string;
  sender: string;
}) => {
  const { request, response } = await ReceiverService.handleNewRequest(body, {
    name,
    phone,
  });

  // send this to user

  sendWhatsapp({ to: sender, body: response });

  const interactionType =
    request.status === RequestStatusEnum.MISSING_DETAILS
      ? InteractionTypes.SYSTEM_REQUEST_UPDATE // seeking more info
      : InteractionTypes.SYSTEM_REQUEST_ACKNOWLEDGE;

  // create inbound interaction
  InteractionService.create({
    message: body,
    direction: InteractionDirectionEnum.INBOUND,
    type: InteractionTypes.CLIENT_REQUEST,
    metadata: {},
    phone,
    requestId: request.id,
  });

  // create outbound interation
  InteractionService.create({
    message: response,
    direction: InteractionDirectionEnum.OUTBOUND,
    type: interactionType,
    metadata: {},
    phone,
    requestId: request.id,
  });

  return { response };
};
