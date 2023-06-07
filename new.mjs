import progLogger from "progress-estimator";
import youtubedl from "youtube-dl-exec";
import logger from "./utils/logger.mjs";
import ffmpeg from "fluent-ffmpeg";
import urlRegex from "url-regex";
import readline from "readline";
import chalk from "chalk";
import path from "path";
import fs from "fs/promises";

const plogger = progLogger();

const log = (message) => {
  logger.info(message);
};

const fetchAudioDetails = async ({ url, quality }) => {
  log("🔍 Fetching audio details...");
  try {
    const promise = youtubedl(url, { dumpSingleJson: true });
    const result = await plogger(promise, "📥 Obtaining...");
    const videoTitle = result.title;
    const reqAudio = findReqAudioFormat(result.formats, quality);
    return { reqAudio, videoTitle };
  } catch (err) {
    throw new Error(`❌ Error fetching audio details: ${err.message}`);
  }
};

const findReqAudioFormat = (formats, quality) => {
  let reqAudio = null;
  log("🎧 Fetching Audio Quality: " + quality);
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
  } else throw new Error(`❌ Error: Supported Audio Quality: best, lowest`);
};

const downloadAudioFile = async (ffmpegUrl, outputFile, quality, filename) => {
  outputFile = path.join(outputFile, `[${quality}]${filename}.mp3`);
  return new Promise((resolve, reject) => {
    const ffmpegCommand = ffmpeg()
      .input(ffmpegUrl)
      .audioBitrate(320)
      .toFormat("ipod")
      .on("start", () => {
        log("🎵 Audio download started...");
      })
      .on("progress", (progress) => {
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`⬇️ Downloading: ${progress.percent}%`);
      })
      .on("end", () => {
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        log(`✅ ${chalk.bold(chalk.green("Audio downloaded successfully!"))}`);
        resolve();
      })
      .on("error", (err) => {
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        logger.error(`❌ Error downloading audio file: ${err.message}`);
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

const displayAudioDetails = (reqAudio, videoTitle, url, debug) => {
  if (debug) {
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
                `${chalk.bold(chalk.yellow(fKey))}: ${chalk.bold(
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
  }
  return url;
};

const createFolderIfNotExists = async (foldername) => {
  try {
    await fs.mkdir(foldername);
    log(`📁 Created folder: ${foldername}`);
  } catch (err) {
    if (err.code !== "EEXIST") {
      throw err;
    }
  }
};

const dlAudio = async ({ url, foldername, quality, filename, debug }) => {
  try {
    if (!validateUrl(url)) {
      throw new Error("❌ Invalid URL format.");
    }
    const { reqAudio, videoTitle } = await fetchAudioDetails({ url, quality });
    if (reqAudio) {
      url = displayAudioDetails(reqAudio, videoTitle, url, debug);
      if (!foldername) {
        foldername = "ytdl-exec";
        await createFolderIfNotExists(foldername);
      } else {
        const folderExists = await fs
          .access(foldername)
          .then(() => true)
          .catch(() => false);
        if (!folderExists) {
          await createFolderIfNotExists(foldername);
        }
      }
      const outputFilename = filename || `${videoTitle}`;
      await downloadAudioFile(url, foldername, quality, outputFilename);
    } else {
      log(chalk.bold(chalk.yellow("❌ No audio details found.")));
    }
  } catch (err) {
    logger.error(`❌ An error occurred: ${err.message}`);
    throw err;
  }
};

export default dlAudio;

async function realTimeTesting(options) {
  try {
    await dlAudio(options);
  } catch (error) {
    throw new Error(error.message);
  }
}

// Test case with valid URL, existing folder, and custom filename:
await realTimeTesting({
  url: "https://youtu.be/Wgx6WvlOv_0",
  foldername: "downloads",
  filename: "custom_filename",
  quality: "best",
  debug: true,
});

// Test case with valid URL, non-existing folder, and default filename:
await realTimeTesting({
  url: "https://youtu.be/Wgx6WvlOv_0",
  foldername: "non_existing_folder",
  quality: "best",
  debug: false,
});

// Test case with invalid URL:
await realTimeTesting({
  url: "invalid_url",
  foldername: "downloads",
  filename: "magneum",
  quality: "best",
  debug: false,
});

// Test case with valid URL but no audio details found:
await realTimeTesting({
  url: "https://youtu.be/invalid_video",
  foldername: "downloads",
  filename: "magneum",
  quality: "best",
  debug: false,
});
