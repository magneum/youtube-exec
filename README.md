<div align="center">
    <img src="/images/logo.png" width="200" height="200">
</div>

# Ytdl-Exec

🎥📥 **Ytdl-Exec** - _Unleash the Power of YouTube Downloads!_

Looking to grab your favorite audio and video files from YouTube? Look no further! With the mighty Ytdl-Exec, you can effortlessly seize those captivating audio and video gems. This versatile tool harnesses the incredible `youtube-dl-exec` library to extract all the juicy details, while the unstoppable `fluent-ffmpeg` library takes care of downloading the files. Say goodbye to limitations and hello to a world of endless possibilities!

|                |                                                                                               |
| -------------- | --------------------------------------------------------------------------------------------- |
| License        | [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)                      |
| Latest Version | [![npm](https://img.shields.io/npm/v/ytdl-exec.svg)](https://www.npmjs.com/package/ytdl-exec) |

## Installation

To embark on your YouTube downloading adventure with Ytdl-Exec, you'll need to have Node.js installed on your system. Fear not! The installation process is as easy as a few simple commands:

- Using yarn or npm or pnpm

```bash
$ yarn add ytdl-exec (fav)
$ pnpm install ytdl-exec (fav)
$ npm install ytdl-exec (-_-)
```

## Usage

### Download Audio 🔊

Dive into the world of mesmerizing audio downloads from YouTube by utilizing the powerful _dlAudio_ function provided by our amazing module. Here's a sneak peek at how to use it:

```javascript
const { dlAudio } = require("ytdl-exec");
// or
import { dlAudio } from "ytdl-exec";

// Using async/await
try {
  await dlAudio({
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    foldername: "foldername", // optional
    filename: "filename", // optional @default: video-title
    quality: "best", // or lowest
  });
  console.log("Audio downloaded successfully! 🎵🎉");
} catch (err) {
  console.error("Oh no, an error occurred:", err.message);
}

// Using Promises
dlAudio({
  url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  foldername: "foldername", // optional
  filename: "filename", // optional @default: video-title
  quality: "best", // or lowest
})
  .then(() => {
    console.log("Audio downloaded successfully! 🎵🎉");
  })
  .catch((err) => {
    console.error("Oh no, an error occurred:", err.message);
  });
```

Ready to immerse yourself in a world of audio wonders? Just replace **VIDEO_ID** with the actual ID of the YouTube video you desire to download audio from. You can customize the output folder where the audio file will be saved, specify an optional filename for the downloaded audio file, and even choose your preferred audio quality (e.g., "best" or "low").

### Download Video with Audio 🎥🔊

Craving the complete audiovisual experience? Ytdl-Exec has got you covered! Get ready to download those captivating videos with their accompanying audio effortlessly. Behold the mighty _dlVideoWithAudio_ function provided by our module:

```javascript
const { dlVideoWithAudio } = require("ytdl-exec");
// or
import { dlVideoWithAudio } from "ytdl-exec";

// Using async/await
try {
  await dlVideoWithAudio({
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    foldername: "downloads", // optional
    filename: "filename", // optional @default: video-title
    resolution: 720, // 144 | 240 | 360 | 480 | 720 | 1080 | 1440 | 2160 | 4320;
  });
  console.log("Video downloaded successfully! 🎥🎉");
} catch (err) {
  console.error("Oh no, an error occurred:", err.message);
}

// Using Promises
dlVideoWithAudio({
  url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  foldername: "downloads", // optional
  filename: "filename", // optional @default: video-title
  resolution: 720, // 144 | 240 | 360 | 480 | 720 | 1080 | 1440 | 2160 | 4320;
})
  .then(() => {
    console.log("Video downloaded successfully! 🎥🎉");
  })
  .catch((err) => {
    console.error("Oh no, an error occurred:", err.message);
  });
```

Ready to dive into a world of stunning videos? Simply replace **VIDEO_ID** with the actual ID of the YouTube video you wish to download. You can customize the output folder where the video file will be saved, specify an optional filename for the downloaded video file, and even choose your desired resolution (e.g., 720).

### Optional Parameters

Both _dlAudio_ and _dlVideoWithAudio_ functions accept optional parameters:

- **filename** (optional): You can provide an optional filename for the downloaded file. If not specified, the video or audio title will be used as the filename.
- **foldername** (optional): You can provide an optional folder name for the downloaded file. If not specified, a folder named 'ytdl-exec' will be created and used.

Both functions can be used with _await_ when calling them within an _async_ function or with _.then()_ and _.catch()_ when using Promises to handle the asynchronous nature of the download process.

## Features

✨ Fetches video and audio details from a YouTube video using the _youtube-dl-exec_ library.
✨ Allows you to choose the desired video format and resolution, as well as audio quality.
✨ Downloads the video or audio file using _fluent-ffmpeg_ and saves it to the specified output folder.
✨ Provides logging functionality using the _winston_ library.

## Logging

The project uses the _winston_ library for logging. It creates a logger with different log levels (_info_, _debug_, _error_) and formats the log messages with colors and timestamps. The logs are displayed in the console.

### Customization

You can customize the logging behavior by modifying the `logger` object in the code. You can change the log levels, formatting, and transports (e.g., writing logs to a file instead of the console) according to your needs.

## License

This project is licensed under the MIT license. Feel free to use, modify, and distribute it as you see fit. See the [LICENSE](LICENSE) file for more information.
