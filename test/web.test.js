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
const chalk = require("chalk");
const express = require("express");
const { streamAudio } = require("../app/cjs/index.js");

const app = express();
const port = 8080;

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Internal Server Error");
});

app.get("/", async (req, res) => {
  const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
  const quality = req.query.quality || "best";
  try {
    const { reqAudio, videoTitle, stream } = await streamAudio({
      url,
      quality,
      res,
    });
    stream.on("start", () => {
      console.log("📥 Audio streaming started...");
    });
    stream.on("end", () => {
      console.log(chalk.bold(chalk.green("✅ Audio streaming finished!")));
    });
    stream.on("error", (err) => {
      console.log(
        chalk.bold(chalk.red(`❌ Error streaming audio: ${err.message}`))
      );
      res.status(500).end();
    });
  } catch (err) {
    console.log(chalk.red(`❌ An error occurred: ${err.message}`));
    res.status(500).end();
  }
});

app.listen(port, () => {
  console.log("http://localhost:8080");
});

// const express = require("express");
// const { streamAudio } = require("../app/cjs/index.js");
// const http = require("http");
// const socketIO = require("socket.io");

// const app = express();
// const server = http.createServer(app);
// const io = socketIO(server);

// const port = 8080;

// app.use((err, req, res, next) => {
//   console.error(err);
//   res.status(500).send("Internal Server Error");
// });

// app.get("/", async (req, res) => {
//   const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
//   const quality = req.query.quality || "best";
//   await streamAudio({
//     url,
//     quality,
//     res,
//   }).theen(async (reqAudio, videoTitle, stream) => {
//     try {
//       stream.on("start", () => {
//         io.emit(
//           "streamStart",
//           `📥 Audio streaming started - Video Title: ${videoTitle}`
//         );
//         res.send(`📥 Audio streaming started - Video Title: ${videoTitle}`);
//       });
//       stream.on("end", () => {
//         io.emit(
//           "streamEnd",
//           `✅ Audio streaming finished - Video Title: ${videoTitle}`
//         );
//         res.send(`✅ Audio streaming finished - Video Title: ${videoTitle}`);
//       });
//       stream.on("error", (err) => {
//         io.emit(
//           "streamError",
//           `❌ Error streaming audio - Video Title: ${videoTitle}, Error: ${err.message}`
//         );
//         res
//           .status(500)
//           .send(
//             `❌ Error streaming audio - Video Title: ${videoTitle}, Error: ${err.message}`
//           );
//       });
//     } catch (err) {
//       io.emit(
//         "errorOccurred",
//         `❌ An error occurred - Video Title: ${videoTitle}, Error: ${err.message}`
//       );
//       res
//         .status(500)
//         .send(
//           `❌ An error occurred - Video Title: ${videoTitle}, Error: ${err.message}`
//         );
//     }
//   });
// });

// io.on("connection", (socket) => {
//   console.log("A client connected");

//   socket.on("disconnect", () => {
//     console.log("A client disconnected");
//   });
// });

// server.listen(port, () => {
//   console.log("http://localhost:8080");
// });
