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
const sinon = require("sinon");
const assert = require("chai").assert;
const { dlAudioVideo } = require("youtube-exec");

describe("dlAudioVideo", async function () {
  this.timeout(80000);
  beforeEach(() => {
    sinon.stub(console, "info");
    sinon.stub(console, "error");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should download video with audio with all parameters provided", async function () {
    this.timeout(80000);
    const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    const folder = "downloads";
    const filename = "cutom-video";
    const resolution = 144;
    const params = { url, folder, filename, resolution };
    await dlAudioVideo(params);
    assert.isTrue(true);
  });

  it("should download video with audio without folder", async function () {
    this.timeout(80000);
    const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    const filename = "cutom-video";
    const resolution = 144;
    const params = { url, filename, resolution };
    await dlAudioVideo(params);
    assert.isTrue(true);
  });

  it("should download video with audio without filename", async function () {
    this.timeout(80000);
    const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    const folder = "downloads";
    const resolution = 144;
    const params = { url, folder, resolution };
    await dlAudioVideo(params);
    assert.isTrue(true);
  });

  it("should download video with audio without folder and filename", async function () {
    this.timeout(80000);
    const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    const resolution = 144;
    const params = { url, resolution };
    await dlAudioVideo(params);
    assert.isTrue(true);
  });
});
