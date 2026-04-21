import { Request, Response, NextFunction } from "express";
import { logger } from "../lib/logger";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  const status = err.statusCode || 500;

  logger.error({
    err: {
      message: err.message,
      stack: err.stack,
      name: err.name,
    },
    req: {
      method: req.method,
      url: req.url,
      body: req.body,
    },
    status,
  }, "Unhandled error");

  res.status(status).json({ error: err.message || "Internal Server Error" });
}