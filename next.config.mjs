// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"));
import withPWA from "next-pwa";

const bundlePWA = withPWA({
  dest: "public",
  // document: "/",
});

// const withPWA = import("next-pwa")({
//   dest: "public",
//   document: "/",
// });

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
};
export default bundlePWA(config);
// export default config;
