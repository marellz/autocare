import z from "zod";

export const faqSchema = z.object({
  title: z.string().min(2, { message: "Every FAQ needs a title" }),
  content: z.string().min(2, { message: "Every FAQ needs content" }),
});
