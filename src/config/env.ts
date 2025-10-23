type AppEnvName = "development" | "staging" | "production";

type EnvConfig = {
  apiBase: string;
  appUrl: string;
};

const FALLBACKS: Record<AppEnvName, EnvConfig> = {
  development: {
    apiBase: "http://localhost:8080/api/v1",
    appUrl: "http://localhost:3000",
  },
  staging: {
    apiBase: "https://staging-api.mypurirealty.com/api/v1",
    appUrl: "https://staging.mypurirealty.com",
  },
  production: {
    apiBase: "https://api.mypurirealty.com/api/v1",
    appUrl: "https://mypurirealty.com",
  },
};

const normalize = (value: string | undefined): AppEnvName => {
  const normalized = (value ?? "").toLowerCase();
  if (normalized.startsWith("prod")) return "production";
  if (normalized.startsWith("stag") || normalized === "preview") return "staging";
  return "development";
};

const sanitizeUrl = (value: string | undefined) => (value ?? "").replace(/\/+$/, "");

const name = normalize(
  process.env.NEXT_PUBLIC_APP_ENV ??
    process.env.APP_ENV ??
    process.env.VERCEL_ENV ??
    process.env.NODE_ENV ??
    "development",
);

const fallback = FALLBACKS[name];

const apiBase =
  sanitizeUrl(process.env.NEXT_PUBLIC_API_BASE) ||
  sanitizeUrl(process.env.NEXT_PUBLIC_API_BASE_URL);

const resolvedApiBase = apiBase || sanitizeUrl(fallback.apiBase);
const resolvedAppUrl = sanitizeUrl(process.env.NEXT_PUBLIC_APP_URL) || sanitizeUrl(fallback.appUrl);

export const env = {
  name,
  apiBase: resolvedApiBase,
  appUrl: resolvedAppUrl,
  isDevelopment: name === "development",
  isStaging: name === "staging",
  isProduction: name === "production",
};

if (!resolvedApiBase) {
  console.warn(
    "[env] NEXT_PUBLIC_API_BASE (or fallback) is not defined; API requests may fail. Check src/config/env.ts.",
  );
}
