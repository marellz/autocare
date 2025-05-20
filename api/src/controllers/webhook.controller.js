import { sendWhatsapp } from "#services/twilio/twillio.service.js";

export default class WebHookController {
  static async receive(req, res) {
    const { From, Body, ProfileName } = req.body;

    const sender = From;
    const name = ProfileName;

    // find pending conversation with sender.
    // if there was a pending conversation: repeat:
    if(pendingRequest){
        // updateRequest

        // grab pending details, fill in. if missing, repeat. if not, close conversation.

        return
    }
    // else: new

    // pass to AI to discern what they are looking for from the body

    const { item, pending } = ParserService.parseRequest(Body);

    if (pending) {
      const pendingList = pending.join(",");

      // update conversation
      await sendWhatsapp({
        to: From,
        body: "Still missing a few details: " + pendingList,
      });

      res.status(200);
    } else {
      await sendWhatsapp({
        to: From,
        body: "Thank you for your request. Well take it from here and get back soon.",
      });
      
      // complete conversation

      res.status(200);
    }

    // pass it to vendorRequestService.create

    await sendWhatsapp({
      from: "whatsapp:+14155238886",
      to: req.body.From,
      body: `Hello ${req.body.ProfileName}`,
    });

    res.send("<Response></Response>"); // WhatsApp expects a 200 XML response
  }
}
