import express from "express";
import ContactController from "../../controllers/contact.controller";
import { asyncHandler } from "../../handlers/async.handler";
import { validate } from "../../handlers/validation.handler";
import { contactMessageSchema } from "../../schemas/contact.schema";
import { ensureAuthenticated } from "../../middleware/isAuthenticated";

const router = express.Router();
const { getAll, getById, create, update } = ContactController;

router.get("/", ensureAuthenticated, asyncHandler(getAll));
router.post("/", validate(contactMessageSchema), asyncHandler(create));
router.get("/:id", ensureAuthenticated, asyncHandler(getById));
router.put(
  "/:id",
  ensureAuthenticated,
  validate(contactMessageSchema.partial()),
  asyncHandler(update),
);

export default router;
