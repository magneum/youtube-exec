const chalk = require("chalk");
const { v4: uuidv4 } = require("uuid");
const { dlAudio } = require("../app/cjs/index.js");

describe("Different error cases:", () => {
  it(
    chalk.red(
      "should handle valid YouTube URL with no output location for dlAudio()"
    ),
    async function () {
      this.timeout(10000);
      await dlAudio({
        url: "https://www.youtube.com/watch?v=es",
      });
      throw new Error(
        chalk.green("Expected an error, but the function succeeded.")
      );
    }
  );

  it(
    chalk.red("should handle invalid YouTube URL for dlAudio()"),
    async function () {
      await dlAudio({
        url: "https://www.youtube.com/watch?v=invalidurl",
        foldername: "downloads",
        filename: uuidv4(),
        quality: "lowest",
      });
      throw new Error(
        chalk.green("Expected an error, but the function succeeded.")
      );
    }
  );
});

describe("Different dlAudio() cases:", () => {
  it(
    chalk.blue(
      "should download audio with valid YouTube URL and <filename: random.mp3 || quality: lowest>"
    ),
    async function () {
      this.timeout(30000);
      await dlAudio({
        url: "https://youtu.be/Wgx6WvlOv_0",
        foldername: "downloads",
        filename: uuidv4(),
        quality: "lowest",
      });
    }
  );

  it(
    chalk.yellow(
      "should download audio with valid YouTube URL and <filename: title.mp3 (default) || quality: best>"
    ),
    async function () {
      this.timeout(30000);
      await dlAudio({
        url: "https://youtu.be/Wgx6WvlOv_0",
        foldername: "downloads",
        quality: "best",
      });
    }
  );
});
