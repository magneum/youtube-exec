import dlAudio from "./audio.mjs";
import { assert } from "chai";
import clear from "cli-clear";
import sinon from "sinon";
import fs from "fs";
clear()

describe("dlAudio", function () {
  let logSpy;
  let errorSpy;
  let fsExistsSyncStub;
  let fsMkdirSyncStub;

  beforeEach(() => {
    logSpy = sinon.spy(console, "log");
    errorSpy = sinon.spy(console, "error");
    fsExistsSyncStub = sinon.stub(fs, "existsSync").returns(true);
    fsMkdirSyncStub = sinon.stub(fs, "mkdirSync");
  });

  afterEach(() => {
    sinon.restore();
  });

  this.timeout(40000);

  it("should download audio successfully with default filename and foldername", async function () {
    const url = "https://youtu.be/Wgx6WvlOv_0";
    const quality = "best";
    await dlAudio({ url, quality });
    assert.isTrue(logSpy.calledWith("🔍 Fetching audio details..."));
    assert.isTrue(logSpy.calledWith("🔍 Fetching Audio Quality: best"));
    assert.isTrue(logSpy.calledWith(sinon.match("🎥 Video Title:")));
    assert.isTrue(logSpy.calledWith("📥 Audio download started..."));
    assert.isTrue(logSpy.calledWith(sinon.match("⬇️ Downloading:")));
    assert.isTrue(
      logSpy.calledWith(sinon.match("✅ Audio downloaded successfully!"))
    );
    assert.isFalse(fsMkdirSyncStub.called);
    assert.isFalse(fsExistsSyncStub.called);
    assert.isFalse(errorSpy.called);
  });

  it("should download audio successfully with custom filename and foldername", async function () {
    const url = "https://youtu.be/Wgx6WvlOv_0";
    const foldername = "downloads";
    const filename = "custom";
    const quality = "best";
    await dlAudio({ url, foldername, quality, filename });
    assert.isTrue(logSpy.calledWith("🔍 Fetching audio details..."));
    assert.isTrue(logSpy.calledWith("🔍 Fetching Audio Quality: best"));
    assert.isTrue(logSpy.calledWith(sinon.match("🎥 Video Title:")));
    assert.isTrue(logSpy.calledWith("📥 Audio download started..."));
    assert.isTrue(logSpy.calledWith(sinon.match("⬇️ Downloading:")));
    assert.isTrue(
      logSpy.calledWith(sinon.match("✅ Audio downloaded successfully!"))
    );
    assert.isTrue(fsMkdirSyncStub.calledWith(foldername));
    assert.isTrue(fsExistsSyncStub.calledWith(foldername));
    assert.isFalse(errorSpy.called);
  });

  it("should download audio successfully with custom filename", async function () {
    const url = "https://youtu.be/Wgx6WvlOv_0";
    const foldername = "downloads";
    const quality = "best";
    await dlAudio({ url, foldername, quality });
    assert.isTrue(logSpy.calledWith("🔍 Fetching audio details..."));
    assert.isTrue(logSpy.calledWith("🔍 Fetching Audio Quality: best"));
    assert.isTrue(logSpy.calledWith(sinon.match("🎥 Video Title:")));
    assert.isTrue(logSpy.calledWith("📥 Audio download started..."));
    assert.isTrue(logSpy.calledWith(sinon.match("⬇️ Downloading:")));
    assert.isTrue(
      logSpy.calledWith(sinon.match("✅ Audio downloaded successfully!"))
    );
    assert.isTrue(fsMkdirSyncStub.calledWith(foldername));
    assert.isTrue(fsExistsSyncStub.calledWith(foldername));
    assert.isFalse(errorSpy.called);
  });

  it("should handle invalid URL format", async function () {
    const url = "https://youtu.be/invalid-url";
    const quality = "best";
    await dlAudio({ url, quality });
    assert.isTrue(errorSpy.calledWith(sinon.match("Invalid URL format")));
    assert.isFalse(fsMkdirSyncStub.called);
    assert.isFalse(fsExistsSyncStub.called);
  });
});
