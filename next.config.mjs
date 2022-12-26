// @ts-check

import { env } from "./src/env/client.mjs";

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import ("./src/env/server.mjs"));

/** @type {import("next").NextConfig} */

const config = {
    reactStrictMode: true,
    swcMinify: true,
    i18n: {
        locales: ["en"],
        defaultLocale: "en",
    },
    images: {
        domains: ["lh3.googleusercontent.com", env.NEXT_PUBLIC_SUPABASE_URL],
        minimumCacheTTL: 1,
		disableStaticImages: true
    },
};

export default config;