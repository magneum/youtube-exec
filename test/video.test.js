const chalk = require("chalk");
const { v4: uuidv4 } = require("uuid");
const { dlVideoWithAudio } = require("../app/cjs/index.js");

describe("Different error cases:", () => {
  it(
    chalk.red(
      "should handle valid YouTube URL with no output location for dlVideoWithAudio())"
    ),
    async function () {
      this.timeout(10000);
      await dlVideoWithAudio({
        url: "https://www.youtube.com/watch?v=es",
      });
      throw new Error("Expected an error, but the function succeeded.");
    }
  );

  it(
    chalk.red(
      "should handle valid YouTube URL with no output location for dlVideoWithAudio()"
    ),
    async function () {
      this.timeout(10000);
      await dlVideoWithAudio({
        url: "https://www.youtube.com/watch?v=es",
      });
      throw new Error("Expected an error, but the function succeeded.");
    }
  );
});

describe("Different dlVideoWithAudio() cases:", () => {
  it(
    chalk.blue(
      "should download audio with valid YouTube URL and <filename: random.mp3 || resolution: 144>"
    ),
    async function () {
      this.timeout(30000);
      await dlVideoWithAudio({
        url: "https://youtu.be/Wgx6WvlOv_0",
        foldername: "downloads",
        filename: uuidv4(),
        resolution: 144,
      });
    }
  );

  it("should download video and audio with valid YouTube URL and <filename: title.mp3 || resolution: 360>", async function () {
    this.timeout(30000);
    await dlVideoWithAudio({
      url: "https://youtu.be/Wgx6WvlOv_0",
      foldername: "downloads",
      resolution: 360,
    });
  });
});
