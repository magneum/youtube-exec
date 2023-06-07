import dlAudio from "../mjs/audio.mjs";
import { assert } from "chai";
import sinon from "sinon";
import fs from "fs";

async function deleteDownloadedFiles(
  foldername = "downloads",
  filename = "my-audio"
) {
  try {
    const filePath = `${foldername}/${filename}.mp3`;
    await fs.promises.unlink(filePath);
    await fs.promises.rmdir(foldername);
  } catch (error) {
    console.error("Error occurred while deleting downloaded files:", error);
  }
}

describe("dlAudio", async () => {
  beforeEach(() => {
    sinon.stub(console, "info");
    sinon.stub(console, "error");
  });
  afterEach(() => {
    sinon.restore();
  });

  it("should download audio with all parameters provided", async () => {
    const quality = "lowest";
    const filename = "my-audio";
    const foldername = "downloads";
    const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    const params = { url, foldername, quality, filename };
    await dlAudio(params);
    assert.isTrue(true);
    await deleteDownloadedFiles(foldername, filename);
  });

  it("should download audio without foldername", async () => {
    const quality = "lowest";
    const filename = "my-audio";
    const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

    const params = { url, quality, filename };
    await dlAudio(params);
    assert.isTrue(true);
    await deleteDownloadedFiles(undefined, filename);
  });

  it("should download audio without filename", async () => {
    const quality = "lowest";
    const foldername = "downloads";
    const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

    const params = { url, foldername, quality };
    await dlAudio(params);
    assert.isTrue(true);
    await deleteDownloadedFiles(foldername);
  });

  it("should download audio without foldername and filename", async () => {
    const quality = "lowest";
    const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    const params = { url, quality };
    await dlAudio(params);
    assert.isTrue(true);
    await deleteDownloadedFiles();
  });
});
