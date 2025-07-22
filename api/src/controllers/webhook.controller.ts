import ReceiverService from "../services/receiver/receiver.service";
import InteractionService from "../services/interaction/interaction.service";
import { matchRequestNumber } from "../services/callback/responseNumber.service";
import { matchLastInteraction } from "../services/callback/lastInteraction.service";
import { Request } from "express";
import { RequestChannelEnum } from "../db/models/request.model";

interface CallbackResponse {
  message: string;
  error?: string;
}

export const processCallback = async (
  req: Request,
): Promise<CallbackResponse> => {
  const { Body: body, ProfileName: name, WaId: phone } = req.body;

  /**
   * 1. MATCH Response number
   * match request number from the body
   */
  const { vendorRequest, trimmedBody } = await matchRequestNumber({
    body,
    phone,
  });

  if (vendorRequest) {
    return await ReceiverService.handleVendorResponse(vendorRequest, {
      body: trimmedBody,
      phone,
    });
  }

  /**
   * 2. Interaction
   * Match use case from last interaction, gets newest
   */

  const lastInteraction = await InteractionService.findByPhone(phone);

  if (lastInteraction) {
    return await matchLastInteraction(lastInteraction, {
      body,
      phone,
      name,
    });
  }

  /**
   * 3. Fresh user
   * New request pap
   */

  return await ReceiverService.handleNewRequest({
    body,
    name,
    phone,
    channel: RequestChannelEnum.WHATSAPP,
  });
};
