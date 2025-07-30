import { ContactMessageStatusEnum } from "../db/models/contact.model";
import z from "zod";

export const contactMessageSchema = z.object({
  name: z.string(),
  phone: z.string().optional(),
  email: z.string().email(),
  message: z.string(),
  status: z
    .nativeEnum(ContactMessageStatusEnum)
    .default(ContactMessageStatusEnum.PENDING),
});

export const contactResponseSchema = z.object({
  message: z
    .string({ required_error: "Response message is required" })
    .min(1, "Response message is required"),
});
