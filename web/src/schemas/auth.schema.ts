import z from "zod"

const loginFormSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, "Password is required"),
  })

export type LoginFormSchema = z.infer<typeof loginFormSchema>

export default loginFormSchema