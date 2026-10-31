import { z } from 'zod';

export const zSchema = z.object({
    name: z
        .string()
        .min(3, "Name must be at least 3 characters long")
        .max(50, "Name is too long"),
    email: z
        .string()
        .email("Invalid email address")
        .min(1, "Email is required"),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .max(128, "Password is too long")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        ),
    otp : z
        .string()
        .regex(/^\d{6}$/, "OTP must be exactly 6 digits and contain only numbers")
});