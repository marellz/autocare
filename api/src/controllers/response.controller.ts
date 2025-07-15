import type { NextFunction, Request, Response } from "express";
import { InteractionTypes } from "../db/models/interaction.model";
import { sendMessageAndLogInteraction } from "../services/notification/notify.service";
import RequestService from "../services/request/request.service";

class ResponseController {
  static async sendClientResponse(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {

    try {
        const { requestId, body } = req.body;
        if (!requestId) throw new Error("Request id is required");
        if(!body) throw new Error("Message body is required")
        const _request = await RequestService.findById(requestId);
    
        if (!_request) throw new Error("Request not found");
        const request = _request?.get();
        
        // send message to client
        await sendMessageAndLogInteraction({
          phone: request.phone,
          message: body,
          requestId: request.id,
          // todo: maybe look at other options, like ADMIN_RESPONSE
          type: InteractionTypes.CLIENT_REQUEST_UPDATE, 
        });
    
        res.json({
          message: "ok",
        });
        
    } catch (error) {
        next(error)
    }
  }
}

export default ResponseController;
