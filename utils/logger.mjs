#!/usr/bin/env node
// =====================================( youtube-exec by magneum )=============================================
// - 🎥📥 YouTube-Exec: Unleash the Power of YouTube Downloads!
// - Effortlessly seize captivating audio and video files from YouTube.
// - Powered by `youtube-dl-exec` and `fluent-ffmpeg` libraries.
// - Easy installation with Node.js using yarn or npm.
// - 🔊 **Download Audio**:
// - Utilize the `dlAudio` function for mesmerizing audio downloads.
// - Customize output folder, filename, and audio quality.
// - 🎥🔊 **Download Video with Audio**:
// - Use `dlAudioVideo` to download videos with accompanying audio.
// - Customize output folder, filename, and resolution.
// - Optional parameters for filename and folder customization.
// - Features:
// - Fetch video and audio details using `youtube-dl-exec`.
// - Choose video format, resolution, and audio quality.
// - Download files using `fluent-ffmpeg` and save to specified folder.
// - Logging functionality with `winston` library.
// - Licensed under MIT for freedom to use, modify, and distribute.
// - Enhance your YouTube downloading experience with this powerful tool.
// =====================================( youtube-exec by magneum )=============================================
import moment from "moment";
import winston from "winston";
import chalk from "chalk";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.printf(({ level, message }) => {
      let timestampColor;
      let timestamp = moment().format("HH:mm:ss");
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
