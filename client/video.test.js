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
const sinon = require("sinon");
const assert = require("chai").assert;
const { dlVideo } = require("youtube-exec");

describe("dlVideo", async function () {
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
    await dlVideo(params);
    assert.isTrue(true);
  });

  it("should download video with audio without folder", async function () {
    this.timeout(80000);
    const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    const filename = "cutom-video";
    const resolution = 144;
    const params = { url, filename, resolution };
    await dlVideo(params);
    assert.isTrue(true);
  });

  it("should download video with audio without filename", async function () {
    this.timeout(80000);
    const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    const folder = "downloads";
    const resolution = 144;
    const params = { url, folder, resolution };
    await dlVideo(params);
    assert.isTrue(true);
  });

  it("should download video with audio without folder and filename", async function () {
    this.timeout(80000);
    const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    const resolution = 144;
    const params = { url, resolution };
    await dlVideo(params);
    assert.isTrue(true);
  });
});
