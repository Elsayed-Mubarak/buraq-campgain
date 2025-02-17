import log4js from "log4js";
import dotenv from "dotenv";

dotenv.config();

// Customizing JSON layout for logging
log4js.addLayout("json", () => {
  return (logEvent) => {
    const logData = logEvent.data[0];

    // Ensure logData is an object before spreading
    const customLog = {
      level: logEvent.level.levelStr,
      ...(typeof logData === "object" ? logData : { message: logData }),
    };

    if (customLog.level === "ERROR" || customLog.level === "FATAL") {
      Object.assign(customLog, { log_dst: "datadog" });
    }

    return JSON.stringify(customLog);
  };
});

// Logging configuration
const log = {
  appenders: {
    out: { type: "stdout", layout: { type: "json" } },
  },
  categories: {
    default: { appenders: ["out"], level: process.env.LOG_LEVEL || "info" },
    terminator: { appenders: ["out"], level: process.env.LOG_LEVEL || "info" },
  },
};

//   logger.error({
//     event: "connectInstagramAccount",
//     module: "InstagramController",
//     message: "Error generating Instagram OAuth URL",
//     error: error.message,
//     stack: error.stack,
//     time: new Date().toISOString(),
//   });
// Now we configure log4js with our settings
log4js.configure(log);

// Creating logger instance
const logger = log4js.getLogger("terminator");

export default logger;
