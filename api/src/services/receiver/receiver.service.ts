import {
  type Request,
  type CapturedDetails,
  CarPartDetailEnum,
  RequestStatusEnum,
} from "../../db/models/request.model";
import RequestService from "../../services/request/request.service";
import { sendWhatsapp } from "../../services/twilio/twillio.service";
import RequestProcessService from "../request/process.service";
import ParserService from "../parser/parser.service";

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

  static async handleVendorResponse(existingRequest: Request, body: string) {
    // updateRequest
    // const {availability, condition, } = ParserService.parseVendorResponse(Body)
    const response = await ParserService.parseVendorResponse(body);
    // grab pending details, fill in. if missing, repeat. if not, close conversation.

    return {
      response,
    };
  }
}

export const computeItemDetails = (details: Partial<CapturedDetails>) => {
  return [
    CarPartDetailEnum.PART_NAME,
    CarPartDetailEnum.CAR_BRAND,
    CarPartDetailEnum.CAR_MODEL,
    CarPartDetailEnum.CAR_YEAR,
  ]
    .map((i) => details[i] ?? `[missing ${i}]`)
    .splice(1, 0, "for a")
    .join(" ");
};

export default ReceiverService;
