#!/usr/bin/env node
// =====================================( youtube-exec: Unleash the Power of YouTube Downloads! )=============================================
// 🌟 Once upon a time in the vast realm of the Internet, a remarkable tool was born: YOUTUBE-EXEC. 📽️✨
//
// 🎥 Step into a world where you can effortlessly download the mesmerizing audio and captivating video content from YouTube. 🎵🎬💽
// 💡 Powered by the mighty and ingenious "youtube-dl-exec" library, this tool possesses the uncanny ability to extract the finest details from YouTube's vast kingdom of videos. 📚🔍💡
// ⚙️ Equipped with the seamless and reliable "fluent-ffmpeg" library, youtube-exec embarks on a quest to fetch files with utmost precision and grace.
// With each step, it transforms the abstract bits and bytes into a symphony of sights and sounds. 🔄⚙️🔊
// 🌟 Unlock the gates to a realm where your favorite audio harmonies and video treasures await.
// Dive into the enchanting world of YouTube's vast library, and let your imagination soar. 🎉🔑💎
// 🔓 Embrace the freedom to break free from limitations and embrace a world of boundless possibilities.
// Bid farewell to the boundaries that once held you back and embark on an adventure beyond your wildest dreams. 🚫🌍🔓💫
// 📖 This is the tale of youtube-exec, a tool that empowers you to shape your own narrative in the realm of YouTube.
//  Let your journey begin! 🚀🎬🔥
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
