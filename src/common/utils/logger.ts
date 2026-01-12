import winston from "winston";

interface Colors {
  [key: string]: string;
}

const colors: Colors = {
  error: "\x1b[31m", // red
  warn: "\x1b[33m", // yellow
  info: "\x1b[32m", // green
  debug: "\x1b[36m", // cyan
  trace: "\x1b[90m", // gray
  verbose: "\x1b[35m", // magenta
};

function customLogger(level: string, message: string): string {
  const color = colors[level] || "\x1b[0m";
  const logMessage = `${color}[${level.toUpperCase()}]: ${message}\x1b[0m`;

  return logMessage;
}

// TODO: create a logger function
const logger = winston.createLogger({
  level: "debug",
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf((info) => {
          return customLogger(
            info.level,
            `[${info.timestamp}] ${info.message}`
          );
        })
      ),
    }),
  ],
});

export default logger;
