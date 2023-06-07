import moment from "moment";
import winston from "winston";
import chalk from "chalk";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.printf(({ level, message }) => {
      let timestampColor;
      let timestamp = moment().format("HH:mm:ss") + "(magneum)";
      switch (level) {
        case "info":
          timestampColor = chalk.bgGreen;
          level = chalk.bold(chalk.italic(level, ": "));
          message = chalk.bold(chalk.green(chalk.italic(message)));
          break;
        case "debug":
          timestampColor = chalk.bgBlue;
          level = chalk.bold(chalk.italic(level, ": "));
          message = chalk.bold(chalk.blue(chalk.italic(message)));
          break;
        case "error":
          timestampColor = chalk.bgRed;
          level = chalk.bold(chalk.italic(level, ": "));
          message = chalk.bold(chalk.red(chalk.italic(message)));
          break;
        default:
          timestampColor = chalk.bgYellow;
          level = chalk.bold(chalk.italic(level), ": ");
          message = chalk.bold(chalk.yellow(chalk.italic(message)));
          break;
      }
      timestamp = timestampColor(timestamp);
      return `${timestamp} ${level} ${message}`;
    })
  ),
  transports: [new winston.transports.Console()],
});

export default logger;
