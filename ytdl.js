const { dlAudio, dlVideoWithAudio } = require("ytdl-exec");

// dlAudio variations
(async () => {
  // Variation 1: No foldername
  await dlAudio({
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    quality: "lowest",
    filename: "cutom-audio",
  });
})();

// dlAudio variations
(async () => {
  // Variation 2: No filename
  await dlAudio({
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    foldername: "downloads",
    quality: "lowest",
  });
})();

// dlAudio variations
(async () => {
  // Variation 3: Variations of quality
  await dlAudio({
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    foldername: "downloads",
    quality: "best",
    filename: "cutom-audio",
  });
})();

// dlVideoWithAudio variations
(async () => {
  // Variation 1: No foldername
  await dlVideoWithAudio({
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    filename: "cutom-video",
    resolution: 144,
  });
})();

// dlVideoWithAudio variations
(async () => {
  // Variation 2: No filename
  await dlVideoWithAudio({
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    foldername: "downloads",
    resolution: 144,
  });
})();

// dlVideoWithAudio variations
(async () => {
  // Variation 3: Variations of resolution
  await dlVideoWithAudio({
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    foldername: "downloads",
    filename: "cutom-video",
    resolution: 144,
  });
})();
