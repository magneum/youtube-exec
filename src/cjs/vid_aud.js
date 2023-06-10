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
const progLogger = require("progress-estimator");
const youtubedl = require("youtube-dl-exec");
const logger = require("../../utils/logger.js");
const ffmpeg = require("fluent-ffmpeg");
const urlRegex = require("url-regex");
const readline = require("readline");
const chalk = require("chalk");
const path = require("path");
const fs = require("fs");

const log = (message) => {
  logger.info(message);
};

const plogger = progLogger();
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

const fetchVideoAndAudioDetails = async ({ url, requestedResolution }) => {
  log("🔍 Fetching video and audio details...");
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
    const reqAudio = findReqAudioFormat(result.formats);
    return { reqVideo, reqAudio, videoTitle };
  } catch (err) {
    throw new Error(
      `❌ Error fetching video and audio details: ${err.message}`
    );
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

const findReqAudioFormat = (formats) => {
  let reqAudio = null;
  const availableFormats = formats.filter(
    (format) => format.ext === "m4a" && format.format_note !== "none"
  );
  const sortedFormats = availableFormats.sort((a, b) => b.abr - a.abr);
  reqAudio = sortedFormats[0];
  return reqAudio;
};

const downloadVideoAndAudioFiles = async (
  videoUrl,
  audioUrl,
  outputFile,
  videoFormat
) => {
  return new Promise((resolve, reject) => {
    const ffmpegCommand = ffmpeg()
      .input(videoUrl)
      .input(audioUrl)
      .videoCodec("copy")
      .audioCodec("copy")
      .on("start", () => {
        log("📥 Video and audio download started...");
      })
      .on("progress", (progress) => {
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`⬇️ Downloading: ${progress.percent}%`);
      })
      .on("end", () => {
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        log(
          chalk.bold(chalk.green("✅ Video and audio downloaded successfully!"))
        );
        resolve();
      })
      .on("error", (err) => {
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        logger.error(
          chalk.bold(
            chalk.red(
              `❌ Error downloading video and audio files: ${err.message}`
            )
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

const displayVideoAndAudioDetails = (reqVideo, reqAudio, videoTitle, url) => {
  log(
    chalk.bold(
      chalk.bgCyanBright("🎥 Video Title:"),
      chalk.bold(chalk.italic(chalk.white(videoTitle)))
    )
  );
  if (reqVideo) {
    log(
      chalk.bold(
        chalk.yellow(
          `🎞️ Video Format: ${chalk.bold(
            chalk.italic(chalk.white(reqVideo.format_id))
          )}`
        )
      )
    );
    log(
      chalk.bold(
        chalk.yellow(
          `🖥️ Video Resolution: ${chalk.bold(
            chalk.italic(chalk.white(reqVideo.height))
          )}`
        )
      )
    );
    log(
      chalk.bold(
        chalk.yellow(
          `🔗 Video URL: ${chalk.bold(chalk.italic(chalk.white(reqVideo.url)))}`
        )
      )
    );
  } else {
    log(chalk.bold(chalk.yellow("⚠️ No video details found.")));
  }
  if (reqAudio) {
    log(
      chalk.bold(
        chalk.yellow(
          `🔊 Audio Format: ${chalk.bold(
            chalk.italic(chalk.white(reqAudio.format_id))
          )}`
        )
      )
    );
    log(
      chalk.bold(
        chalk.yellow(
          `🔉 Audio Bitrate: ${chalk.bold(
            chalk.italic(chalk.white(reqAudio.abr))
          )}kbps`
        )
      )
    );
    log(
      chalk.bold(
        chalk.yellow(
          `🔗 Audio URL: ${chalk.bold(chalk.italic(chalk.white(reqAudio.url)))}`
        )
      )
    );
  } else {
    log(chalk.bold(chalk.yellow("⚠️ No audio details found.")));
  }
  return url;
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

const dlAudioVideo = async ({ url, folder, filename, resolution }) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!validateUrl(url)) {
        throw new Error("❌ Invalid URL format.");
      }
      const { reqVideo, reqAudio, videoTitle } =
        await fetchVideoAndAudioDetails({
          url,
          requestedResolution: resolution,
        });
      if (reqVideo && reqAudio) {
        url = displayVideoAndAudioDetails(reqVideo, reqAudio, videoTitle, url);
        url = displayVideoDetails(reqVideo, videoTitle, url);
        if (!folder) {
          folder = "youtube-exec";
        }
        createFolderIfNotExists(folder);
        const outputFilename = filename
          ? `${filename}.mp4`
          : `[${reqVideo.height}]${videoTitle}.mp4`;
        const outputPath = path.join(folder, outputFilename);
        await downloadVideoAndAudioFiles(
          reqVideo.url,
          reqAudio.url,
          outputPath,
          reqVideo
        );
        log(chalk.bold(chalk.green("✅ Video downloaded successfully!")));
        resolve();
      } else {
        throw new Error("⚠️ No video and audio details found.");
      }
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = dlAudioVideo;
