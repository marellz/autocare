import express, { Request, Response } from "express";
import ReceiverService from "../../services/receiver/receiver.service";
import {
  InteractionDirectionEnum,
  InteractionTypes,
} from "../../db/models/interaction.model";
import VendorRequestService from "../../services/vendor/vendorRequest.service";
import { sendWhatsapp } from "../../services/twilio/twillio.service";
import InteractionService from "../../services/interaction/interaction.service";
import { RequestStatusEnum } from "../../db/models/request.model";
import RequestService from "../../services/request/request.service";
import VendorService from "../../services/vendor/vendor.service";
import { Op } from "sequelize";

const router = express.Router();
router.post("/", async (req: Request, res: Response) => {
  const { From: sender, Body: body, ProfileName: name, WaId: phone } = req.body;

  const found = await InteractionService.findByPhone(phone); // gets the very last/newest

  /**
   * no last interaction, treat as new request
   *
   */

  if (!found) {
    console.log("Interaction not found");
    const { response } = await handleNewRequest({ sender, body, name, phone });

    res.send({
      message: "Treated as new request",
      response,
    });

    return;
  }

  console.log("Interaction found", found);

  /**
      if found, run a switch on the type of interaction
    */

  const getVendorRequest = async () => {
    try {
      if (!found.vendorId) {
        throw new Error("Vendor ID is null for vendor request interaction");
      }

      const vendorRequest = await VendorRequestService.findOne({
        vendorId: found.vendorId!,
        requestId: found.requestId,
      });

      if (!vendorRequest) throw new Error("Vendor request not found");

      return vendorRequest.get();
    } catch (error) {
      console.log("Error getting vendor request", error);
      return null;
    }
  };

  switch (found.type) {
    case InteractionTypes.SYSTEM_REQUEST_UPDATE: {
      // system asked for more info, handle the request

      // save inbound interaction
      await InteractionService.create({
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
      await InteractionService.create({
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
      if (!vendorRequest) return; // todo: handle error

      // todo: look for existing vendor response.
      const handled = await ReceiverService.handleVendorResponse(
        vendorRequest,
        body,
      );

      const { response, missingDetails, available, price } = handled;

      console.log({ handled });

      if (!available) {
        // do nothing
        // todo: acknowlegde their response and withdraw request?
        return;
      }

      let interactionType = InteractionTypes.SYSTEM_VENDOR_ACKNOWLEDGE;
      if (missingDetails) {
        // respond to retrieve more info
        interactionType = InteractionTypes.SYSTEM_VENDOR_REQUEST_UPDATE;
      }

      // send to VENDOR
      await InteractionService.create({
        direction: InteractionDirectionEnum.OUTBOUND,
        phone,
        type: interactionType,
        message: response,
        requestId: found.requestId,
        vendorId: found.vendorId,
      });

      await sendWhatsapp({ to: sender, body: response });

      if (!missingDetails) {
        const vendor = await VendorService.findById(vendorRequest.vendorId);
        if (!vendor) throw new Error("Could not find vendor.");
        const _v = vendor.get();

        const phone = `You can reach out to them via phone ${_v.phone}.`;
        const location = _v.location ? ` Location: ${_v.location}` : "";

        const clientResponse = `${_v.name || "Someone"} gave a quote for ${price ?? "[missing]"}. ${phone}${location}`;

        const request = await RequestService.findOne({
          id: found.requestId,
        });

        if (!request) throw new Error("Could not find request");

        const _request = request.get();
        const clientPhone = _request.phone;

        // send to CLIENT
        await InteractionService.create({
          direction: InteractionDirectionEnum.OUTBOUND,
          phone: clientPhone,
          type: InteractionTypes.SYSTEM_REQUEST_RESPONSE,
          message: clientResponse,
          vendorId: found.vendorId,
          requestId: found.requestId,
        });

        await sendWhatsapp({ to: clientPhone, body: clientResponse });

        res.json({
          message: "Complete info. Reverted information to client.",
        });

        break;
      }

      res.json({
        message: "Some details were missing.",
        data: missingDetails,
      });

      break;
    }

    case InteractionTypes.SYSTEM_VENDOR_REQUEST_UPDATE: {
      // vendor was asked for more info, handle the vendor response and add onto vendorRequest
      const vendorRequest = await getVendorRequest();

      if (!vendorRequest) {
        res.status(500).json({
          message: "VendorRequest not valid.",
        });

        return;
      }

      ReceiverService.handleVendorRequestUpdate(vendorRequest, body);

      res.json({
        message: "Asking for more details",
      });

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

        console.log("Handled here");

        await handleNewRequest({ body, name, phone, sender });
      }

      res.send({
        message: "Responded as " + found.type,
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

  // todo: handle existing request with same parameters.
  const { request, response } = await ReceiverService.handleNewRequest(body, {
    name,
    phone,
  });

  const interactionType =
    request.status === RequestStatusEnum.MISSING_DETAILS
      ? InteractionTypes.SYSTEM_REQUEST_UPDATE // seeking more info
      : InteractionTypes.SYSTEM_REQUEST_ACKNOWLEDGE;

  // create inbound interaction
  await InteractionService.create({
    message: body,
    direction: InteractionDirectionEnum.INBOUND,
    type: InteractionTypes.CLIENT_REQUEST,
    metadata: {},
    phone,
    requestId: request.id,
  });

  // create outbound interation back to client
  await InteractionService.create({
    message: response,
    direction: InteractionDirectionEnum.OUTBOUND,
    type: interactionType,
    metadata: {},
    phone,
    requestId: request.id,
  });

  if (request.status === RequestStatusEnum.MISSING_DETAILS) return { response };

  const requestItem = Object.values(request.capturedDetails).join(" ");
  const requestBrand = request.capturedDetails.carBrand;

  if (requestBrand) {
    // automatically send to brand Vendors
    const vendors = await VendorService.findAll({
      brands: {
        [Op.contains]: [requestBrand],
      },
    });

    if (!vendors.length) {
      // todo: else, notify admin for missing vendors
    }

    vendors.forEach(async (v) => {
      // outbound to each vendor
      const _vendor = v.get();

      const message = `Client is looking for a part: ${requestItem}. Please respond with "#${request.id}...". If available, please quote with price and condition. e.g "#4343 available, 15k new"`;

      await sendWhatsapp({
        to: _vendor.phone,
        body: message,
      });

      await InteractionService.create({
        message,
        direction: InteractionDirectionEnum.OUTBOUND,
        type: InteractionTypes.SYSTEM_VENDOR_REQUEST,
        metadata: request.capturedDetails,
        phone: _vendor.phone,
        requestId: request.id,
        vendorId: _vendor.id,
      });

      //
      await VendorRequestService.create({
        vendorId: _vendor.id,
        requestId: request.id,
      });
    });
  }

  // send this to CALLBACK user

  await sendWhatsapp({ to: sender, body: response });

  return { response };
};
