import {
  RequestModel,
  VendorModel,
  VendorRequestModel,
} from "#db/sequelize.js";
import ParserService from "#services/parser/parser.service.js";
import RequestService from "#services/request/request.service.js";
import { sendWhatsapp } from "#services/twilio/twillio.service.js";

class ReceiverService {
  static async handleClientRequest({ sender, name, phone, Body }) {
    // find an incomplete request from same number

    const incompleteRequest = await RequestService.findOne({
      phone,
      status: "missing_details",
    });

    if (incompleteRequest) {
      // see if missing details align
      console.log({
        Body,
        missingDetails: incompleteRequest.missingDetails,
        oldItem: incompleteRequest.item,
      });

      const response = await ParserService.parseMissingDetails(
        Body,
        JSON.parse(incompleteRequest.missingDetails),
        incompleteRequest.item
      );

      if (response.missingKeys && response.missingKeys.length) {
        // if incomplete, back again.

        sendWhatsapp({
          to: sender,
          body: `Still missing keys: ${response.missingKeys.join(", ")}`,
        });
      } else {
        //if complete, update to pending

        const updatedCapturedDetails = {
          ...response.capturedKeys,
          ...JSON.parse(incompleteRequest.capturedDetails),
        };

        const item = computeItemDetails(updatedCapturedDetails);

        RequestService.update(incompleteRequest.id, {
          missingDetails: null,
          status: "pending",
          item,
          capturedDetails: JSON.stringify(updatedCapturedDetails),
          missingDetails: null,
        });
      }

      return;
    }

    // pass to AI to discern what they are looking for from the body
    const response = await ParserService.parseNewRequest(Body);
    if (response.missingKeys && response.missingKeys.length) {
      // handle missing keys
      // create incomplete request
      // send a chat detailing what is missing.

      const keys = {
        carPartName: "part name",
        carBrandAndModel: "your car brand and model",
        carYear: "car year or generation",
        carGeneration: "car generation",
      };

      const missingKeys = response.missingKeys.map((m) => keys[m]);
      const item = computeItemDetails(response.capturedKeys);

      const _response = `
      We need the following missing information from your request:
      - ${missingKeys.join(" \n -")}
      `;

      await RequestService.create({
        name,
        phone,
        item,
        channel: "whatsapp",
        item,
        status: "missing_details",
        capturedDetails: JSON.stringify(response.capturedKeys),
        missingDetails: JSON.stringify(missingKeys),
      });

      // send this back

      await sendWhatsapp({ to: sender, body: _response });
    } else {
      // confirm receipt.
      const item = computeItemDetails(response.capturedKeys);

      await RequestService.create({
        name,
        phone,
        item,
        channel: "whatsapp",
        status: "pending",
        capturedKeys: JSON.stringify(response.capturedKeys),
        missingDetails: null,
      });

      await sendWhatsapp({
        to: sender,
        body: "We have all your details. We will get back soon.",
      });
    }
  }

  static async handleVendorResponse(existingRequest) {
    console.log({ existingRequest });
    // updateRequest
    // const {availability, condition, } = ParserService.parseVendorResponse(Body)
    const response = await ParserService.parseVendorResponse(Body);

    console.log({ type: "Vendor response", response });
    // grab pending details, fill in. if missing, repeat. if not, close conversation.

    return;
  }

  static async isExsitingRequest(phone) {
    // 1. certify they are a vendor
    const existingVendor = await VendorModel.findOne({
      where: { phone },
    });

    if (existingVendor) return false;

    // 2. certify there is a pending request

    const existingRequest = await VendorRequestModel.findOne({
      where: { id: existingVendor.id },
    });

    if (existingRequest) return true;

    return false;
  }

  static async findExistingRequest(phone) {
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

export const computeItemDetails = (keys) => {
  const { carBrandAndModel, carYear, carGeneration, carPartName } = keys;
  const yearOrGen = carYear || carGeneration;
  const yearAndGen = carYear !== null && carGeneration !== null;
  if (!yearOrGen)
    return `${
      yearAndGen
        ? [carYear, carGeneration].join(", ")
        : yearOrGen
        ? yearOrGen
        : "[missing year]"
    } ${carBrandAndModel || "[missing car make/model]"} ${
      carPartName || "[missing car part name]"
    }`;
};
