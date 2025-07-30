import express from "express";

import responseController from "../../controllers/response.controller";
import { validate } from "../../handlers/validation.handler";
import { clientResponseSchema } from "../../schemas/client-response.schema";
import { ensureAuthenticated } from "../../middleware/isAuthenticated";
import { contactResponseSchema } from "../../schemas/contact.schema";
import ContactController from "../../controllers/contact.controller";
const router = express.Router();

router.post("/", ensureAuthenticated, validate(clientResponseSchema), responseController.sendClientResponse);
router.post("/contact/:id", ensureAuthenticated, validate(contactResponseSchema), ContactController.sendResponse);

export default router;
