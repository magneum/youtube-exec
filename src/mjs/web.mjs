// =====================================( ytdl-exec by magneum )=============================================
// - 🎥📥 Ytdl-Exec: Unleash the Power of YouTube Downloads!
// - Effortlessly seize captivating audio and video files from YouTube.
// - Powered by `youtube-dl-exec` and `fluent-ffmpeg` libraries.
// - Easy installation with Node.js using yarn or npm.
// - 🔊 **Download Audio**:
// - Utilize the `dlAudio` function for mesmerizing audio downloads.
// - Customize output folder, filename, and audio quality.
// - 🎥🔊 **Download Video with Audio**:
// - Use `dlVideoWithAudio` to download videos with accompanying audio.
// - Customize output folder, filename, and resolution.
// - Optional parameters for filename and foldername customization.
// - Features:
// - Fetch video and audio details using `youtube-dl-exec`.
// - Choose video format, resolution, and audio quality.
// - Download files using `fluent-ffmpeg` and save to specified folder.
// - Logging functionality with `winston` library.
// - Licensed under MIT for freedom to use, modify, and distribute.
// - Enhance your YouTube downloading experience with this powerful tool.
// =====================================( ytdl-exec by magneum )=============================================
import progLogger from "progress-estimator";
import logger from "../../utils/logger.mjs";
import youtubedl from "youtube-dl-exec";
import ffmpeg from "fluent-ffmpeg";
import urlRegex from "url-regex";
import chalk from "chalk";

const plogger = progLogger();

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

const validateUrl = (url) => {
  const regex = urlRegex({ strict: false });
  return regex.test(url);
};

const streamAudio = ({ url, quality, res }) => {
  return new Promise(async (resolve, reject) => {
    if (!validateUrl(url)) {
      logger.info(chalk.red("❌ Invalid URL format."));
      reject(new Error("Invalid URL format."));
      return;
    }

    try {
      const { reqAudio, videoTitle } = await fetchAudioDetails({
        url,
        quality,
      });
      if (!reqAudio) {
        logger.info(chalk.bold(chalk.yellow("⚠️ No audio details found.")));
        reject(new Error("No audio details found."));
        return;
      }

      logger.info(
        chalk.bold(chalk.cyanBright(`🎥 Video Title: ${videoTitle}`))
      );
      Object.entries(reqAudio).forEach(([key, value]) => {
        logger.info(
          chalk.bold(
            chalk.yellow(
              `${key}: ${chalk.bold(chalk.italic(chalk.white(value)))}`
            )
          )
        );
      });

      res.setHeader("Content-Type", "audio/mpeg");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${videoTitle}.mp3"`
      );

      const ffmpegCommand = ffmpeg(reqAudio.url)
        .audioBitrate(320)
        .format("mp3")
        .outputOptions("-f mp3");

      ffmpegCommand.on("start", () => {
        logger.info("📥 Audio streaming started...");
      });

      ffmpegCommand.on("end", () => {
        logger.info(chalk.bold(chalk.green("✅ Audio streaming finished!")));
        resolve({ reqAudio, videoTitle, stream: ffmpegCommand });
      });

      ffmpegCommand.on("error", (err) => {
        logger.info(
          chalk.bold(chalk.red(`❌ Error streaming audio: ${err.message}`))
        );
        reject(err);
      });

      ffmpegCommand.pipe(res);
    } catch (err) {
      logger.info(chalk.red(`❌ An error occurred: ${err.message}`));
      reject(err);
    }
  });
};

export default streamAudio;
