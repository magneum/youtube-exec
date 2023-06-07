import dlAudio from "./audio.mjs";
import { assert } from "chai";
import clear from "cli-clear";
import sinon from "sinon";
import fs from "fs";
clear();

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
});
