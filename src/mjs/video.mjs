import progLogger from "progress-estimator";
import logger from "../../utils/logger.mjs";
import youtubedl from "youtube-dl-exec";
import ffmpeg from "fluent-ffmpeg";
import urlRegex from "url-regex";
import readline from "readline";
const plogger = progLogger();
import chalk from "chalk";
import path from "path";
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
        log(
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

const displayVideoDetails = (reqVideo, reqAudio, videoTitle, url) => {
  log(
    chalk.bold(
      chalk.bgCyanBright("Video Title:"),
      chalk.bold(chalk.italic(chalk.white(videoTitle)))
    )
  );

  if (reqVideo) {
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
  } else {
    log(chalk.bold(chalk.yellow("No video details found.")));
  }

  if (reqAudio) {
    Object.entries(reqAudio).forEach(([key, value]) => {
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
  } else {
    log(chalk.bold(chalk.yellow("No audio details found.")));
  }
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
      url = displayVideoDetails(reqVideo, reqAudio, videoTitle, url);
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
export default dlVideoWithAudio;

// dlVideoWithAudio({
// url: "https://youtu.be/Wgx6WvlOv_0",
// foldername: "downloads",
// resolution: 144,
// })
// .then(() => {
// console.log("Video and audio downloaded successfully!");
// })
// .catch((error) => {
// console.error("Error downloading video and audio:", error);
// });

// Can you now create a new code with the same logic but without the audio related stuffs. What i mean is i want this new code to be just the the dlAudio code but dlVideo.
