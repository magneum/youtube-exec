const chalk = require("chalk");
const moment = require("moment");
const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.printf(({ level, message }) => {
      let emoji;
      let timestampColor;
      let timestamp = moment().format("HH:mm:ss") + "(magneum)";
      switch (level) {
        case "info":
          emoji = "✨";
          level = chalk.bold(chalk.italic(level, ": "));
          message = chalk.bold(chalk.green(chalk.italic(message)));
          timestampColor = chalk.bgGreen;
          break;
        case "debug":
          emoji = "🐛";
          level = chalk.bold(chalk.italic(level, ": "));
          message = chalk.bold(chalk.blue(chalk.italic(message)));
          timestampColor = chalk.bgBlue;
          break;
        case "error":
          emoji = "❌";
          level = chalk.bold(chalk.italic(level, ": "));
          message = chalk.bold(chalk.red(chalk.italic(message)));
          timestampColor = chalk.bgRed;
          break;
        default:
          emoji = "ℹ️";
          level = chalk.bold(chalk.italic(level), ": ");
          message = chalk.bold(chalk.yellow(chalk.italic(message)));
          timestampColor = chalk.bgYellow;
          break;
      }
      timestamp = timestampColor(timestamp);
      return `${timestamp}${emoji} ${level} ${message}`;
    })
  ),
  transports: [new winston.transports.Console()],
});

module.exports = logger;
