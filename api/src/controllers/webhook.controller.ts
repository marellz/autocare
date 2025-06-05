import ReceiverService from "../services/receiver/receiver.service";
import { Request } from "express";
export default class WebHookController {
  static async receive(req: Request) {

    // DATA FROM WHATSAPP
    const { Body, ProfileName: name, WaId: phone } = req.body;

    /**
     * FROM A VENDOR TO AN EXISTING REQUEST
     */

    // find if there was an existing "pending" request and the phone matches one of the requested vendors

    const existingRequest = false; //await ReceiverService.findExistingRequest(phone);

    if (existingRequest) {
      /**
       * HANDLE INPUT AS A VENDOR RESPONSE
       */
      ReceiverService.handleVendorResponse(existingRequest, Body);
    } else {
      /**
       * HANDLE REQUEST AS A CLIENT REQUEST
       */

      await ReceiverService.handleNewRequest(Body, { name, phone });
      
    }

    return;
  }
}
