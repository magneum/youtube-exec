const sinon = require("sinon");
const assert = require("chai").assert;
const { dlVideoWithAudio } = require("../app/cjs/index.js");

describe("dlVideoWithAudio", async function () {
  this.timeout(40000);
  beforeEach(() => {
    sinon.stub(console, "info");
    sinon.stub(console, "error");
  });

  afterEach(() => {s
    sinon.restore();
  });

  it("should download video with audio with all parameters provided", async function () {
    this.timeout(40000);
    const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    const foldername = "downloads";
    const filename = "cutom-video";
    const resolution = 144;
    const params = { url, foldername, filename, resolution };
    await dlVideoWithAudio(params);
    assert.isTrue(true);
  });

  it("should download video with audio without foldername", async function () {
    this.timeout(40000);
    const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    const filename = "cutom-video";
    const resolution = 144;
    const params = { url, filename, resolution };
    await dlVideoWithAudio(params);
    assert.isTrue(true);
  });

  it("should download video with audio without filename", async function () {
    this.timeout(40000);
    const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    const foldername = "downloads";
    const resolution = 144;
    const params = { url, foldername, resolution };
    await dlVideoWithAudio(params);
    assert.isTrue(true);
  });

  it("should download video with audio without foldername and filename", async function () {
    this.timeout(40000);
    const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    const resolution = 144;
    const params = { url, resolution };
    await dlVideoWithAudio(params);
    assert.isTrue(true);
  });
});
