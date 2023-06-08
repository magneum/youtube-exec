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
      noWarnings: true,
      dumpSingleJson: true,
      preferFreeFormats: true,
      noCheckCertificates: true,
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

const streamAudio = async ({ url, quality, res }) => {
  if (!validateUrl(url)) {
    logger.info(chalk.red("❌ Invalid URL format."));
    return;
  }
  try {
    const { reqAudio, videoTitle } = await fetchAudioDetails({
      url,
      quality,
    });
    if (!reqAudio) {
      logger.info(chalk.bold(chalk.yellow("⚠️ No audio details found.")));
      return;
    }
    logger.info(chalk.bold(chalk.cyanBright(`🎥 Video Title: ${videoTitle}`)));
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
    });
    ffmpegCommand.on("error", (err) => {
      logger.info(
        chalk.bold(chalk.red(`❌ Error streaming audio: ${err.message}`))
      );
      res.status(500).end();
    });
    ffmpegCommand.pipe(res);

    return { reqAudio, videoTitle, stream: ffmpegCommand };
  } catch (err) {
    logger.info(chalk.red(`❌ An error occurred: ${err.message}`));
    res.status(500).end();
  }
};
export default streamAudio;

// import express from "express";
// const app = express();
// const port = 8080;
// app.get("/", async (req, res) => {
// const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
// const quality = req.query.quality || "best";
// try {
// const { reqAudio, videoTitle, stream } = await streamAudio({
// url,
// quality,
// res,
// });
// stream.on("start", () => {
// logger.info("📥 Audio streaming started...");
// });
// stream.on("end", () => {
// logger.info(chalk.bold(chalk.green("✅ Audio streaming finished!")));
// });
// stream.on("error", (err) => {
// logger.info(
// chalk.bold(chalk.red(`❌ Error streaming audio: ${err.message}`))
// );
// res.status(500).end();
// });
// } catch (err) {
// logger.info(chalk.red(`❌ An error occurred: ${err.message}`));
// res.status(500).end();
// }
// });

// app.listen(port, () => {
// console.log("http://localhost:8080");
// });
