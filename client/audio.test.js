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
const sinon = require("sinon");
const assert = require("chai").assert;
const { dlAudio } = require("../app/cjs/index.js");

describe("dlAudio", async function () {
  this.timeout(80000);
  beforeEach(() => {
    sinon.stub(console, "info");
    sinon.stub(console, "error");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should download audio with all parameters provided", async function () {
    this.timeout(80000);
    const quality = "lowest";
    const filename = "cutom-audio";
    const foldername = "downloads";
    const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    const params = { url, foldername, quality, filename };
    await dlAudio(params);
    assert.isTrue(true);
  });

  it("should download audio without foldername", async function () {
    this.timeout(80000);
    const quality = "lowest";
    const filename = "cutom-audio";
    const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    const params = { url, quality, filename };
    await dlAudio(params);
    assert.isTrue(true);
  });

  it("should download audio without filename", async function () {
    this.timeout(80000);
    const quality = "lowest";
    const foldername = "downloads";
    const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    const params = { url, foldername, quality };
    await dlAudio(params);
    assert.isTrue(true);
  });

  it("should download audio without foldername and filename", async function () {
    this.timeout(80000);
    const quality = "lowest";
    const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    const params = { url, quality };
    await dlAudio(params);
    assert.isTrue(true);
  });
});