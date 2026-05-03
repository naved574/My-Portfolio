import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Please enter your name")
    .max(100, "Name must be under 100 characters"),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .max(255, "Email must be under 255 characters"),
  message: z
    .string()
    .trim()
    .min(10, "Message should be at least 10 characters")
    .max(1000, "Message must be under 1000 characters"),
});

export type ContactForm = z.infer<typeof contactSchema>;