<div align="center">
    <img src="/images/logo.png" width="200" height="200">
</div>

# YouTube Downloader Executor

🎥📥 YouTube Downloader Executor is a versatile tool for downloading audio and video files from YouTube. It utilizes the `youtube-dl-exec` library to extract video and audio details and the `fluent-ffmpeg` library to download the files. With YouTube Downloader Executor, you can easily fetch video and audio details, choose the desired format and resolution, and download the files to your specified location.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Installation

To use YouTube Downloader Executor, you need to have Node.js installed on your system. You can install the project dependencies by running the following command:

```bash
npm install ytdl-exec or yarn add ytdl-exec
```

## Usage

### Download Audio 🔊

To download audio from a YouTube video, you can use the `dlAudio` function provided by the module. Here's an example of how to use it:

```javascript
const { dlAudio } = require("ytdl-exec");

const url = "https://www.youtube.com/watch?v=VIDEO_ID";
const filename = "optional-filename";
const foldername = "downloads";
const quality = "best";

// Using async/await
try {
  await dlAudio({ url, foldername, filename, quality });
  console.log("Audio downloaded successfully! 🎵🎉");
} catch (err) {
  console.error("An error occurred:", err.message);
}

// Using Promises
dlAudio({ url, foldername, filename, quality })
  .then(() => {
    console.log("Audio downloaded successfully! 🎵🎉");
  })
  .catch((err) => {
    console.error("An error occurred:", err.message);
  });
```

Make sure to replace **VIDEO_ID** with the actual ID of the YouTube video you want to download audio from. You can specify the output folder where the audio file will be saved, an optional filename for the downloaded audio file, and the desired audio quality (e.g., "best" or "low").

### Download Video with Audio 🎥🔊

To download a video with its audio from a YouTube URL, you can use the `dlVideoWithAudio` function provided by the module. Here's an example of how to use it:

```javascript
const { dlVideoWithAudio } = require("ytdl-exec");

const url = "https://www.youtube.com/watch?v=VIDEO_ID";
const filename = "optional-filename";
const foldername = "downloads";
const resolution = 720;

// Using async/await
try {
  await dlVideoWithAudio({ url, foldername, filename, resolution });
  console.log("Video downloaded successfully! 🎥🎉");
} catch (err) {
  console.error("An error occurred:", err.message);
}

// Using Promises
dlVideoWithAudio({ url, foldername, filename, resolution })
  .then(() => {
    console.log("Video downloaded successfully! 🎥🎉");
  })
  .catch((err) => {
    console.error("An error occurred:", err.message);
  });
```

Make sure to replace **VIDEO_ID** with the actual ID of the YouTube video you want to download. You can specify the output folder where the video file will be saved, an optional filename for the downloaded video file, and the desired resolution (e.g., 720).

### Optional Parameters

Both

`dlAudio` and `dlVideoWithAudio` functions accept optional parameters:

- **filename** (optional): You can provide an optional filename for the downloaded file. If not specified, the video or audio title will be used as the filename.

Both functions can be used with `await` when calling them within an `async` function, or with `.then()` and `.catch()` when using Promises to handle the asynchronous nature of the download process.

## Features

✨ Fetches video and audio details from a YouTube video using the `youtube-dl-exec` library.
✨ Allows you to choose the desired video format and resolution, as well as audio quality.
✨ Downloads the video or audio file using `fluent-ffmpeg` and saves it to the specified output folder.
✨ Provides logging functionality using the `winston` library.

## Logging

The project uses the `winston` library for logging. It creates a logger with different log levels (`info`, `debug`, `error`) and formats the log messages with colors and timestamps. The logs are displayed in the console.

### Customization

You can customize the logging behavior by modifying the `logger` object in the code. You can change the log levels, formatting, and transports (e.g., writing logs to a file instead of the console) according to your needs.

## License

This project is licensed under the MIT license. Feel free to use, modify, and distribute it as you see fit. See the [LICENSE](LICENSE) file for more information.
