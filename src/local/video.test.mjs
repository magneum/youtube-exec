import dlVideoWithAudio from "../mjs/video.mjs";
import { assert } from "chai";
import clear from "cli-clear";
import sinon from "sinon";
import fs from "fs";

clear();

const testDownloadVideo = async () => {
  try {
    const testCases = [
      {
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        foldername: "downloads",
        filename: "my-video",
        resolution: 144,
        description: "with all parameters provided",
      },
      {
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        filename: "my-video",
        resolution: 144,
        description: "without foldername",
      },
      {
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        foldername: "downloads",
        resolution: 144,
        description: "without filename",
      },
      {
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        resolution: 144,
        description: "without foldername and filename",
      },
    ];

    logger.info("🚀 Starting video download...");
    for (const testCase of testCases) {
      const { url, foldername, filename, resolution, description } = testCase;
      logger.info(`🐞 Running test: ${description}`);
      await dlVideoWithAudio({ url, foldername, filename, resolution });
      logger.info(`💡 Test: ${description} - Passed\n`);
    }
    logger.info("✅ All video download tests completed successfully!");
  } catch (error) {
    console.error("❌ Video download tests failed:", error.message);
  }
};

testDownloadVideo();
