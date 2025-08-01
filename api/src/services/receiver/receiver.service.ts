import {
  VendorRequest,
  VendorRequestStatusEnum,
} from "../../db/models/vendorRequest.model";
import RequestService from "../request/request.service";
import {
  CarPartDetail,
  Request,
  RequestChannelEnum,
  RequestStatusEnum,
} from "../../db/models/request.model";
import RequestProcessService from "../request/process.service";
import ParserService, {
  CapturedResponseDetails,
} from "../parser/parser.service";
import VendorRequestService from "../vendor/vendorRequest.service";
import {
  Interaction,
  InteractionDirectionEnum,
  InteractionTypes,
} from "../../db/models/interaction.model";
import InteractionService from "../interaction/interaction.service";
import VendorService from "../vendor/vendor.service";
import { sendMessageAndLogInteraction } from "../notification/notify.service";

interface InboundMessageDetails {
  phone: string;
  body: string;
}

class ReceiverService {
  /**
   * HANDLE NEW REQUEST
   */
  static async handleNewRequest(
    inbound: InboundMessageDetails & { name: string; channel: string },
  ): Promise<{missingKeys?: string[], request?: Request, message: string}> {
    const { body, phone, channel } = inbound;

    // create new Request
    const {
      response: message, // todo: rethink the importance of this response/message
      capturedKeys,
      missingKeys,
    } = await RequestProcessService.processNewRequest(body);

    // if incomplete, request for more info
    const status = missingKeys.length
      ? RequestStatusEnum.MISSING_DETAILS
      : RequestStatusEnum.SUBMITTED;
    // todo: feature/payment: update statusd to pending, after payment is made
    // on payment hook, if the paymernt is declined, only send once the means to complete it.
    // don't forget to create interactions for this

    const payload = {
      ...inbound,
      originalMessages: [body],
      channel,
      status,
      capturedDetails: capturedKeys,
      missingDetails: missingKeys,
    };

    const createRequest = async () => {
      const _request = await RequestService.create(payload);
      return _request.get();
    };

    const logInboundInteraction = async (requestId?: string) => {
      await InteractionService.create({
        message: body,
        direction: InteractionDirectionEnum.INBOUND,
        type: InteractionTypes.CLIENT_REQUEST,
        metadata: {},
        phone,
        requestId,
      });
    };

    if (missingKeys.length) {
      /** WEB: If channel is web, any missing keys have to be corrected. */
      if (channel === RequestChannelEnum.WEB) {
        return {
          message: 'Request has missing details',
          missingKeys,
        };
      }

      if (missingKeys.length >= 4) {
        // your request was not understood, please try again.
        // log interaction that the request was not understood
        
        // todo: add a handling for this interaction type in the whatsapp callback
        const message = "I did not catch that. Please rewrite your request with the necessary details: <carPart> <CarBrand> <carModel> <carVariant>"
        sendMessageAndLogInteraction({
          message,
          type: InteractionTypes.SYSTEM_REQUEST_FAIL,
          phone,
        });

        return {
          message,
        };
      }

      // create request
      const request = await createRequest();

      // inbound interaction
      await logInboundInteraction(request.id);

      // if missing keys, ask for more info
      sendMessageAndLogInteraction({
        message: "Missing keys: " + missingKeys.join(", "),
        type: InteractionTypes.SYSTEM_REQUEST_UPDATE,
        phone,
        requestId: request.id,
      });

      return {
        message: 'Request has missing keys, please update this.',
        missingKeys,
        request,
      };
    }

    /** milestone: information is tight! */

    // create request
    const request = await createRequest();

    // create inbound interaction
    await logInboundInteraction(request.id);

    // create outbound interation back to callback user -> client
    await sendMessageAndLogInteraction({
      message,
      type: InteractionTypes.SYSTEM_REQUEST_ACKNOWLEDGE,
      phone,
      requestId: request.id,
    });

    return {
      request,
      message,
    };
  }

  /**
   * HANDLE UPDATE FOR CURRENT REQUEST
   */
  static async handleRequestUpdate(
    found: Interaction,
    inbound: InboundMessageDetails,
  ) {
    const { phone, body } = inbound;

    // document received message
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

    if (!_request)
      return {
        message: "Error",
        error: "Request not found. Invalid request.",
      };

    const request = _request.get();

    const { originalMessages, missingDetails } = request;
    const { capturedKeys } = await ParserService.parseMissingDetails(
      [...originalMessages, body].join(". "),
      missingDetails as CarPartDetail[],
    );

    const _newMissingKeys = [...missingDetails];

    Object.keys(capturedKeys).forEach((item, index) => {
      // if key is in missingDetails, remove it
      if (_newMissingKeys.includes(item)) delete _newMissingKeys[index];
    });

    let message = "All is well now!";

    let status = RequestStatusEnum.COMPLETED;
    if (_newMissingKeys.length) {
      // still missing keys
      message = "Still missing keys:" + _newMissingKeys.join(", ");
      status = RequestStatusEnum.MISSING_DETAILS;
    }

    // update request
    await RequestService.update(request.id, {
      status,
      originalMessages: Array.from([...originalMessages, body]),
      capturedDetails: capturedKeys,
      missingDetails: _newMissingKeys,
    });

    // outbound
    const interactionType = missingDetails
      ? InteractionTypes.SYSTEM_REQUEST_UPDATE
      : InteractionTypes.SYSTEM_REQUEST_ACKNOWLEDGE;

    // save outbound interaction
    await InteractionService.create({
      requestId: found.requestId,
      direction: InteractionDirectionEnum.OUTBOUND,
      type: interactionType,
      phone,
      message,
    });

    return {
      message,
    };
  }

  /**
   * HANDLE VENDOR RESPONSE
   * new vendorResponse
   */
  static async handleVendorResponse(
    vendorRequest: VendorRequest,
    inbound: {
      body: string;
      phone: string;
    },
  ) {
    const { phone, body } = inbound;
    const { vendorId, requestId } = vendorRequest;

    // document incoming request
    InteractionService.create({
      type: InteractionTypes.VENDOR_REQUEST_QUOTE,
      direction: InteractionDirectionEnum.INBOUND,
      message: body,
      phone,
      vendorId,
      requestId,
    });

    const { capturedKeys } = await ParserService.parseVendorResponse(body);

    const missingDetails: Array<keyof CapturedResponseDetails> = [];
    const { available, condition, price } = capturedKeys;

    if (!available) {
      // mark the vendor-request as unavailable
      VendorRequestService.update(vendorRequest.id, {
        status: VendorRequestStatusEnum.UNAVAILABLE,
      });
      return {
        message: "Vendor does not have the said part in stock",
      };
    }

    // vendor-request status
    let status = VendorRequestStatusEnum.PENDING;

    (Object.keys(capturedKeys) as (keyof CapturedResponseDetails)[]).forEach(
      (k: keyof CapturedResponseDetails) => {
        if (capturedKeys[k]) missingDetails.push(k);
      },
    );

    let interactionType = InteractionTypes.SYSTEM_VENDOR_ACKNOWLEDGE;
    let message;

    if (!missingDetails.length) {
      const vendor = await VendorService.findById(vendorId);
      if (!vendor) return { message: "Error", error: "Could not find vendor." };
      const _v = vendor.get();

      const phoneStr = `You can reach out to them via phone ${_v.phone}.`;
      const locationStr = _v.location ? ` Location: ${_v.location}` : "";

      const clientResponse = `${_v.name || "Someone"} gave a quote for ${price ?? "[missing]"}. ${phoneStr}${locationStr}`;

      const request = await RequestService.findOne({
        id: requestId,
      });

      if (!request)
        return { message: "Error", error: "Could not find request" };

      const _request = request.get();
      const clientPhone = _request.phone;

      // send to CLIENT
      await sendMessageAndLogInteraction({
        type: InteractionTypes.SYSTEM_REQUEST_RESPONSE,
        message: clientResponse,
        phone: clientPhone,
        vendorId,
        requestId,
      });

      message = `Your quote for request for #${requestId} has been received and will be forwared to the client`;

      status = VendorRequestStatusEnum.QUOTED;
    } else {
      message =
        "Some details were missing. Please resend and also include: " +
        missingDetails.join(", ");
      interactionType = InteractionTypes.SYSTEM_VENDOR_REQUEST_UPDATE;
    }

    // send to VENDOR, callback user
    await sendMessageAndLogInteraction({
      phone,
      type: interactionType,
      message,
      requestId,
      vendorId,
    });

    // todo: handle a situation where a vendor posts multiple offers
    await VendorRequestService.update(vendorRequest.id, {
      condition,
      price: price?.toString(),
      status,
    });

    return {
      message,
    };
  }
}

export default ReceiverService;
