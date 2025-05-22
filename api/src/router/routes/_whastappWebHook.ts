import WebHookController from "../../controllers/webhook.controller";
import { asyncHandler } from "../../handlers/async.handler";
import express, { Request } from "express";
const router = express.Router();

router.post("/", asyncHandler(WebHookController.receive));

router.post("/status", (req: Request) => {
  console.log("Status update:", req);
});

export default router;
