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
  // Disable strict mode so react beautiful dnd warnings don't fire
  // https://github.com/atlassian/react-beautiful-dnd/issues/2396
  // reactStrictMode: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
};
export default bundlePWA(config);
// export default config;
