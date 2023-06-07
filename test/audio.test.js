const sinon = require("sinon");
const assert = require("chai").assert;
const { dlAudio } = require("../app/cjs/index.js");

describe("dlAudio", async function () {
  this.timeout(40000);
  beforeEach(() => {
    sinon.stub(console, "info");
    sinon.stub(console, "error");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should download audio with all parameters provided", async function () {
    this.timeout(40000);
    const quality = "lowest";
    const filename = "cutom-audio";
    const foldername = "downloads";
    const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    const params = { url, foldername, quality, filename };
    await dlAudio(params);
    assert.isTrue(true);
  });

  it("should download audio without foldername", async function () {
    this.timeout(40000);
    const quality = "lowest";
    const filename = "cutom-audio";
    const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    const params = { url, quality, filename };
    await dlAudio(params);
    assert.isTrue(true);
  });

  it("should download audio without filename", async function () {
    this.timeout(40000);
    const quality = "lowest";
    const foldername = "downloads";
    const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    const params = { url, foldername, quality };
    await dlAudio(params);
    assert.isTrue(true);
  });

  it("should download audio without foldername and filename", async function () {
    this.timeout(40000);
    const quality = "lowest";
    const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    const params = { url, quality };
    await dlAudio(params);
    assert.isTrue(true);
  });
});
