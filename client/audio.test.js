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
    const folder = "downloads";
    const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    const params = { url, folder, quality, filename };
    await dlAudio(params);
    assert.isTrue(true);
  });

  it("should download audio without folder", async function () {
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
    const folder = "downloads";
    const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    const params = { url, folder, quality };
    await dlAudio(params);
    assert.isTrue(true);
  });

  it("should download audio without folder and filename", async function () {
    this.timeout(80000);
    const quality = "lowest";
    const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    const params = { url, quality };
    await dlAudio(params);
    assert.isTrue(true);
  });
});
