import progLogger from "progress-estimator";
import logger from "../../utils/logger.mjs";
import youtubedl from "youtube-dl-exec";
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

const fetchVideoAndAudioDetails = async ({ url, requestedResolution }) => {
  log("🔍 Fetching video and audio details...");
  try {
    const result = await plogger(
      youtubedl(url, { dumpSingleJson: true }),
      "📥 Obtaining..."
    );
    const { title, formats } = result;
    const reqVideo = findReqFormat(formats, "mp4", requestedResolution);
    const reqAudio = findReqFormat(formats, "m4a");
    return { reqVideo, reqAudio, videoTitle: title };
  } catch (err) {
    throw new Error(
      `❌ Error fetching video and audio details: ${err.message}`
    );
  }
};

const findReqFormat = (formats, ext, resolution = null) => {
  const availableFormats = formats.filter(
    (format) => format.ext === ext && format.format_note !== "none"
  );
  const sortedFormats = availableFormats.sort((a, b) => a.height - b.height);
  return sortedFormats.find(
    (format) => !resolution || format.height >= resolution
  );
};

const downloadVideoAndAudioFiles = async (
  videoUrl,
  audioUrl,
  foldername,
  filename,
  videoFormat,
  videoTitle
) => {
  let output;
  if (!foldername) {
    foldername = "ytdl-exec";
  }
  await fs.mkdir(foldername, { recursive: true });

  if (!filename) {
    filename = `[${videoFormat.height}]${videoTitle}`;
  }
  output = path.join(foldername, `${filename}.mp4`);

  return new Promise((resolve, reject) => {
    const ffmpegCommand = ffmpeg()
      .input(videoUrl)
      .input(audioUrl)
      .videoCodec("copy")
      .audioCodec("copy")
      .on("start", () => {
        log("🎬 Video and audio download started...");
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
          `✅ ${chalk.bold(
            chalk.green("Video and audio downloaded successfully!")
          )}`
        );
        resolve();
      })
      .on("error", (err) => {
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        reject(
          new Error(
            `❌ Error downloading video and audio files: ${err.message}`
          )
        );
      })
      .save(output);

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
      chalk.bgCyanBright("📺 Video Title:"),
      chalk.bold(chalk.italic(chalk.white(videoTitle)))
    )
  );

  const displayFormat = (key, value) => {
    log(
      chalk.bold(
        chalk.yellow(`${key}: ${chalk.bold(chalk.italic(chalk.white(value)))}`)
      )
    );
  };

  const displayUrl = (value) => {
    url = value;
    displayFormat("url", value);
  };

  if (reqVideo) {
    Object.entries(reqVideo).forEach(([key, value]) => {
      if (key === "url") {
        displayUrl(value);
      } else {
        displayFormat(key, value);
      }
    });
  } else {
    throw new Error("❌ No video details found.");
  }

  if (reqAudio) {
    Object.entries(reqAudio).forEach(([key, value]) => {
      if (key === "url") {
        displayUrl(value);
      } else {
        displayFormat(key, value);
      }
    });
  } else {
    throw new Error("❌ No audio details found.");
  }

  return url;
};

const dlVideoWithAudio = async ({ url, foldername, filename, resolution }) => {
  try {
    if (!validateUrl(url)) {
      throw new Error("❌ Invalid URL format.");
    }

    const { reqVideo, reqAudio, videoTitle } = await fetchVideoAndAudioDetails({
      url,
      requestedResolution: resolution,
    });

    if (reqVideo && reqAudio) {
      url = displayVideoDetails(reqVideo, reqAudio, videoTitle, url);
      await downloadVideoAndAudioFiles(
        reqVideo.url,
        reqAudio.url,
        foldername,
        filename,
        reqVideo,
        videoTitle
      );
      log(`✅ ${chalk.bold(chalk.green("Video downloaded successfully!"))}`);
    } else {
      throw new Error("❌ No video and audio details found.");
    }
  } catch (err) {
    throw new Error(`❌ Error downloading video and audio: ${err.message}`);
  }
};

// async function realTimeTesting(options) {
//   try {
//     await dlVideoWithAudio(options);
//   } catch (error) {
//     throw new Error(error.message);
//   }
// }

// // Test case 1: Includes <foldername> <resolution> ?filename
// await realTimeTesting({
//   url: "https://youtu.be/Wgx6WvlOv_0",
//   foldername: "downloads",
//   resolution: 360,
// });

// // Test case 2: Includes <filename> <resolution> ?foldername
// await realTimeTesting({
//   url: "https://youtu.be/Wgx6WvlOv_0",
//   filename: "music",
//   resolution: 360,
// });

// // Test case 3: Includes <resolution> ?foldername ?filename
// await realTimeTesting({
//   url: "https://youtu.be/Wgx6WvlOv_0",
//   resolution: 360,
// });

export default dlVideoWithAudio;
