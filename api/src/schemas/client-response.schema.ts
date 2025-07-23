import z from "zod";

export const clientResponseSchema = z.object({
  message: z.string().min(1, "Message is required"),
  refund: z.boolean(),
});
