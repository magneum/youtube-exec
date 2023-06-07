const progLogger = require("progress-estimator");
const youtubedl = require("youtube-dl-exec");
const logger = require("../../utils/logger.js");
const ffmpeg = require("fluent-ffmpeg");
const urlRegex = require("url-regex");
const readline = require("readline");
const chalk = require("chalk");
const plogger = progLogger();
const path = require("path");
const fs = require("fs");

const log = (message) => {
  logger.info(message);
};

const fetchVideoAndAudioDetails = async ({ url, requestedResolution }) => {
  log("Fetching video and audio details...");
  try {
    const promise = youtubedl(url, { dumpSingleJson: true });
    const result = await plogger(promise, "Obtaining...");
    const videoTitle = result.title;
    const reqVideo = findReqVideoFormat(result.formats, requestedResolution);
    const reqAudio = findReqAudioFormat(result.formats);
    return { reqVideo, reqAudio, videoTitle };
  } catch (err) {
    throw new Error(`Error fetching video and audio details: ${err.message}`);
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
  outputFile = path.join(
    outputFile,
    `[${videoFormat.height}]${videoFormat.format_id}.mp4`
  );
  return new Promise((resolve, reject) => {
    const ffmpegCommand = ffmpeg()
      .input(videoUrl)
      .input(audioUrl)
      .videoCodec("copy")
      .audioCodec("copy")
      .on("start", () => {
        log("Video and audio download started...");
      })
      .on("progress", (progress) => {
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`Downloading: ${progress.percent}%`);
      })
      .on("end", () => {
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        log(
          chalk.bold(chalk.green("Video and audio downloaded successfully!"))
        );
        resolve();
      })
      .on("error", (err) => {
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        logger.error(
          chalk.bold(
            chalk.red(`Error downloading video and audio files: ${err.message}`)
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

const displayVideoAndAudioDetails = (reqVideo, reqAudio, videoTitle, url) => {
  log(
    chalk.bold(
      chalk.bgCyanBright("Video Title:"),
      chalk.bold(chalk.italic(chalk.white(videoTitle)))
    )
  );
  if (reqVideo) {
    log(
      chalk.bold(
        chalk.yellow(
          `Video Format: ${chalk.bold(
            chalk.italic(chalk.white(reqVideo.format_id))
          )}`
        )
      )
    );
    log(
      chalk.bold(
        chalk.yellow(
          `Video Resolution: ${chalk.bold(
            chalk.italic(chalk.white(reqVideo.height))
          )}`
        )
      )
    );
    log(
      chalk.bold(
        chalk.yellow(
          `Video URL: ${chalk.bold(chalk.italic(chalk.white(reqVideo.url)))}`
        )
      )
    );
  } else {
    log(chalk.bold(chalk.yellow("No video details found.")));
  }
  if (reqAudio) {
    log(
      chalk.bold(
        chalk.yellow(
          `Audio Format: ${chalk.bold(
            chalk.italic(chalk.white(reqAudio.format_id))
          )}`
        )
      )
    );
    log(
      chalk.bold(
        chalk.yellow(
          `Audio Bitrate: ${chalk.bold(
            chalk.italic(chalk.white(reqAudio.abr))
          )}kbps`
        )
      )
    );
    log(
      chalk.bold(
        chalk.yellow(
          `Audio URL: ${chalk.bold(chalk.italic(chalk.white(reqAudio.url)))}`
        )
      )
    );
  } else {
    log(chalk.bold(chalk.yellow("No audio details found.")));
  }
  return url;
};

const displayVideoDetails = (reqVideo, videoTitle, url) => {
  log(
    chalk.bold(
      chalk.bgCyanBright("Video Title:"),
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
  try {
    if (!validateUrl(url)) {
      throw new Error("Invalid URL format.");
    }
    const { reqVideo, reqAudio, videoTitle } = await fetchVideoAndAudioDetails({
      url,
      requestedResolution: resolution,
    });
    if (reqVideo && reqAudio) {
      url = displayVideoAndAudioDetails(reqVideo, reqAudio, videoTitle, url);
      url = displayVideoDetails(reqVideo, videoTitle, url);
      const outputFilename = filename || `${videoTitle}.mp4`;
      const outputPath = foldername
        ? path.join(foldername, outputFilename)
        : outputFilename;
      await downloadVideoAndAudioFiles(
        reqVideo.url,
        reqAudio.url,
        outputPath,
        reqVideo
      );
      log(chalk.bold(chalk.green("Video downloaded successfully!")));
    } else {
      throw new Error("No video and audio details found.");
    }
  } catch (err) {
    throw new Error(`Error downloading video and audio: ${err.message}`);
  }
};

module.exports = dlVideoWithAudio;

// const dlVideoWithAudio = async ({ url, foldername, filename, resolution }) => {
// try {
// if (!validateUrl(url)) {
// throw new Error("Invalid URL format.");
// }
// const { reqVideo, reqAudio, videoTitle } = await fetchVideoAndAudioDetails({
// url,
// requestedResolution: resolution,
// });
// if (reqVideo && reqAudio) {
// url = displayVideoAndAudioDetails(reqVideo, reqAudio, videoTitle, url);
// url = displayVideoDetails(reqVideo, videoTitle, url);
// if (foldername) {
// await downloadVideoAndAudioFiles(
// reqVideo.url,
// reqAudio.url,
// foldername,
// reqVideo
// );
// }
// log(chalk.bold(chalk.green("Video downloaded successfully!")));
// } else {
// throw new Error("No video and audio details found.");
// }
// } catch (err) {
// throw new Error(`Error downloading video and audio: ${err.message}`);
// }
// };
