import WebHookController from "#controllers/webhook.controller.js";
import { sendWhatsapp } from "#services/twilio/twillio.service.js";
import express from "express";
const router = express.Router();

router.post('/', WebHookController.receive)

router.post('/status', (req, res) => {
  console.log('Status update:', req)

})

export default router