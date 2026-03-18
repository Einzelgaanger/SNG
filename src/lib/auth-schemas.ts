import { z } from "zod";

export const stakeholderTypeValues = [
  "entrepreneur",
  "university",
  "investor",
  "government",
  "corporate",
  "nonprofit",
  "other",
] as const;

export const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email address").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
});

export const signUpSchema = signInSchema.extend({
  displayName: z.string().trim().min(2, "Display name must be at least 2 characters").max(80),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Enter a valid email address").max(255),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters").max(72),
    confirmPassword: z.string().min(8, "Confirm your password").max(72),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const onboardingSchema = z.object({
  stakeholderType: z.enum(stakeholderTypeValues),
  displayName: z.string().trim().min(2, "Your name is required").max(80),
  organizationName: z.string().trim().min(2, "Organization is required").max(120),
  region: z.string().trim().min(2, "Select your region").max(80),
  city: z.string().trim().max(80).optional().default(""),
  bio: z.string().trim().max(280).optional().default(""),
  fundingUsd: z.string().trim().max(32).optional().default(""),
  peopleReached: z.string().trim().max(32).optional().default(""),
  annualBudget: z.string().trim().max(32).optional().default(""),
  interests: z.array(z.string().trim().min(1).max(60)).max(6),
  initiatives: z.array(z.string().trim().min(1).max(80)).max(5),
});

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
export type OnboardingValues = z.infer<typeof onboardingSchema>;
