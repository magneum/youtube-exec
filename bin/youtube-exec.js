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
const yargs = require("yargs");
const chalk = require("chalk");
const { dlAudioVideo, dlAudio, dlVideo } = require("../app/cjs/index.js");
const winston = require("winston");

// Configure Winston logger
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({ format: "HH:mm:ss" }),
    winston.format.printf(({ level, message, timestamp }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [new winston.transports.Console()],
});

const audioDescription = `${chalk.green(
  "🎵"
)} Download audio from a YouTube video`;
const videoWithAudioDescription = `${chalk.green(
  "🎥🎵"
)} Download video with audio from a YouTube video`;
const videoWithoutAudioDescription = `${chalk.green(
  "🎥"
)} Download video without audio from a YouTube video`;

yargs
  .scriptName(chalk.yellow("youtube-downloader"))
  .usage(chalk.bold("Usage: $0 <command> [options]"))
  .command(
    "audio",
    audioDescription,
    (yargs) => {
      yargs
        .option("url", {
          describe: `${chalk.cyan("YouTube video URL")}`,
          demandOption: true,
          type: "string",
        })
        .option("folder", {
          describe: `${chalk.cyan("Output folder name")}`,
          type: "string",
        })
        .option("quality", {
          describe: `${chalk.cyan("Audio quality (best/lowest)")}`,
          type: "string",
          default: "best",
        })
        .option("filename", {
          describe: `${chalk.cyan("Output filename (excluding extension)")}`,
          type: "string",
        });
    },
    async (argv) => {
      logger.info(audioDescription);

      try {
        await dlAudio(argv);

        logger.info(`${chalk.green("✅")} Audio download completed.`);
      } catch (err) {
        logger.error(
          `${chalk.red("❌")} Error downloading audio:`,
          err.message
        );
      }
    }
  )
  .command(
    "video-with-audio",
    videoWithAudioDescription,
    (yargs) => {
      yargs
        .option("url", {
          describe: `${chalk.cyan("YouTube video URL")}`,
          demandOption: true,
          type: "string",
        })
        .option("folder", {
          describe: `${chalk.cyan("Output folder name")}`,
          type: "string",
        })
        .option("filename", {
          describe: `${chalk.cyan("Output filename (excluding extension)")}`,
          type: "string",
        })
        .option("resolution", {
          describe: `${chalk.cyan(
            "Available video resolution (144 | 240 | 360 | 480 | 720 | 1080 | 1440 | 2160 | 4320)"
          )}`,
          type: "number",
          demandOption: true,
          default: 480,
        });
    },
    async (argv) => {
      logger.info(videoWithAudioDescription);

      try {
        await dlAudioVideo(argv);

        logger.info(
          `${chalk.green("✅")} Video with audio download completed.`
        );
      } catch (err) {
        logger.error(
          `${chalk.red("❌")} Error downloading video with audio:`,
          err.message
        );
      }
    }
  )
  .command(
    "video",
    videoWithoutAudioDescription,
    (yargs) => {
      yargs
        .option("url", {
          describe: `${chalk.cyan("YouTube video URL")}`,
          demandOption: true,
          type: "string",
        })
        .option("folder", {
          describe: `${chalk.cyan("Output folder name")}`,
          type: "string",
        })
        .option("filename", {
          describe: `${chalk.cyan("Output filename (excluding extension)")}`,
          type: "string",
        })
        .option("resolution", {
          describe: `${chalk.cyan(
            "Available video resolution (144 | 240 | 360 | 480 | 720 | 1080 | 1440 | 2160 | 4320)"
          )}`,
          type: "number",
          demandOption: true,
          default: 480,
        });
    },
    async (argv) => {
      logger.info(videoWithoutAudioDescription);

      try {
        await dlVideo(argv);

        logger.info(
          `${chalk.green("✅")} Video without audio download completed.`
        );
      } catch (err) {
        logger.error(
          `${chalk.red("❌")} Error downloading video without audio:`,
          err.message
        );
      }
    }
  )
  .demandCommand()
  .recommendCommands()
  .strict()
  .showHelpOnFail(true)
  .help().argv;

// Show default values for options when not provided
yargs.parse(process.argv.slice(2), (err, argv, output) => {
  if (output) {
    const defaultValuesRegex = /Default: (\S+)/g;
    const formattedOutput = output.replace(
      defaultValuesRegex,
      (match, defaultValue) => {
        return chalk.gray(`(Default: ${defaultValue})`);
      }
    );
    console.log(formattedOutput);
  }
});
