import express from "express";

import responseController from "../../controllers/response.controller";
import { validate } from "../../handlers/validation.handler";
import { clientResponseSchema } from "../../schemas/client-response.schema";
const router = express.Router();

router.post("/", validate(clientResponseSchema), responseController.sendClientResponse);

export default router;
