#!/usr/bin/env node
// =====================================( youtube-exec by magneum )=============================================
// - 🎥📥 YouTube-Exec: Unleash the Power of YouTube Downloads!
// - Effortlessly seize captivating audio and video files from YouTube.
// - Powered by `youtube-dl-exec` and `fluent-ffmpeg` libraries.
// - Easy installation with Node.js using yarn or npm.
// - 🔊 **Download Audio**:
// - Utilize the `dlAudio` function for mesmerizing audio downloads.
// - Customize output folder, filename, and audio quality.
// - 🎥🔊 **Download Video with Audio**:
// - Use `dlAudioVideo` to download videos with accompanying audio.
// - Customize output folder, filename, and resolution.
// - Optional parameters for filename and folder customization.
// - Features:
// - Fetch video and audio details using `youtube-dl-exec`.
// - Choose video format, resolution, and audio quality.
// - Download files using `fluent-ffmpeg` and save to specified folder.
// - Logging functionality with `winston` library.
// - Licensed under MIT for freedom to use, modify, and distribute.
// - Enhance your YouTube downloading experience with this powerful tool.
// =====================================( youtube-exec by magneum )=============================================
const fs = require("fs");
const path = require("path");
const readline = require("readline");

const ignoredContentExtensions = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".bmp",
  ".svg",
  ".mp4",
  ".avi",
  ".mov",
  ".webm",
  ".db",
];
const ignoredFolders = [".git", "node_modules"];
const ignoredRenameExtensions = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".bmp",
  ".svg",
  ".mp4",
  ".avi",
  ".mov",
  ".webm",
  ".db",
];

function renameFilesAndFolders(dirPath, oldWord, newWord) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      if (!ignoredFolders.includes(file)) {
        renameFilesAndFolders(filePath, oldWord, newWord);
      }
    } else {
      const fileExtension = path.extname(file).toLowerCase();
      if (ignoredContentExtensions.includes(fileExtension)) {
        const newFilePath = path.join(
          dirPath,
          replaceAll(file, oldWord, newWord)
        );
        fs.renameSync(filePath, newFilePath);
      } else if (!ignoredRenameExtensions.includes(fileExtension)) {
        const fileContent = fs.readFileSync(filePath, "utf8");
        const newContent = replaceAll(fileContent, oldWord, newWord);
        fs.writeFileSync(filePath, newContent, "utf8");

        const newFilePath = path.join(
          dirPath,
          replaceAll(file, oldWord, newWord)
        );
        fs.renameSync(filePath, newFilePath);
      }
    }
  });

  rl.question("Enter the old word: ", (oldWord) => {
    rl.question("Enter the new word: ", (newWord) => {
      renameFilesAndFolders(".", oldWord, newWord);
    });
  });
}

function replaceAll(str, search, replacement) {
  return str.split(search).join(replacement);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter the old word: ", (oldWord) => {
  rl.question("Enter the new word: ", (newWord) => {
    renameFilesAndFolders(".", oldWord, newWord);
  });
});
