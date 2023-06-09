#!/usr/bin/env node
// =====================================( youtube-exec by magneum )=============================================
// - 🎥📥 YouTube-Exec: Unleash the Power of YouTube Downloads!
// - Effortlessly seize captivating audio and video files from YouTube.
// - Powered by `youtube-dl-exec` and `fluent-ffmpeg` libraries.
// - Easy installation with Node.js using yarn or npm.
// - 🔊 **Download Audio**:
// - Utilize the `dlAudio` function for mesmerizing audio downloads.
// - Customize output folder, filename, and audio quality.
// - 🎥🔊 **Download Video with Audio**:
// - Use `dlAudioVideo` to download videos with accompanying audio.
// - Customize output folder, filename, and resolution.
// - Optional parameters for filename and folder customization.
// - Features:
// - Fetch video and audio details using `youtube-dl-exec`.
// - Choose video format, resolution, and audio quality.
// - Download files using `fluent-ffmpeg` and save to specified folder.
// - Logging functionality with `winston` library.
// - Licensed under MIT for freedom to use, modify, and distribute.
// - Enhance your YouTube downloading experience with this powerful tool.
// =====================================( youtube-exec by magneum )=============================================
declare module "dlAudio" {
  type Quality = "best" | "low";

  interface DownloadOptions {
    url: string;
    folder?: string;
    quality: Quality;
    filename?: string;
  }

  function dlAudio(options: DownloadOptions): Promise<void>;

  export = dlAudio;
}
