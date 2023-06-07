const progLogger = require("progress-estimator");
const youtubedl = require("youtube-dl-exec");
const ffmpeg = require("fluent-ffmpeg");
const urlRegex = require("url-regex");
const readline = require("readline");
const moment = require("moment");
const winston = require("winston");
const chalk = require("chalk");
const path = require("path");
const fs = require("fs");

const plogger = progLogger();
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
          level = chalk.bold(chalk.bgGreen(chalk.italic(level, ": ")));
          message = chalk.bold(chalk.green(chalk.italic(message)));
          timestampColor = chalk.bgGreen;
          break;
        case "debug":
          emoji = "🐛";
          level = chalk.bold(chalk.bgBlue(chalk.italic(level, ": ")));
          message = chalk.bold(chalk.blue(chalk.italic(message)));
          timestampColor = chalk.bgBlue;
          break;
        case "error":
          emoji = "❌";
          level = chalk.bold(chalk.bgRed(chalk.italic(level, ": ")));
          message = chalk.bold(chalk.red(chalk.italic(message)));
          timestampColor = chalk.bgRed;
          break;
        default:
          emoji = "ℹ️";
          level = chalk.bold(chalk.bgYellow(chalk.italic(level), ": "));
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

const log = (message) => {
  logger.info(message);
};

const fetchAudioDetails = async ({ url, quality }) => {
  log("Fetching audio details...");
  try {
    const promise = youtubedl(url, { dumpSingleJson: true });
    const result = await plogger(promise, "Obtaining...");
    const videoTitle = result.title;
    const reqAudio = findReqAudioFormat(result.formats, quality);
    return { reqAudio, videoTitle };
  } catch (err) {
    throw new Error(`Error fetching audio details: ${err.message}`);
  }
};

const findReqAudioFormat = (formats, quality) => {
  let reqAudio = null;
  log("Fetching Audio Quality: " + quality);
  if (quality === "best") {
    let highestBitrate = 0;
    for (let i = 0; i < formats.length; i++) {
      const format = formats[i];
      if (format.acodec === "none" || format.vcodec !== "none") {
        continue;
      }
      const bitrate = format.tbr || format.abr;
      if (bitrate && bitrate > highestBitrate) {
        highestBitrate = bitrate;
        reqAudio = format;
      }
    }
    return reqAudio;
  } else if (quality === "lowest") {
    let lowBitrate = Infinity;
    for (let i = 0; i < formats.length; i++) {
      const format = formats[i];
      if (format.acodec === "none" || format.vcodec !== "none") {
        continue;
      }
      const bitrate = format.tbr || format.abr;
      if (bitrate && bitrate < lowBitrate) {
        lowBitrate = bitrate;
        reqAudio = format;
      }
    }
    return reqAudio;
  } else throw new Error(`Error Audio Quality supported: best,lowest `);
};

const createFolderIfNotExists = (foldername) => {
  if (!foldername || !fs.existsSync(foldername)) {
    foldername = "ytdl-exec";
    fs.mkdirSync(foldername);
  }
  return foldername;
};

const downloadAudioFile = async (ffmpegUrl, outputFile, quality, filename) => {
  outputFile = path.join(outputFile, `[${quality}]${filename}.mp3`);
  return new Promise((resolve, reject) => {
    const ffmpegCommand = ffmpeg()
      .input(ffmpegUrl)
      .audioBitrate(320)
      .toFormat("ipod")
      .on("start", () => {
        log("Audio download started...");
      })
      .on("progress", (progress) => {
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`Downloading: ${progress.percent}%`);
      })
      .on("end", () => {
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        log(chalk.bold(chalk.green("Audio downloaded successfully!")));
        resolve();
      })
      .on("error", (err) => {
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        logger.error(
          chalk.bold(chalk.red(`Error downloading audio file: ${err.message}`))
        );
        reject(err);
      })
      .saveToFile(outputFile);
    ffmpegCommand.run();
  });
};

const validateUrl = (url) => {
  const regex = urlRegex({ strict: false });
  return regex.test(url);
};

const displayAudioDetails = (reqAudio, videoTitle, url) => {
  log(
    chalk.bold(
      chalk.bgCyanBright("Video Title:"),
      chalk.bold(chalk.italic(chalk.white(videoTitle)))
    )
  );
  Object.entries(reqAudio).forEach(([key, value]) => {
    switch (key) {
      case "url":
        url = value;
        break;
      case "fragments":
        log(chalk.bold(`${chalk.yellow(key)}:`));
        value.forEach((fragment, index) => {
          log(chalk.bold(chalk.yellow(` no ${index + 1}:`)));
          Object.entries(fragment).forEach(([fKey, fValue]) => {
            log(
              `- ${chalk.bold(chalk.yellow(fKey))}: ${chalk.bold(
                chalk.italic(chalk.white(fValue))
              )}`
            );
          });
        });
        break;
      default:
        log(
          chalk.bold(
            chalk.yellow(
              `${key}: ${chalk.bold(chalk.italic(chalk.white(value)))}`
            )
          )
        );
        break;
    }
  });
  return url;
};

const dlAudio = ({ url, foldername, quality, filename }) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!validateUrl(url)) {
        throw new Error("Invalid URL format.");
      }
      const { reqAudio, videoTitle } = await fetchAudioDetails({
        url,
        quality,
      });
      if (reqAudio) {
        url = displayAudioDetails(reqAudio, videoTitle, url);
        foldername = createFolderIfNotExists(foldername);
        const outputFilename = filename || `${videoTitle}`;
        await downloadAudioFile(url, foldername, quality, outputFilename);
      } else {
        log(chalk.bold(chalk.yellow("No audio details found.")));
      }
      resolve();
    } catch (err) {
      logger.error(chalk.bold(chalk.red(`An error occurred: ${err.message}`)));
      reject(err);
    }
  });
};

module.exports = dlAudio;
