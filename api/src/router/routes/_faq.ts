import express from "express";
import { asyncHandler } from "../../handlers/async.handler";
import FAQController from "../../controllers/faq.controller";
import { validate } from "../../handlers/validation.handler";
import { faqSchema } from "../../schemas/faq.schema";
const router = express.Router();

const { getAll, create, update, destroy } = FAQController;

router.get("/", asyncHandler(getAll));
router.post("/", validate(faqSchema), asyncHandler(create));
router.put("/:id", validate(faqSchema.partial()), asyncHandler(update));
router.delete("/:id", asyncHandler(destroy));

export default router;
