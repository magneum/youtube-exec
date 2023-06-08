import sinon from "sinon";
import { expect } from "chai";
import streamAudio from "../src/mjs/web.mjs";

describe("streamAudio", async function () {
  this.timeout(40000);
  it("should return the expected audio details and video title", async function () {
    this.timeout(40000);
    const req = {
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      quality: "best",
    };
    const res = {
      setHeader: sinon.stub(),
    };
    const result = await streamAudio(req, res);
    expect(res.setHeader.calledWith("Content-Type", "audio/mpeg")).to.be.true;
    expect(
      res.setHeader.calledWith(
        "Content-Disposition",
        'attachment; filename="Video Title.mp3"'
      )
    ).to.be.true;
    expect(result.reqAudio).to.be.an("object");
    expect(result.videoTitle).to.be.a("string");
    expect(result.stream).to.be.an("object");
  });

  it("should handle invalid URL", async function () {
    this.timeout(40000);
    const req = {
      url: "https://www.youtube.com/watch?v=invalid-url",
      quality: "best",
    };
    const res = {
      setHeader: sinon.stub(),
      status: sinon.stub(),
      end: sinon.stub(),
    };
    await streamAudio(req, res);
    expect(res.setHeader.called).to.be.false;
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.end.called).to.be.true;
  });

  it("should handle error fetching audio details", async function () {
    this.timeout(40000);
    const req = {
      url: "https://www.youtube.com/watch?v=your-video-id",
      quality: "best",
    };
    const res = {
      setHeader: sinon.stub(),
      status: sinon.stub(),
      end: sinon.stub(),
    };
    sinon
      .stub(streamAudio, "fetchAudioDetails")
      .throws(new Error("Fetch error"));
    await streamAudio(req, res);
    expect(res.setHeader.called).to.be.false;
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.end.called).to.be.true;
    streamAudio.fetchAudioDetails.restore();
  });
});
