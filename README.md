 <h1 align="left"><b><b>📥🎥 YouTube-Exec 🎥📥</b></b></h1>
 
### **⭐️ If you find YouTube-Exec useful, give it a star on [GitHub](https://github.com/magneum/youtube-exec)**

<div align="left">
    <img src="https://i.postimg.cc/RhgzxBsM/logo.png" width="300" height="300">
</div>

## **Unleash the Power of YouTube Downloads!** 💪🔥💻

- Effortlessly download audio and video content from YouTube. 🎵🎬💽
- Utilizes the powerful `youtube-dl-exec` library for extracting details. 📚🔍💡
- Seamless fetching of files using the reliable `fluent-ffmpeg` library. 🔄⚙️🔊
- Access and download your favorite audio and video treasures from YouTube. 🎉🔑💎
- Say goodbye to limitations and enjoy a world of boundless possibilities. 🚫🌍🔓💫

|                |                                                                                                     |
| -------------- | --------------------------------------------------------------------------------------------------- |
| License        | [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)                            |
| Latest Version | [![npm](https://img.shields.io/npm/v/youtube-exec.svg)](https://www.npmjs.com/package/youtube-exec) |

<h1 align="left"><b><b>Installation: 📥💻🔧</b></b></h1>

To embark on your YouTube downloading adventure with YouTube-Exec, you'll need to have Node.js installed on your system. Fear not! The installation process is as easy as a few simple commands:

- Using yarn or npm or pnpm

```
$ yarn add youtube-exec
$ npm install youtube-exec
$ pnpm install youtube-exec
```

<h1 align="left"><b>Usage (w/o CLI): 🖥️🔧📚</b></h1>

<details>
<summary><b><i>🎵 Download Audio 🔊</i></b></summary>

To download audio from YouTube, you can use the `dlAudio` function provided by YouTube-Exec. Here's an example of how to use it:

```javascript
const { dlAudio } = require("youtube-exec");

// Using async/await
try {
  await dlAudio({
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    folder: "downloads", // optional, default: "youtube-exec"
    filename: "filename", // optional, default: video title
    quality: "best", // or "lowest"; default: "best"
  });
  console.log("Audio downloaded successfully! 🔊🎉");
} catch (err) {
  console.error("An error occurred:", err.message);
}

// Using Promises
dlAudio({
  url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  folder: "downloads", // optional, default: "youtube-exec"
  filename: "filename", // optional, default: video title
  quality: "best", // or "lowest"; default: "best"
})
  .then(() => {
    console.log("Audio downloaded successfully! 🔊🎉");
  })
  .catch((err) => {
    console.error("An error occurred:", err.message);
  });
```

</details>

<details>
<summary><b><i>🎥🔊 Download Video with Audio 🎥🔊</i></b></summary>

To download videos with audio from YouTube, you can use the `dlAudioVideo` function provided by YouTube-Exec. Here's an example of how to use it:

```javascript
const { dlAudioVideo } = require("youtube-exec");

// Using async/await
try {
  await dlAudioVideo({
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    folder: "downloads", // optional, default: "youtube-exec"
    filename: "filename", // optional, default: video title
    resolution: 720, // 144, 240, 360, 480, 720, 1080, 1440, 2160, or 4320; default: 480
  });
  console.log("Video downloaded successfully! 🎥🔊🎉");
} catch (err) {
  console.error("An error occurred:", err.message);
}

// Using Promises
dlAudioVideo({
  url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  folder: "downloads", // optional, default: "youtube-exec"
  filename: "filename", // optional, default: video title
  resolution: 720, // 144, 240, 360, 480, 720, 1080, 1440, 2160, or 4320; default: 480
})
  .then(() => {
    console.log("Video downloaded successfully! 🎥🔊🎉");
  })
  .catch((err) => {
    console.error("An error occurred:", err.message);
  });
```

</details>

<details>
<summary><b><i>🎥 Download Video w/o Audio 🎥</i></b></summary>

To download videos without audio from YouTube, you can use the `dlVideo` function provided by YouTube-Exec. Here's an example of how to use it:

```javascript
const { dlVideo } = require("youtube-exec");

// Using async/await
try {
  await dlVideo({
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    folder: "downloads", // optional, default: "youtube-exec"
    filename: "filename", // optional, default: video title
    resolution: 720, // 144, 240, 360, 480, 720, 1080, 1440, 2160, or 4320; default: 480
  });
  console.log("Video downloaded successfully! 🎥🎉");
} catch (err) {
  console.error("An error occurred:", err.message);
}

// Using Promises
dlVideo({
  url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  folder: "downloads", // optional, default: "youtube-exec"
  filename: "filename", // optional, default: video title
  resolution: 720, // 144, 240, 360, 480, 720, 1080, 1440, 2160, or 4320; default: 480
})
  .then(() => {
    console.log("Video downloaded successfully! 🎥🎉");
  })
  .catch((err) => {
    console.error("An error occurred:", err.message);
  });
```

</details>

<h1 align="left"><b>Usage (with CLI): 🖥️💻🔧📚</h1>

- Install the package globally:

```bash
$ npm install -g youtube-exec # sudo required for global install
```

<details>
<summary><b><i>Download Audio 🔊 (with CLI usage)</i></b></summary>

The "audio" command allows you to download audio from a YouTube video. It accepts the following options:

- `url`: The URL of the YouTube video (required).
- `folder`: The output folder name (optional).
- `filename`: The output filename (excluding extension) (optional, defaults to video title).
- `quality`: The audio quality ("best" or "lowest") (optional, defaults to "best").

Here's an example of how to use the "audio" command:

```bash
$ yarn global add youtube-exec # needs to be installed globally
$ youtube-exec audio --url "https://www.youtube.com/watch?v=dQw4w9WgXcQ" --folder "downloads" --filename "filename" --quality "best"
```

</details>

<details>
<summary><b><i>Download Video with Audio 🎥🔊 (with CLI usage)</i></b></summary>

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

</details>

<details>
<summary><b><i>Download Video without Audio 🎥🔊 (with CLI usage)</i></b></summary>

The "video" command allows you to download video without audio from a YouTube video. It accepts the following options:

- `url`: The URL of the YouTube video (required).
- `folder`: The output folder name (optional).
- `filename`: The output filename (excluding extension) (optional, defaults to video title).
- `resolution`: The video resolution (144, 240, 360, 480, 720, 1080, 1440, 2160, or 4320) (optional, defaults to 480).

Here's an example of how to use the "video" command:

```bash
$ yarn global add youtube-exec # needs to be installed globally
$ youtube-exec video --url "https://www.youtube.com/watch?v=dQw4w9WgXcQ" --folder "downloads" --filename "filename" --resolution 720
```

</details>

<h1 align="left"><b>Features: 🎯🔥🌟</b></h1>

- Extract video and audio details from YouTube effortlessly
- Download audio files from YouTube videos 🎵🔊
- Download videos with audio from YouTube 🎥🔊
- Choose audio quality (best or lowest) 🔊🥇
- Choose video resolution (144, 240, 360, 480, 720, 1080, 1440, 2160, or 4320) 🎥📺
- Simple and intuitive API 🚀
- CLI support for easy downloading 💻⚡

<h1 align="left"><b>License: 📜🔐</b></h1>

<p align="left">
  YouTube-Exec is released under the <a href="/LICENSE">MIT License</a>. Feel free to use, modify, and distribute it as you like.
<b>The MIT License grants you the following permissions:</b>
</p>

- ✅ Permission is hereby granted, free of charge, to any person obtaining a copy of the YouTube-Exec software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

- 📋 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

- 🚀 The Software is provided "as is," without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose, and noninfringement. In no event shall the authors or copyright holders be liable for any claim, damages, or other liability, whether in an action of contract, tort, or otherwise, arising from, out of, or in connection with the Software or the use or other dealings in the Software.

- 🔗 The Software may utilize third-party libraries, including but not limited to `youtube-dl-exec` and `fluent-ffmpeg`. Any such libraries are subject to their respective licenses and terms.

- 🔒 Users of the Software acknowledge that the extraction and downloading of audio and video content from YouTube may be subject to legal restrictions and terms of use imposed by YouTube or other relevant entities. It is the responsibility of the users to comply with all applicable laws, regulations, and terms of use when using the Software.

- 👥 The Software is intended for personal and non-commercial use only. Any commercial use of the Software requires explicit permission from the authors.
