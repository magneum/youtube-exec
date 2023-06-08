// =====================================( ytdl-exec by magneum )=============================================
// - 🎥📥 Ytdl-Exec: Unleash the Power of YouTube Downloads!
// - Effortlessly seize captivating audio and video files from YouTube.
// - Powered by `youtube-dl-exec` and `fluent-ffmpeg` libraries.
// - Easy installation with Node.js using yarn or npm.
// - 🔊 **Download Audio**:
// - Utilize the `dlAudio` function for mesmerizing audio downloads.
// - Customize output folder, filename, and audio quality.
// - 🎥🔊 **Download Video with Audio**:
// - Use `dlVideoWithAudio` to download videos with accompanying audio.
// - Customize output folder, filename, and resolution.
// - Optional parameters for filename and foldername customization.
// - Features:
// - Fetch video and audio details using `youtube-dl-exec`.
// - Choose video format, resolution, and audio quality.
// - Download files using `fluent-ffmpeg` and save to specified folder.
// - Logging functionality with `winston` library.
// - Licensed under MIT for freedom to use, modify, and distribute.
// - Enhance your YouTube downloading experience with this powerful tool.
// =====================================( ytdl-exec by magneum )=============================================
declare module "streamAudio" {
  type Quality = "best" | "lowest";

  interface StreamOptions {
    url: string;
    quality: Quality;
    res: any;
  }

  interface StreamResult {
    reqAudio: any;
    videoTitle: string;
    stream: any;
  }

  function streamAudio(options: StreamOptions): Promise<StreamResult>;

  export = streamAudio;
}
