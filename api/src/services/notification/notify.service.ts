import { InteractionDirectionEnum, InteractionTypes } from "../../db/models/interaction.model";
import InteractionService from "../interaction/interaction.service";
import { sendWhatsapp } from "../twilio/twillio.service";

interface SendMessageAndLogInteractionPayload {
  phone: string;
  message: string;
  vendorId?: string;
  requestId: string;
  type: InteractionTypes;
  metadata?: JSON;
}

export const sendMessageAndLogInteraction = async ({
  phone,
  message,
  vendorId,
  requestId,
  type,
  metadata,
}: SendMessageAndLogInteractionPayload) => {
  await sendWhatsapp({ to: phone, body: message });

  await InteractionService.create({
    direction: InteractionDirectionEnum.OUTBOUND,
    phone,
    type,
    message,
    vendorId,
    metadata,
    requestId,
  });
};
