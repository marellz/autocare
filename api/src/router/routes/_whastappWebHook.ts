import { processCallback } from "../../controllers/webhook.controller";
import express, { Request } from "express";
const router = express.Router();

router.post("/", async (req: Request) => {
  processCallback(req);

  return;
});

router.post("/status", (req: Request) => {
  console.log("Status update:", req);
});

export default router;
