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

const fetchVideoAndAudioDetails = async ({ url, requestedResolution }) => {
  log("🔍 Fetching video and audio details...");
  try {
    const promise = youtubedl(url, {
      noWarnings: true,
      dumpSingleJson: true,
      preferFreeFormats: true,
      noCheckCertificates: true,
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

const dlVideoWithAudio = async ({ url, foldername, filename, resolution }) => {
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
        if (!foldername) {
          foldername = "ytdl-exec";
        }
        createFolderIfNotExists(foldername);
        const outputFilename = filename
          ? `${filename}.mp4`
          : `[${reqVideo.height}]${videoTitle}.mp4`;
        const outputPath = path.join(foldername, outputFilename);
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

export default dlVideoWithAudio;
