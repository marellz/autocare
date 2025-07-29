import express from "express";
import { asyncHandler } from "../../handlers/async.handler";
import FAQController from "../../controllers/faq.controller";
import { validate } from "../../handlers/validation.handler";
import { faqSchema } from "../../schemas/faq.schema";
import { ensureAuthenticated } from "../../middleware/isAuthenticated";

const router = express.Router();

const { getAll, create, update, destroy } = FAQController;

router.get("/", asyncHandler(getAll));
router.post(
  "/",
  ensureAuthenticated,
  validate(faqSchema),
  asyncHandler(create),
);
router.put(
  "/:id",
  ensureAuthenticated,
  validate(faqSchema.partial()),
  asyncHandler(update),
);
router.delete("/:id", ensureAuthenticated, asyncHandler(destroy));

export default router;
