import pinoHttp from "pino-http";
import { logger } from "../lib/logger";

export const requestLogger = pinoHttp({
  logger,
  customLogLevel(_req, res) {
    if (res.statusCode >= 500) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },
  customSuccessMessage(req, res) {
    return `${req.method} ${req.url} ${res.statusCode}`;
  },
  customErrorMessage(req, res) {
    return `${req.method} ${req.url} ${res.statusCode}`;
  },
  serializers: {
    req(req) {
      return {
        method: req.method,
        url: req.url,
        userAgent: req.headers["user-agent"],
      };
    },
    res(res) {
      return { statusCode: res.statusCode };
    },
  },
  // Skip logging for health checks to avoid noise
  autoLogging: {
    ignore(req) {
      return req.url === "/health";
    },
  },
});
