import {
    CapturedDetails,
  CarPartDetail,
  carPartDetailLables,
  Request,
  RequestStatusEnum,
} from "../../db/models/request.model";
import ParserService, { ParserResponse, requiredKeys } from "../parser/parser.service";

class RequestProcessService {
  static async processIncompleteRequest(Body: string, _request: Request) {
    const { capturedKeys } = await ParserService.parseMissingDetails(
      [..._request.originalMessages, Body].join(". "),
      _request.missingDetails as CarPartDetail[],
    );

    let status = RequestStatusEnum.MISSING_DETAILS;
    let response = "";

    // done: defineMissing keys from required missing in capuredKeys
    const updatedCapturedKeys = {...capturedKeys, ..._request.capturedDetails}
    const missingKeys: CarPartDetail[] = computeMissingKeys(updatedCapturedKeys);

    if (!Object.keys(capturedKeys).length) {
      response = "Invalid response";
    } else {
        
      if (missingKeys.length) {
        // if incomplete, back again.
        response = `Still missing this information: \n-${missingKeys.join(`, \n-`)}`;
      } else {
        //if complete, update to pending
        status = RequestStatusEnum.PENDING;
        response = `Got everything now. We'll get back soon.`;
      }
    }

    return {
      response,
      status,
      missingKeys,
      capturedKeys,
    };
  }

  static async processNewRequest(body: string) {
    const { capturedKeys }: ParserResponse =
      await ParserService.parseNewRequest(body);
    let response;

    // done: define missing keys from mising keys in capturedKeys
    const missingKeys: CarPartDetail[] = computeMissingKeys(capturedKeys);

    if (missingKeys.length) {
      const keys = missingKeys.map((m) => carPartDetailLables[m]);

      response = `
      We still need the following missing information from your request:  \n- ${keys.join("\n -")}
      `;
    } else {
      response = "We have all your details. We will get back soon.";
    }

    return {
      response,
      missingKeys,
      capturedKeys,
    };
  }
}

export const computeMissingKeys = (captured: Partial<CapturedDetails>) => {
  return requiredKeys.filter((k) => !captured[k]);
};

export default RequestProcessService;
