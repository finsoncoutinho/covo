import type { RequestHandler } from 'express'

export function asyncHandler<
  P,
  ResBody,
  ReqBody,
  ReqQuery,
  Locals extends Record<string, unknown>,
>(
  handler: RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals>,
): RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals> {
  return (req, res, next) => {
    void Promise.resolve(handler(req, res, next)).catch(next)
  }
}
