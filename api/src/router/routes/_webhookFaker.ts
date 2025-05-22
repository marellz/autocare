import express, { Request, Response } from "express";
import ReceiverService from "../../services/receiver/receiver.service";

const router = express.Router();
router.post("/", async (req: Request, res: Response) => {
  const { From: sender, Body, ProfileName: name, WaId: phone } = req.body;

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

    res.json({ to: "vendor", response: "Nothing yet" });
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
