import { AuthConfig } from "convex/server";

const projectId = process.env.FIREBASE_PROJECT_ID;

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
