<div align="center">
    <img src="https://i.postimg.cc/RhgzxBsM/logo.png" width="300" height="300">
</div>

# YouTube-Exec

🎥📥 **YouTube-Exec** - _Unleash the Power of YouTube Downloads!_

Looking to seize your favorite audio and video treasures from YouTube? Search no further! With the mighty YouTube-Exec, you can effortlessly capture those captivating audio and video gems. This versatile tool harnesses the incredible `youtube-dl-exec` library to extract all the juicy details, while the unstoppable `fluent-ffmpeg` library takes care of fetching the files. Bid farewell to limitations and greet a world of boundless possibilities!

|                |                                                                                                     |
| -------------- | --------------------------------------------------------------------------------------------------- |
| License        | [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)                            |
| Latest Version | [![npm](https://img.shields.io/npm/v/youtube-exec.svg)](https://www.npmjs.com/package/youtube-exec) |

## Installation

To embark on your YouTube downloading adventure with YouTube-Exec, you'll need to have Node.js installed on your system. Fear not! The installation process is as easy as a few simple commands:

- Using yarn or npm or pnpm

```bash
$ yarn add youtube-exec (fav)
$ npm install youtube-exec (-_-)
```

## Usage (without CLI usage)

### Download Audio 🔊 (without CLI usage)

Dive into the world of mesmerizing audio downloads from YouTube by utilizing the powerful _dlAudio_ function provided by our amazing module. Here's a sneak peek at how to use it:

```javascript
const { dlAudio } = require("youtube-exec"); // or import { dlAudio } from "youtube-exec";

// Using async/await
try {
  await dlAudio({
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    folder: "downloads", // optional @default: "youtube-exec"
    filename: "filename", // optional @default: video-title
    quality: "best", // best or lowest
  });
  console.log("Audio downloaded successfully! 🎵🎉");
} catch (err) {
  console.error("Oh no, an error occurred:", err.message);
}

// Using Promises
dlAudio({
  url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  folder: "downloads", // optional @default: "youtube-exec"
  filename: "filename", // optional @default: video-title
  quality: "best", // best or lowest
})
  .then(() => {
    console.log("Audio downloaded successfully! 🎵🎉");
  })
  .catch((err) => {
    console.error("Oh no, an error occurred:", err.message);
  });
```

Ready to immerse yourself in a world of audio wonders? Just replace **VIDEO_ID** with the actual ID of the YouTube video you desire to download audio from. You can customize the output folder where the audio file will be saved, specify an optional filename for the downloaded audio file, and even choose your preferred audio quality (e.g., "best" or "low").

### Download Video with Audio 🎥🔊 (without CLI usage)

Craving the complete audiovisual experience? YouTube-Exec has got you covered! Get ready to download those captivating videos with their accompanying audio effortlessly. Behold the mighty _dlAudioVideo_ function provided by our module:

```javascript
const { dlAudioVideo } = require("youtube-exec"); // or import { dlAudio } from "youtube-exec";

// Using async/await
try {
  await dlAudioVideo({
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    folder: "downloads", // optional @default: "youtube-exec"
    filename: "filename", // optional @default: video-title
    resolution: 720, // 144 | 240 | 360 | 480 | 720 | 1080 | 1440 | 2160 | 4320;
  });
  console.log("Video downloaded successfully! 🎥🎉");
} catch (err) {
  console.error("Oh no, an error occurred:", err.message);
}

// Using Promises
dlAudioVideo({
  url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  folder: "downloads", // optional @default: "youtube-exec"
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

### Download Video without Audio 🎥🔊 (without CLI usage)

Craving the complete non-audio visual experience? YouTube-Exec has got you covered! Get ready to download those captivating videos with no audio. Behold the mighty _dlVideo_ function provided by our module:

```javascript
const { dlVideo } = require("youtube-exec"); // or import { dlAudio } from "youtube-exec";

// Using async/await
try {
  await dlVideo({
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    folder: "downloads", // optional @default: "youtube-exec"
    filename: "filename", // optional @default: video-title
    resolution: 720, // 144 | 240 | 360 | 480 | 720 | 1080 | 1440 | 2160 | 4320;
  });
  console.log("Video downloaded successfully! 🎥🎉");
} catch (err) {
  console.error("Oh no, an error occurred:", err.message);
}

// Using Promises
dlVideo({
  url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  folder: "downloads", // optional @default: "youtube-exec"
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

## Usage (with CLI usage)

### Download Audio 🔊 (with CLI usage)

The "audio" command allows you to download audio from a YouTube video. It accepts the following options:

- `url`: The URL of the YouTube video (required).
- `folder`: The output folder name (optional).
- `filename`: The output filename (excluding extension) (optional, defaults to video title).
- `quality`: The audio quality ("best" or "lowest") (optional, defaults to "best").

Here's an example of how to use the "audio" command:

```bash
$ yarn global add youtube-exec # needs to be installed globally
$ youtube-exec audio --url "https://www.youtube.com/watch?v=dQw4w9WgXcQ" --folder "folder" --filename "filename" --quality "best"
```

### Download Video with Audio 🎥🔊 (with CLI usage)

The "video-with-audio" command allows you to download video with audio from a YouTube video. It accepts the following options:

- `url`: The URL of the YouTube video (required).
- `folder`: The output folder name (optional).
- `filename`: The output filename (excluding extension) (optional, defaults to video title).
- `resolution`: The video resolution (144, 240, 360, 480, 720, 1080, 1440, 2160, or 4320) (optional, defaults to 480).

Here's an example of how to use the "video-with-audio" command:

```bash
$ yarn global add youtube-exec # needs to be installed globally
$ youtube-exec video-with-audio --url "https://www.youtube.com/watch?v=dQw4w9WgXcQ" --folder "downloads" --filename "filename" --resolution 720
```

### Download Video without Audio 🎥🔊 (with CLI usage)

The "video" command allows you to download video without audio from a YouTube video. It accepts the following options:

- `url`: The URL of the YouTube video (required).
- `folder`: The output folder name (optional).
- `filename`: The output filename (excluding extension) (optional, defaults to video title).
- `resolution`: The video resolution (144, 240, 360, 480, 720, 1080, 1440, 2160, or 4320) (optional, defaults to 480).

Here's an example of how to use the "video-with-audio" command:

```bash
$ yarn global add youtube-exec # needs to be installed globally
$ youtube-exec video-with-audio --url "https://www.youtube.com/watch?v=dQw4w9WgXcQ" --folder "downloads" --filename "filename" --resolution 720
```

## Features

- Extract video and audio details from YouTube effortlessly
- Download audio files from YouTube videos
- Download videos with audio from YouTube
- Choose audio quality (best or lowest)
- Choose video resolution (144, 240, 360, 480, 720, 1080, 1440, 2160, or 4320)
- Simple and intuitive API
- CLI support for easy downloading

## License

YouTube-Exec is released under the [MIT License](LICENSE). Feel free to use, modify, and distribute it as you like.
