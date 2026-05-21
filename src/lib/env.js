/**
 * Utility helper to resolve the base URL dynamically across multiple environments
 * (Local Development, Vercel Previews, and Production).
 */
export const getBaseUrl = () => {
  // 1. Explicitly configured NEXTAUTH_URL takes absolute priority
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }

  // 2. Automatically detect dynamic Vercel deployment URLs (Production & Previews)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // 3. Fallback to local development server
  return "http://localhost:3000";
};
