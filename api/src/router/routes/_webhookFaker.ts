import express, { Request, Response } from "express";
import ReceiverService from "../../services/receiver/receiver.service";

const router = express.Router();
router.post("/", async (req: Request, res: Response) => {
  const { From: sender, Body, ProfileName: name, WaId: phone } = req.body;

  /**
   * FROM A VENDOR TO AN EXISTING REQUEST
   */

  // find if there was an existing "pending" request and the phone matches one of the requested vendors

  const existingVendorRequests = (
    await ReceiverService.findExistingRequests(phone)
  ).map((vr) => vr.get());

  console.log({ existing: existingVendorRequests.length });
  
  if (existingVendorRequests.length) {
    /**
     * HANDLE INPUT AS A VENDOR RESPONSE
     */

    let response =
      "We could not find a matching request for your response. Please try again.";

    if (existingVendorRequests.length === 1) {
      response = await ReceiverService.handleVendorResponse(
        existingVendorRequests[0],
        Body,
      );
    } else {
      const disambiguatedResponse =
        await ReceiverService.disambiguateVendorResponse(
          existingVendorRequests,
          Body,
        );

      if (disambiguatedResponse) {
        response = await ReceiverService.handleVendorResponse(
          disambiguatedResponse,
          Body,
        );
      } else {
        // todo: add as unresolved.. or treat as new request.
        response = "Could not disambiguate your response. Please try again."; // todo: use a proper reference.
      }
    }

    res.json({ to: "vendor", response });
  } else {
    /**
     * HANDLE REQUEST AS A CLIENT REQUEST
     */

    const { response } = await ReceiverService.handleClientRequest({
      sender,
      name,
      phone,
      Body,
    });

    res.json({
      to: "client",
      response,
    });
  }
});

export default router;
