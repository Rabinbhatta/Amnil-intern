import winston from "winston";

// Define a custom format for console logs
const consoleFormat = winston.format.combine(
  winston.format.colorize(), // colors for levels
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return stack
      ? `[${timestamp}] ${level}:\n  Message: ${message}\n  Stack: ${stack}`
      : `[${timestamp}] ${level}:\n  Message: ${message}`;
  })
);

// Define a file-friendly format (no colors)
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return stack
      ? `[${timestamp}] ${level}:\n  Message: ${message}\n  Stack: ${stack}`
      : `[${timestamp}] ${level}:\n  Message: ${message}`;
  })
);

const logger = winston.createLogger({
  level: "info",
  format: fileFormat, // default format for file transports
  transports: [
    new winston.transports.Console({
      format: consoleFormat,
    }),
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

// Example usage: logger.info("Server started");

export default logger;
