const { dlAudio, dlVideoWithAudio } = require("ytdl-exec");

(async () => {
  const quality = "lowest"; // best
  const filename = "cutom-audio"; // optional
  const foldername = "./downloads"; // optional
  const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
  const params = { url, foldername, quality, filename };
  await dlAudio(params);
})();

(async () => {
  const resolution = 144; // Resolution 144 | 240 | 360 | 480 | 720 | 1080 | 1440 | 2160 | 4320
  const filename = "cutom-video"; // optional
  const foldername = "./downloads"; // optional
  const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
  const params = { url, foldername, filename, resolution };
  await dlVideoWithAudio(params);
})();
