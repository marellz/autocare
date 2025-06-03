import {
  type CapturedDetails,
  CarPartDetailEnum,
  RequestStatusEnum,
} from "../../db/models/request.model";
import RequestService from "../../services/request/request.service";
import { sendWhatsapp } from "../../services/twilio/twillio.service";
import RequestProcessService from "../request/process.service";
import ParserService from "../parser/parser.service";
import VendorRequestService from "../vendor/vendorRequest.service";
import { VendorRequest } from "../../db/models/vendorRequest.model";

interface ClientRequest {
  sender: string;
  name: string;
  Body: string;
  phone: string;
}

class ReceiverService {
  static async handleClientRequest({
    sender,
    name,
    phone,
    Body,
  }: ClientRequest) {
    // find an incomplete request from same number

    const incompleteRequest = await RequestService.findOne({
      phone,
      status: RequestStatusEnum.MISSING_DETAILS,
    });

    if (incompleteRequest) {
      const _request = incompleteRequest.get();
      const { response, status, missingKeys, capturedKeys } =
        await RequestProcessService.processIncompleteRequest(Body, _request);

      await sendWhatsapp({
        to: sender,
        body: response,
      });

      const item = computeItemDetails(capturedKeys);

      const originalMessages = new Set(_request.originalMessages);
      originalMessages.add(Body);

      await RequestService.update(_request.id, {
        status,
        item,
        originalMessages: Array.from(originalMessages),
        capturedDetails: capturedKeys,
        missingDetails: missingKeys,
      });

      return { response };
    } else {
      const { response, capturedKeys, missingKeys } =
        await RequestProcessService.processNewRequest(Body);

      let status = RequestStatusEnum.MISSING_DETAILS;
      if (!missingKeys.length) {
        status = RequestStatusEnum.PENDING;
      }

      const item = computeItemDetails(capturedKeys);

      const payload = {
        name,
        phone,
        item,
        originalMessages: [Body],
        channel: "whatsapp",
        status,
        capturedDetails: capturedKeys,
        missingDetails: missingKeys,
      };

      await RequestService.create(payload);

      await sendWhatsapp({ to: sender, body: response });

      return { response };
    }
  }

  static async findExistingRequests(phone: string) {
    // find vendors phone
    const vendors = await VendorRequestService.findPendingVendorRequests(phone);

    return vendors;
  }

  static async disambiguateVendorResponse(
    existingVendorRequests: VendorRequest[],
    body: string,
  ) {
    /**
     * FIND THE CORRECT VENDOR REQUEST,
     * DISAMBIGUATE BODY WITH EXISTINBG
     */
    console.log({ existingVendorRequest: existingVendorRequests[0], body });
    return existingVendorRequests[0];
  }

  static async handleVendorResponse(
    existingRequest: VendorRequest,
    body: string,
  ) {
    // updateRequest

    console.log({ existingRequest, body });
    const { available, condition, price } =
      await ParserService.parseVendorResponse(body);

    if (!available) {
      console.log("No availability found in response, skipping update.");

      return "No availability found in response, skipping update.";
    }

    await VendorRequestService.update(existingRequest.id, {
      condition,
      price: price?.toString(),
    });

    return "Updated vendor request successfully";
  }
}

export const computeItemDetails = (details: Partial<CapturedDetails>) => {
  const result = [
    CarPartDetailEnum.CAR_MODEL,
    CarPartDetailEnum.CAR_YEAR,
    CarPartDetailEnum.PART_NAME,
    CarPartDetailEnum.CAR_BRAND,
    CarPartDetailEnum.CAR_VARIANT,
  ].map((i) => details[i] ?? `[missing ${i}]`);

  const results2 = [
    CarPartDetailEnum.ENGINE_SIZE,
    CarPartDetailEnum.TRANSMISSION,
    CarPartDetailEnum.BODY_TYPE,
  ]
    .filter((i) => !!details[i])
    .map((i) => (details[i] ? `${i} - ${details[i]}` : ""));

  return result.join(" ") + ". " + results2.join(", ");
};

export default ReceiverService;
