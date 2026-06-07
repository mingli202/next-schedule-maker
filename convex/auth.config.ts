import { AuthConfig } from "convex/server";
import { env } from "./_generated/server";

const projectId =
  env.ENV === "DEV" ? env.DEV_FIREBASE_PROJECT_ID : env.FIREBASE_PROJECT_ID;

if (!projectId) {
  throw new Error("firebase project id unset");
}

const config = {
  providers: [
    {
      type: "customJwt",
      applicationID: projectId,
      issuer: `https://securetoken.google.com/${projectId}`,
      jwks: "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com",
      algorithm: "RS256",
    },
  ],
} satisfies AuthConfig;

export default config;
