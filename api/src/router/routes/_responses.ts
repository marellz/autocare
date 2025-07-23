import express from "express";

import responseController from "../../controllers/response.controller";
import { validate } from "../../handlers/validation.handler";
import { clientResponseSchema } from "../../schemas/client-response.schema";
import { ensureAuthenticated } from "../../middleware/isAuthenticated";
const router = express.Router();

router.post("/", ensureAuthenticated, validate(clientResponseSchema), responseController.sendClientResponse);

export default router;
