#!/usr/bin/env node
// =====================================( youtube-exec: Unleash the Power of YouTube Downloads! )=============================================
// 🌟 Once upon a time in the vast realm of the Internet, a remarkable tool was born: YOUTUBE-EXEC. 📽️✨
//
// 🎥 Step into a world where you can effortlessly download the mesmerizing audio and captivating video content from YouTube. 🎵🎬💽
// 💡 Powered by the mighty and ingenious "youtube-dl-exec" library, this tool possesses the uncanny ability to extract the finest details from YouTube's vast kingdom of videos. 📚🔍💡
// ⚙️ Equipped with the seamless and reliable "fluent-ffmpeg" library, youtube-exec embarks on a quest to fetch files with utmost precision and grace.
// With each step, it transforms the abstract bits and bytes into a symphony of sights and sounds. 🔄⚙️🔊
// 🌟 Unlock the gates to a realm where your favorite audio harmonies and video treasures await.
// Dive into the enchanting world of YouTube's vast library, and let your imagination soar. 🎉🔑💎
// 🔓 Embrace the freedom to break free from limitations and embrace a world of boundless possibilities.
// Bid farewell to the boundaries that once held you back and embark on an adventure beyond your wildest dreams. 🚫🌍🔓💫
// 📖 This is the tale of youtube-exec, a tool that empowers you to shape your own narrative in the realm of YouTube.
//  Let your journey begin! 🚀🎬🔥
//
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
