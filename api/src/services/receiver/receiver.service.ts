import {
  VendorRequest,
  VendorResponseEnum,
} from "../../db/models/vendorRequest.model";
import RequestService from "../request/request.service";
import {
  CapturedDetails,
  CarPartDetail,
  Request,
  RequestStatusEnum,
} from "../../db/models/request.model";
import RequestProcessService from "../request/process.service";
import ParserService from "../parser/parser.service";
import VendorRequestService from "../vendor/vendorRequest.service";

class ReceiverService {
  static async handleNewRequest(
    body: string,
    user: { name: string; phone: string },
  ) {
    // create new Request

    const { response, capturedKeys, missingKeys } =
      await RequestProcessService.processNewRequest(body);

    // if incomplete, request for more info
    let status = RequestStatusEnum.COMPLETED;
    if (missingKeys.length) {
      status = RequestStatusEnum.MISSING_DETAILS;
    }

    const payload = {
      ...user,
      originalMessages: [body],
      channel: "whatsapp",
      status,
      capturedDetails: capturedKeys,
      missingDetails: missingKeys,
    };

    const _request = await RequestService.create(payload);
    const request = _request.get();

    // if complete, finalize and send to vendors

    return {
      response,
      request,
      missingDetails: missingKeys.length ? missingKeys : null,
    };
  }

  static async handleRequestUpdate(request: Request, body: string) {
    // get missing information
    // parse body to get missing information
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

    const payload: {
      response: string;
      missingDetails?: string[];
      capturedKeys: Partial<CapturedDetails>;
    } = {
      response: "All is well now!",
      capturedKeys,
    };

    let status = RequestStatusEnum.COMPLETED;
    if (_newMissingKeys.length) {
      // still missing keys
      payload.missingDetails = _newMissingKeys;
      payload.response = "Still missing keys:" + _newMissingKeys.join(", ");
      status = RequestStatusEnum.MISSING_DETAILS;
    }

    // update request

    await RequestService.update(request.id, {
      status,
      originalMessages: Array.from([...originalMessages, body]),
      capturedDetails: capturedKeys,
      missingDetails: _newMissingKeys,
    });

    return payload;
  }

  static async handleVendorResponse(
    vendorRequest: VendorRequest,
    body: string,
  ) {
    // get request info from response

    const { capturedKeys } =
      await ParserService.parseVendorResponse(body);

    const missingDetails = [];
    const { available, condition, price } = capturedKeys;

    if (!available) {
      // todo: kill vendor request.
      return {
        available,
        response: "Not available from this vendor.",
      };
    }

    if (!condition) missingDetails.push("condition");
    if (!price) missingDetails.push("price");

    if (missingDetails.length) {
      return {
        available: true,
        missingDetails,
        response: "Missing information: " + missingDetails.join(", "),
      };
    }

    // todo: handle a situation where a vendor posts multiple offers
    VendorRequestService.update(vendorRequest.id, {
      condition,
      price: price?.toString(),
    });

    return {
      available: true,
      response: "Updated successfully!",
    };
  }

  static async handleVendorRequestUpdate(
    vendorRequest: VendorRequest,
    body: string,
  ) {
    // find what's missing

    const missingDetails: VendorResponseEnum[] = [];
    if (!vendorRequest.price) missingDetails.push(VendorResponseEnum.PRICE);
    if (!vendorRequest.condition)
      missingDetails.push(VendorResponseEnum.CONDITION);

    // parse for it from new body, + old body
    const { capturedKeys } = await ParserService.parseVendorResponse(
      body,
      missingDetails,
    );

    const _missing = Object.keys(capturedKeys).filter(
      (k) => !capturedKeys[k as VendorResponseEnum],
    );

    let response = "";
    if (_missing.length) {
      // there and back again

      response = "Still missing: " + _missing.join(", ");
    }

    if (capturedKeys) {
      VendorRequestService.update(vendorRequest.id, {
        ...capturedKeys,
        price: capturedKeys.price?.toString(),
      });
    }

    return {
      response,
    };
  }
}

export default ReceiverService;
