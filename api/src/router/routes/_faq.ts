import express from "express";
import { asyncHandler } from "../../handlers/async.handler";
import FAQController from "../../controllers/faq.controller";
const router = express.Router();

const { getAll, create, update, destroy } = FAQController;

router.get("/", asyncHandler(getAll));
router.post("/", asyncHandler(create));
router.put("/:id", asyncHandler(update));
router.delete("/:id", asyncHandler(destroy));

export default router;
