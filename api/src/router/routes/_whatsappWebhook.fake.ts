import express, { Request, Response } from "express";
import { processCallback } from "../../controllers/webhook.controller";
import { asyncHandler } from "../../handlers/async.handler";

const router = express.Router();

router.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const response = await processCallback(req);
    
    const status = response.error ? 500 : 200;
    res.status(status).json(response);
  }),
);

export default router;
