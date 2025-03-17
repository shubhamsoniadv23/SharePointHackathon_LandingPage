// //  Create all validations here for all sections (e.g login, signup, etc)

// import { z } from "zod";
// import {
//   MAIL_REGEX,
//   MAX_MOBILE_LENGTH,
//   MIN_MOBILE_LENGTH,
//   PASSWORD_REGEX,
//   PHONE_NUMBER_REGEX,
// } from "./constant";

// // Common Schemas
// export const emailSchema = z.object({
//   email: z.string().email("Invalid email address"),
// });

// const isNotWhitespace = (value: string) => value.trim().length > 0;
// // const isNotSpecialChar = (value: string) =>
//   //!/[!@#$%^&*(),.?":{}|<>\-_=+]/.test(value);
// const isAlphabet = (value: string) =>
//   /^[a-zA-Z\s]*[a-zA-Z][a-zA-Z\s]*$/.test(value);

// export const nameSchema = z
//   .string()
//   .min(5, "Name is required")
//   .max(50, "Name must not exceed 50 characters")
//   .refine((value: string) => {
//     if (value == "") return true;
//     if (value.length > 0) {
//       return isNotWhitespace(value) && isAlphabet(value);
//     }
//   }, "Name must not be empty and should contain only alphabets");

// // Zod schema
// export const loginSchema = z.object({
//   email: z
//     .string()
//     .regex(MAIL_REGEX, "Please enter a valid email address")
//     .min(1, "Email is required"),
//   password: z
//     .string()
//     .regex(
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
//       "Password must be at least 8 characters long and contain one uppercase letter, one lowercase letter, one number and one special character"
//     )
//     .min(1, "Password is required"),
// });

// export const signupSchema = z.object({
//   fullName: z
//     .string()
//     .min(2, "Full name must be at least 2 characters")
//     .max(50, "Full name must be at most 50 characters")
//     .refine(isNotWhitespace, "Full name must not be empty"),
//   companyName: z
//     .string()
//     .min(2, "Company name must be at least 2 characters")
//     .max(100, "Company name must be at most 100 characters")
//     .refine(isNotWhitespace, "Company name must not be empty"),

//   companyAbbr: z
//     .string()
//     .min(2, "Company abbreviation must be at least 2 characters")
//     .max(10, "Company abbreviation must be at most 10 characters")
//     .refine(isNotWhitespace, "Company abbreviation must not be empty"),

//   phoneNumber: z
//     .string()
//     .regex(PHONE_NUMBER_REGEX, "Invalid phone number format")
//     .min(
//       MIN_MOBILE_LENGTH,
//       `Phone number must be at least ${MIN_MOBILE_LENGTH} characters long`
//     )
//     .max(
//       MAX_MOBILE_LENGTH,
//       `Phone number must be no more than ${MAX_MOBILE_LENGTH} characters long`
//     )

//     .refine(isNotWhitespace, "Must not be empty"),
//   requestedBy: z
//     .string()
//     .min(2, "Requested by name must be at least 2 characters")
//     .max(50, "Requested by name must be at most 50 characters")
//     .refine(isNotWhitespace, "Requested by name must not be empty"),
//   password: z
//     .string()
//     .min(8, "Password must be at least 8 characters")
//     .regex(
//       PASSWORD_REGEX,
//       "Password must include uppercase, lowercase, number, and special character"
//     ),

//   confirmPassword: z.string(),
//   isLocal: z.boolean(),
// });
