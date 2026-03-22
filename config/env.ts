function appEnv(): "development" | "staging" | "production" {
  const value = process.env.NEXT_PUBLIC_APP_ENV ?? "development";
  if (value === "development" || value === "staging" || value === "production") {
    return value;
  }
  return "development";
}

export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api/v1",
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  appEnv: appEnv(),
  isProduction: process.env.NEXT_PUBLIC_APP_ENV === "production",
  isDevelopment: (process.env.NEXT_PUBLIC_APP_ENV ?? "development") === "development"
} as const;
