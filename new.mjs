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
    const result = await plogger(
      youtubedl(url, { dumpSingleJson: true }),
      "📥 Obtaining..."
    );
    const videoTitle = result.title;
    const reqAudio = findReqAudioFormat(result.formats, quality);
    return { reqAudio, videoTitle };
  } catch (err) {
    throw new Error(`❌ Error fetching audio details: ${err.message}`);
  }
};

const findReqAudioFormat = (formats, quality) => {
  log("🎧 Fetching Audio Quality: " + quality);
  const validFormats = formats.filter(
    (format) => format.acodec !== "none" && format.vcodec === "none"
  );
  if (quality === "best") {
    const reqAudio = validFormats.reduce((prevFormat, currFormat) => {
      const prevBitrate = prevFormat.tbr || prevFormat.abr || 0;
      const currBitrate = currFormat.tbr || currFormat.abr || 0;
      return currBitrate > prevBitrate ? currFormat : prevFormat;
    });
    return reqAudio || null;
  } else if (quality === "lowest") {
    const reqAudio = validFormats.reduce((prevFormat, currFormat) => {
      const prevBitrate = prevFormat.tbr || prevFormat.abr || Infinity;
      const currBitrate = currFormat.tbr || currFormat.abr || Infinity;
      return currBitrate < prevBitrate ? currFormat : prevFormat;
    });
    return reqAudio || null;
  } else {
    throw new Error(`❌ Error: Supported Audio Quality: best, lowest`);
  }
};

const downloadAudioFile = async (ffmpegUrl, outputFile, quality, filename) => {
  outputFile = path.join(outputFile, `[${quality}]${filename}.mp3`);
  return new Promise((resolve, reject) => {
    const ffmpegCommand = ffmpeg(ffmpegUrl)
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
      .save(outputFile);
    ffmpegCommand.run();
  });
};

const validateUrl = (url) => {
  const regex = urlRegex({ strict: false });
  return regex.test(url);
};

const displayAudioDetails = (reqAudio, videoTitle, url) => {
  log(
    `${chalk.bold(chalk.bgCyanBright("Video Title:"))} ${chalk.bold(
      chalk.italic(chalk.white(videoTitle))
    )}`
  );
  reqAudio.fragments.forEach((fragment, index) => {
    log(chalk.bold(chalk.yellow(`Fragment no ${index + 1}:`)));
    Object.entries(fragment).forEach(([fKey, fValue]) => {
      log(
        `${chalk.bold(chalk.yellow(fKey))}: ${chalk.bold(
          chalk.italic(chalk.white(fValue))
        )}`
      );
    });
  });
  return reqAudio.url;
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

const dlAudio = async ({ url, foldername, quality, filename }) => {
  try {
    if (!validateUrl(url)) {
      throw new Error("❌ Invalid URL format.");
    }
    const { reqAudio, videoTitle } = await fetchAudioDetails({ url, quality });
    if (reqAudio) {
      url = displayAudioDetails(reqAudio, videoTitle, url);
      foldername = foldername || "ytdl-exec";
      const folderExists = await fs
        .access(foldername)
        .then(() => true)
        .catch(() => false);
      if (!folderExists) {
        await createFolderIfNotExists(foldername);
      }
      const outputFilename = filename || videoTitle;
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

async function Testing(options, message) {
  log(chalk.bgCyan(chalk.whiteBright(message.toUpperCase())));
  try {
    await dlAudio(options);
  } catch (error) {
    throw new Error(error.message);
  }
}

await Testing(
  {
    url: "https://youtu.be/Wgx6WvlOv_0",
    foldername: "downloads",
    filename: "custom_filename",
    quality: "best",
  },
  "🛸 Test case with valid URL, existing folder, and custom filename:"
);

await Testing(
  {
    url: "https://youtu.be/Wgx6WvlOv_0",
    foldername: "non_existing_folder",
    quality: "best",
  },
  "🛸 Test case with valid URL, non-existing folder, and default filename:"
);

await Testing(
  {
    url: "https://youtu.be/invalid_video",
    foldername: "downloads",
    filename: "magneum",
    quality: "best",
  },
  "🛸 Test case with invalid URL:"
);
