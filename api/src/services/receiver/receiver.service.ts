import { RequestModel } from "../../db/sequelize";
import type { Request } from "../../db/models/request.model";
import ParserService from "../../services/parser/parser.service";
import RequestService from "../../services/request/request.service";
import { sendWhatsapp } from "../../services/twilio/twillio.service";

interface ClientRequest {
  sender: string;
  name: string;
  Body: string;
  phone: string;
}

interface CarPartDetails {
  carBrandAndModel: string;
  carYear?: string;
  carGeneration?: string;
  carPartName: string;
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
      status: "missing_details",
    });

    if (incompleteRequest) {
      let _request = incompleteRequest.get();
      // see if missing details align
      console.log(_request.id);
      console.log({
        Body,
        missingDetails: _request.missingDetails,
        oldItem: _request.item,
      });

      const _missingDetails = _request.missingDetails
        ? JSON.parse(_request.missingDetails)
        : [];

      const response = await ParserService.parseMissingDetails(
        Body,
        _missingDetails,
        _request.item
      );

      if (response.missingKeys && response.missingKeys.length) {
        // if incomplete, back again.

        sendWhatsapp({
          to: sender,
          body: `Still missing keys: ${response.missingKeys.join(", ")}`,
        });
      } else {
        //if complete, update to pending

        const _capturedDetails = _request.capturedDetails
          ? JSON.parse(_request.capturedDetails)
          : {};

        const updatedCapturedDetails = {
          ...response.capturedKeys,
          ..._capturedDetails,
        };

        const item = computeItemDetails(updatedCapturedDetails);

        RequestService.update(_request.id, {
          status: "pending",
          item,
          capturedDetails: JSON.stringify(updatedCapturedDetails),
          missingDetails: null,
        });
      }

      return;
    }

    // pass to AI to discern what they are looking for from the body
    const {
      capturedKeys,
      missingKeys,
    }: {
      capturedKeys?: CarPartDetails;
      missingKeys?: string[];
    } = await ParserService.parseNewRequest(Body);
    if (missingKeys && missingKeys.length) {
      // handle missing keys
      // create incomplete request
      // send a chat detailing what is missing.

      // todo: enums!
      const keys: Record<keyof CarPartDetails, string> = {
        carPartName: "part name",
        carBrandAndModel: "your car brand and model",
        carYear: "car year or generation",
        carGeneration: "car generation",
      };

      // const missingKeys = missingKeys.map((m) => keys[m]);
      const item = capturedKeys ? computeItemDetails(capturedKeys) : "[empty]";

      const _response = `
      We need the following missing information from your request:
      - ${missingKeys.join(" \n -")}
      `;

      await RequestService.create({
        name,
        phone,
        item,
        channel: "whatsapp",
        status: "missing_details",
        capturedDetails: JSON.stringify(capturedKeys),
        missingDetails: JSON.stringify(
          missingKeys.map((m) => keys[m as keyof CarPartDetails])
        ),
      });

      // send this back

      await sendWhatsapp({ to: sender, body: _response });
    } else {
      // confirm receipt.

      const item = capturedKeys ? computeItemDetails(capturedKeys) : "[empty]";

      // throw error if capturedKeys is invalid

      await RequestService.create({
        name,
        phone,
        item,
        channel: "whatsapp",
        status: "pending",
        capturedDetails: JSON.stringify(capturedKeys),
        missingDetails: null,
      });

      await sendWhatsapp({
        to: sender,
        body: "We have all your details. We will get back soon.",
      });
    }
  }

  static async handleVendorResponse(existingRequest: Request, body: string) {
    console.log({ existingRequest });
    // updateRequest
    // const {availability, condition, } = ParserService.parseVendorResponse(Body)
    const response = await ParserService.parseVendorResponse(body);

    console.log({ type: "Vendor response", response });
    // grab pending details, fill in. if missing, repeat. if not, close conversation.

    return;
  }

  static async findExistingRequest(phone: string) {
    // certify there is no pending request with said phonenumber

    // ATTACH REQUESTS TO VENDORS
    // WHERE VENDOR_PHONE === 'phone'
    const existingRequest = await RequestModel.findOne({
      where: {
        phone,
        status: "pending",
      },
    });

    return existingRequest;
  }
}

export default ReceiverService;

export const computeItemDetails = (keys: CarPartDetails) => {
  const { carBrandAndModel, carYear, carGeneration, carPartName } = keys;
  let str = `${carPartName} for a ${carBrandAndModel}`;
  const yearOrGen = carYear || carGeneration;
  if (!yearOrGen) return `${str}. Unknown year/gen`;
  let str2 =
    [carGeneration, carYear].filter((i) => i !== null && i !== "").join(" ") +
    " ";
  return [str, str2].join(". ");
};
