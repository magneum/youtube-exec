const progLogger = require("progress-estimator");
const youtubedl = require("youtube-dl-exec");
const logger = require("../../utils/logger.js");
const ffmpeg = require("fluent-ffmpeg");
const urlRegex = require("url-regex");
const readline = require("readline");
const chalk = require("chalk");
const path = require("path");
const fs = require("fs");

const plogger = progLogger();
const createFolderIfNotExists = (foldername) => {
  if (!foldername) {
    foldername = "ytdl-exec";
  }
  const outputFolder = path.resolve(process.cwd(), foldername);
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
    logger.info(`📂 Created folder: ${outputFolder}`);
  }
};

const fetchAudioDetails = async ({ url, quality }) => {
  logger.info("🔍 Fetching audio details...");
  try {
    const promise = youtubedl(url, {
      dumpSingleJson: true,
      noCheckCertificates: true,
      noWarnings: true,
      preferFreeFormats: true,
      addHeader: ["referer:youtube.com", "user-agent:googlebot"],
    });
    const result = await plogger(promise, "⏳ Obtaining...");
    const videoTitle = result.title;
    const reqAudio = findReqAudioFormat(result.formats, quality);
    return { reqAudio, videoTitle };
  } catch (err) {
    logger.info(chalk.red(`❌ Error fetching audio details: ${err.message}`));
    throw err;
  }
};

const findReqAudioFormat = (formats, quality) => {
  let reqAudio = null;
  logger.info(`🔍 Fetching Audio Quality: ${quality}`);
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
  } else {
    logger.info(chalk.red("❌ Error: Audio Quality supported: best,lowest"));
    throw new Error("Error: Audio Quality supported: best,lowest");
  }
};

const downloadAudioFile = async (ffmpegUrl, outputFile, quality, filename) => {
  let outputFilename;
  if (filename) {
    outputFilename = filename;
  } else {
    const videoTitle = path.basename(ffmpegUrl, path.extname(ffmpegUrl));
    outputFilename = `[${quality}]${videoTitle}`;
  }
  outputFile = path.join(outputFile, `${outputFilename}.mp3`);

  return new Promise((resolve, reject) => {
    const ffmpegCommand = ffmpeg()
      .input(ffmpegUrl)
      .audioBitrate(320)
      .toFormat("ipod")
      .on("start", () => {
        logger.info("📥 Audio download started...");
      })
      .on("progress", (progress) => {
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`⬇️ Downloading: ${progress.percent}%`);
      })
      .on("end", () => {
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        logger.info(
          chalk.bold(chalk.green("✅ Audio downloaded successfully!"))
        );
        resolve();
      })
      .on("error", (err) => {
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        logger.info(
          chalk.bold(
            chalk.red(`❌ Error downloading audio file: ${err.message}`)
          )
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
  logger.info(
    chalk.bold(
      chalk.bgCyanBright("🎥 Video Title:"),
      chalk.bold(chalk.italic(chalk.white(videoTitle)))
    )
  );
  Object.entries(reqAudio).forEach(([key, value]) => {
    switch (key) {
      case "url":
        url = value;
        break;
      case "fragments":
        logger.info(chalk.bold(`▶️ ${chalk.yellow(key)}:`));
        value.forEach((fragment, index) => {
          logger.info(chalk.bold(chalk.yellow(`- Fragment no ${index + 1}:`)));
          Object.entries(fragment).forEach(([fKey, fValue]) => {
            logger.info(
              `${chalk.bold(chalk.yellow(fKey))}: ${chalk.bold(
                chalk.italic(chalk.white(fValue))
              )}`
            );
          });
        });
        break;
      default:
        logger.info(
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
        logger.info(chalk.red("❌ Invalid URL format."));
        throw new Error("Invalid URL format.");
      }
      const { reqAudio, videoTitle } = await fetchAudioDetails({
        url,
        quality,
      });
      if (reqAudio) {
        url = displayAudioDetails(reqAudio, videoTitle, url);
        if (!foldername) {
          foldername = "ytdl-exec";
        }
        createFolderIfNotExists(foldername);
        let outputFilename;
        if (filename) {
          outputFilename = `${filename}`;
        } else {
          outputFilename = `[${quality}]${videoTitle}`;
        }
        await downloadAudioFile(url, foldername, quality, outputFilename);
      } else {
        logger.info(chalk.bold(chalk.yellow("⚠️ No audio details found.")));
      }
      resolve();
    } catch (err) {
      logger.info(chalk.red(`❌ An error occurred: ${err.message}`));
      reject(err);
    }
  });
};

module.exports = dlAudio;
