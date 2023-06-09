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

const log = (message) => {
  logger.info(message);
};

const createFolderIfNotExists = (folder) => {
  if (!folder) {
    folder = "youtube-exec";
  }
  const outputFolder = path.resolve(process.cwd(), folder);
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
    logger.info(`📂 Created folder: ${outputFolder}`);
  }
};

const fetchVideoDetails = async ({ url, requestedResolution }) => {
  log("🔍 Fetching video details...");
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
    const reqVideo = findReqVideoFormat(result.formats, requestedResolution);
    return { reqVideo, videoTitle };
  } catch (err) {
    throw new Error(`❌ Error fetching video details: ${err.message}`);
  }
};

const findReqVideoFormat = (formats, requestedResolution) => {
  let reqVideo = null;
  const availableFormats = formats.filter(
    (format) => format.ext === "mp4" && format.format_note !== "none"
  );
  const sortedFormats = availableFormats.sort((a, b) => a.height - b.height);
  reqVideo = sortedFormats.find(
    (format) => format.height >= requestedResolution
  );
  return reqVideo;
};

const downloadVideoFile = async (videoUrl, outputFile, videoFormat) => {
  return new Promise((resolve, reject) => {
    const ffmpegCommand = ffmpeg()
      .input(videoUrl)
      .videoCodec("copy")
      .on("start", () => {
        log("📥 Video download started...");
      })
      .on("progress", (progress) => {
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`⬇️ Downloading: ${progress.percent}%`);
      })
      .on("end", () => {
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        log(chalk.bold(chalk.green("✅ Video downloaded successfully!")));
        resolve();
      })
      .on("error", (err) => {
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        logger.error(
          chalk.bold(
            chalk.red(`❌ Error downloading video file: ${err.message}`)
          )
        );
        reject(err);
      })
      .save(outputFile);
    ffmpegCommand.run();
  });
};

const validateUrl = (url) => {
  const regex = urlRegex({ strict: false });
  return regex.test(url);
};

const displayVideoDetails = (reqVideo, videoTitle, url) => {
  log(
    chalk.bold(
      chalk.bgCyanBright("🎥 Video Title:"),
      chalk.bold(chalk.italic(chalk.white(videoTitle)))
    )
  );
  Object.entries(reqVideo).forEach(([key, value]) => {
    switch (key) {
      case "url":
        url = value;
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

const dlVideo = async ({ url, folder, filename, resolution }) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!validateUrl(url)) {
        throw new Error("❌ Invalid URL format.");
      }
      const { reqVideo, videoTitle } = await fetchVideoDetails({
        url,
        requestedResolution: resolution,
      });
      if (reqVideo) {
        url = displayVideoDetails(reqVideo, videoTitle, url);
        if (!folder) {
          folder = "youtube-exec";
        }
        createFolderIfNotExists(folder);
        const outputFilename = filename
          ? `${filename}.mp4`
          : `[${reqVideo.height}]${videoTitle}.mp4`;
        const outputPath = path.join(folder, outputFilename);
        await downloadVideoFile(reqVideo.url, outputPath, reqVideo);
        resolve();
      } else {
        throw new Error("⚠️ No video details found.");
      }
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = dlVideo;
