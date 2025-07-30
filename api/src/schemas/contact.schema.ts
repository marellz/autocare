import { ContactMessageStatusEnum } from "../db/models/contact.model";
import z from "zod";

export const contactMessageSchema = z.object({
    name: z.string(),
    phone: z.string().optional(),
    email: z.string().email(),
    message: z.string(),
    status: z.nativeEnum(ContactMessageStatusEnum).default(ContactMessageStatusEnum.PENDING),
})