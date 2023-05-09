// @ts-check
import { z } from "zod";

export const serverSchema = z.object({
    DATABASE_URL: z.string().url(),
    DIRECT_URL: z.string().url(),
    NODE_ENV: z.enum(["development", "test", "production"]),
    NEXTAUTH_SECRET: process.env.NODE_ENV === "production" ? z.string().min(1) : z.string().min(1).optional(),
    NEXTAUTH_URL: z.preprocess(
        (str) => process.env.VERCEL_URL || str,
        process.env.VERCEL ? z.string() : z.string().url(),
    ),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),
    EMAIL_SERVER_USER: z.string(),
    EMAIL_SERVER_PASSWORD: z.string(),
});

export const clientSchema = z.object({
    NEXT_PUBLIC_NEXTAUTH_URL: z.preprocess(
        (str) => process.env.VERCEL_URL || str,
        process.env.VERCEL ? z.string() : z.string().url(),
    ),
    NEXT_PUBLIC_SUPABASE_URL: z.string(),
    NEXT_PUBLIC_SUPABASE_PUBLIC_ANON_KEY: z.string(),
    NEXT_PUBLIC_SUPABASE_IMAGE_URL: z.string()
});

export const clientEnv = {
    NEXT_PUBLIC_NEXTAUTH_URL: process.env.NEXT_PUBLIC_NEXTAUTH_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLIC_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_ANON_KEY,
    NEXT_PUBLIC_SUPABASE_IMAGE_URL: process.env.NEXT_PUBLIC_SUPABASE_IMAGE_URL
};