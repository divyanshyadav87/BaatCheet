// app/lib/rateLimiter.ts
/** Simple in‑memory token‑bucket rate limiter */
type Bucket = {
  tokens: number;
  lastRefill: number;
};

const buckets = new Map<string, Bucket>();
const REFILL_INTERVAL = 60 * 1000; // 1 minute
const TOKENS_PER_INTERVAL = 30; // allow 30 requests per minute per key

export const isAllowed = (key: string, limit = TOKENS_PER_INTERVAL): boolean => {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { tokens: limit, lastRefill: now };
  // Refill tokens if interval passed
  const elapsed = now - bucket.lastRefill;
  if (elapsed > REFILL_INTERVAL) {
    const refillCount = Math.floor(elapsed / REFILL_INTERVAL);
    bucket.tokens = Math.min(limit, bucket.tokens + refillCount * TOKENS_PER_INTERVAL);
    bucket.lastRefill = now;
  }
  if (bucket.tokens > 0) {
    bucket.tokens -= 1;
    buckets.set(key, bucket);
    return true;
  }
  buckets.set(key, bucket);
  return false;
};
