import z from "zod";

export const faqFormSchema = z.object({
    title: z.string().min(2, 'FAQ title is required'),
    content: z.string().min(2, 'FAQ content is required'),
})

export type FAQFormSchema = z.infer<typeof faqFormSchema>