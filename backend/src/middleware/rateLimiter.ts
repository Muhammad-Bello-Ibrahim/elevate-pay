import { Request, Response, NextFunction } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';

// Different rate limiters for different endpoints
const generalLimiter = new RateLimiterMemory({
  points: 100, // Number of points
  duration: 900, // Per 15 minutes
});

const authLimiter = new RateLimiterMemory({
  points: 5, // Number of attempts
  duration: 900, // Per 15 minutes
});

const otpLimiter = new RateLimiterMemory({
  points: 3, // Number of OTP requests
  duration: 600, // Per 10 minutes
});

export const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const key = req.ip || req.connection.remoteAddress || 'unknown';
    let currentLimiter = generalLimiter;

    // Use stricter limits for auth endpoints
    if (req.path.includes('/auth/login') || req.path.includes('/auth/signup')) {
      currentLimiter = authLimiter;
    } else if (req.path.includes('/auth/verify-otp') || req.path.includes('/auth/resend-otp')) {
      currentLimiter = otpLimiter;
    }

    await currentLimiter.consume(key);
    next();
  } catch (rejRes: any) {
    const remainingPoints = rejRes.remainingPoints || 0;
    const msBeforeNext = rejRes.msBeforeNext || 1;

    res.set('Retry-After', String(Math.round(msBeforeNext / 1000) || 1));
    res.set('X-RateLimit-Limit', String(generalLimiter.points));
    res.set('X-RateLimit-Remaining', String(remainingPoints));
    res.set('X-RateLimit-Reset', new Date(Date.now() + msBeforeNext).toISOString());

    res.status(429).json({
      success: false,
      message: 'Too many requests, please try again later.',
      retryAfter: Math.round(msBeforeNext / 1000)
    });
  }
};