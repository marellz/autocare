import z from "zod";

export const loginFormSchema = z.object({
  username: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const registerFormSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const recoverPasswordFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  token: z.string(),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string({ required_error: "Password is required" })
      .min(8, "Password must be at least 8 characters long"),
    confirmPassword: z
      .string({ required_error: "Password confirmation is required" })
      .min(8, "Password confirmation must be at least 8 characters long"),
    token: z.string({
      required_error: "You need to verify that your're human",
    }),
    secure_token: z.string({ required_error: "Secure token is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });