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
declare module "dlVideoWithAudio" {
  type Resolution = 144 | 240 | 360 | 480 | 720 | 1080 | 1440 | 2160 | 4320;

  interface DownloadOptions {
    url: string;
    foldername?: string;
    filename?: string;
    resolution?: Resolution;
  }

  function dlVideoWithAudio(options: DownloadOptions): Promise<void>;

  export = dlVideoWithAudio;
}
