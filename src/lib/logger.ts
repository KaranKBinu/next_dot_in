export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

export interface LogContext {
  requestId?: string;
  userId?: string;
  userRole?: string;
  route?: string;
  operation?: string;
  durationMs?: number;
  [key: string]: any;
}

const SENSITIVE_KEYS = [
  "password",
  "passwordhash",
  "secret",
  "token",
  "authorization",
  "cookie",
  "signature",
  "razorpay_signature",
  "key",
  "cvv",
  "card",
];

const LOG_LEVEL_MAP: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
  fatal: 50,
};

function getMinLogLevel(): LogLevel {
  const envLevel = process.env.LOG_LEVEL?.toLowerCase() as LogLevel;
  if (envLevel && LOG_LEVEL_MAP[envLevel]) return envLevel;
  return process.env.NODE_ENV === "production" ? "info" : "debug";
}

function sanitizeObject(obj: any): any {
  if (!obj || typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  const cleanObj: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    const lowerKey = key.toLowerCase();

    if (SENSITIVE_KEYS.some((s) => lowerKey.includes(s))) {
      cleanObj[key] = "[REDACTED]";
    } else if (value && typeof value === "object") {
      cleanObj[key] = sanitizeObject(value);
    } else {
      cleanObj[key] = value;
    }
  }

  return cleanObj;
}

function formatLogOutput(level: LogLevel, context: LogContext, message: string) {
  const minLevel = getMinLogLevel();
  if (LOG_LEVEL_MAP[level] < LOG_LEVEL_MAP[minLevel]) return;

  const timestamp = new Date().toISOString();
  const cleanContext = sanitizeObject(context);

  if (process.env.NODE_ENV === "production") {
    // Machine-readable structured JSON output
    const jsonOutput = JSON.stringify({
      timestamp,
      level,
      message,
      ...cleanContext,
    });

    if (level === "error" || level === "fatal") {
      process.stderr.write(jsonOutput + "\n");
    } else {
      process.stdout.write(jsonOutput + "\n");
    }
  } else {
    // Human-readable dev formatting
    const levelStr = level.toUpperCase().padEnd(5);
    const reqStr = cleanContext.requestId ? `[${cleanContext.requestId}] ` : "";
    const opStr = cleanContext.operation ? `[${cleanContext.operation}] ` : "";
    const durStr = cleanContext.durationMs !== undefined ? ` (${cleanContext.durationMs}ms)` : "";

    const { requestId, operation, durationMs, ...extraContext } = cleanContext;
    const extraStr = Object.keys(extraContext).length > 0 ? ` | Context: ${JSON.stringify(extraContext)}` : "";

    const line = `${timestamp} ${levelStr} ${reqStr}${opStr}${message}${durStr}${extraStr}`;

    if (level === "error" || level === "fatal") {
      console.error(line);
    } else if (level === "warn") {
      console.warn(line);
    } else {
      console.log(line);
    }
  }
}

export const logger = {
  debug(context: LogContext, message: string) {
    formatLogOutput("debug", context, message);
  },
  info(context: LogContext, message: string) {
    formatLogOutput("info", context, message);
  },
  warn(context: LogContext, message: string) {
    formatLogOutput("warn", context, message);
  },
  error(context: LogContext, message: string) {
    formatLogOutput("error", context, message);
  },
  fatal(context: LogContext, message: string) {
    formatLogOutput("fatal", context, message);
  },
};
