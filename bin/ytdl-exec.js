#!/usr/bin/env node

const yargs = require("yargs");
const { dlVideoWithAudio, dlAudio } = require("../app/cjs/index.js");

yargs
  .command({
    command: "audio",
    describe: "Download audio from a YouTube video",
    builder: {
      url: {
        describe: "YouTube video URL",
        demandOption: true,
        type: "string",
      },
      foldername: {
        describe: "Output folder name",
        type: "string",
      },
      quality: {
        describe: "Audio quality (best/lowest)",
        type: "string",
        default: "best",
      },
      filename: {
        describe: "Output filename (excluding extension)",
        type: "string",
      },
    },
    handler: (argv) => {
      dlAudio({
        url: argv.url,
        foldername: argv.foldername,
        quality: argv.quality,
        filename: argv.filename,
      })
        .then(() => {
          console.log("Audio download completed.");
        })
        .catch((err) => {
          console.error("Error downloading audio:", err.message);
        });
    },
  })
  .command({
    command: "video-with-audio",
    describe: "Download video with audio from a YouTube video",
    builder: {
      url: {
        describe: "YouTube video URL",
        demandOption: true,
        type: "string",
      },
      foldername: {
        describe: "Output folder name",
        type: "string",
      },
      filename: {
        describe: "Output filename (excluding extension)",
        type: "string",
      },
      resolution: {
        describe: "Minimum video resolution",
        type: "number",
        default: 480,
      },
    },
    handler: (argv) => {
      dlVideoWithAudio({
        url: argv.url,
        foldername: argv.foldername,
        filename: argv.filename,
        resolution: argv.resolution,
      })
        .then(() => {
          console.log("Video with audio download completed.");
        })
        .catch((err) => {
          console.error("Error downloading video with audio:", err.message);
        });
    },
  })
  .demandCommand()
  .help().argv;
