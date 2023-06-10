#!/usr/bin/env node
// =====================================( youtube-exec by magneum )=============================================
// - 🎥📥 YOUTUBE-EXEC: UNLEASH THE POWER OF YOUTUBE DOWNLOADS!
//
// - Effortlessly download audio and video content from YouTube. 🎵🎬💽
// - Utilizes the powerful `youtube-dl-exec` library for extracting details. 📚🔍💡
// - Seamless fetching of files using the reliable `fluent-ffmpeg` library. 🔄⚙️🔊
// - Access and download your favorite audio and video treasures from YouTube. 🎉🔑💎
// - Say goodbye to limitations and enjoy a world of boundless possibilities. 🚫🌍🔓💫
//
// =====================================( youtube-exec by magneum )=============================================
import progLogger from "progress-estimator";
import logger from "../../utils/logger.mjs";
import youtubedl from "youtube-dl-exec";
import ffmpeg from "fluent-ffmpeg";
import urlRegex from "url-regex";
import readline from "readline";
import chalk from "chalk";
import path from "path";
import fs from "fs";

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

export default dlVideo;
