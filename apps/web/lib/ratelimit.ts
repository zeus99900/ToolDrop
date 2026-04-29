import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// Create a new Redis instance
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Create a rate limiter for sensitive actions (Auth, Payments)
export const sensitiveActionLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "10 m"), // 5 requests per 10 minutes
  analytics: true,
  prefix: "tooldrop_auth",
});

// Create a rate limiter for general API actions (Messaging, Search)
export const generalApiLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(15, "1 m"), // 15 requests per minute
  analytics: true,
  prefix: "tooldrop_api",
});
