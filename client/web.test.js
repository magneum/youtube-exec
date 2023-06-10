#!/usr/bin/env node
// =====================================( youtube-exec by magneum )=============================================
// - 🎥📥 YOUTUBE-EXEC: UNLEASH THE POWER OF YOUTUBE DOWNLOADS!
//
// - Effortlessly download audio and video content from YouTube. 🎵🎬💽
// - Utilizes the powerful `youtube-dl-exec` library for extracting details. 📚🔍💡
// - Seamless fetching of files using the reliable `fluent-ffmpeg` library. 🔄⚙️🔊
// - Access and download your favorite audio and video treasures from YouTube. 🎉🔑💎
// - Say goodbye to limitations and enjoy a world of boundless possibilities. 🚫🌍🔓💫
//
// =====================================( youtube-exec by magneum )=============================================
const chalk = require("chalk");
const express = require("express");
const { streamAudio } = require("youtube-exec");

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
