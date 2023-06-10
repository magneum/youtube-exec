#!/usr/bin/env node
// =====================================( youtube-exec by magneum )=============================================
// - 🎥📥 YOUTUBE-EXEC: UNLEASH THE POWER OF YOUTUBE DOWNLOADS!
//
// - Effortlessly download audio and video content from YouTube. 🎵🎬💽
// - Utilizes the powerful `youtube-dl-exec` library for extracting details. 📚🔍💡
// - Seamless fetching of files using the reliable `fluent-ffmpeg` library. 🔄⚙️🔊
// - Access and download your favorite audio and video treasures from YouTube. 🎉🔑💎
// - Say goodbye to limitations and enjoy a world of boundless possibilities. 🚫🌍🔓💫
//
// =====================================( youtube-exec by magneum )=============================================
declare namespace dlAudioVideo {
  type Resolution = 144 | 240 | 360 | 480 | 720 | 1080 | 1440 | 2160 | 4320;

  interface DownloadOptions {
    url: string;
    folder?: string;
    filename?: string;
    resolution?: Resolution;
  }

  function dlAudioVideo(options: DownloadOptions): Promise<void>;
}

export = dlAudioVideo;
