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
