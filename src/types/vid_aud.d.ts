#!/usr/bin/env node
// =====================================( youtube-exec: Unleash the Power of YouTube Downloads! )=============================================
// 🌟 Once upon a time in the vast realm of the Internet, a remarkable tool was born: YOUTUBE-EXEC. 📽️✨
//
// 🎥 Step into a world where you can effortlessly download the mesmerizing audio and captivating video content from YouTube. 🎵🎬💽
// 💡 Powered by the mighty and ingenious "youtube-dl-exec" library, this tool possesses the uncanny ability to extract the finest details from YouTube's vast kingdom of videos. 📚🔍💡
// ⚙️ Equipped with the seamless and reliable "fluent-ffmpeg" library, youtube-exec embarks on a quest to fetch files with utmost precision and grace.
// With each step, it transforms the abstract bits and bytes into a symphony of sights and sounds. 🔄⚙️🔊
// 🌟 Unlock the gates to a realm where your favorite audio harmonies and video treasures await.
// Dive into the enchanting world of YouTube's vast library, and let your imagination soar. 🎉🔑💎
// 🔓 Embrace the freedom to break free from limitations and embrace a world of boundless possibilities.
// Bid farewell to the boundaries that once held you back and embark on an adventure beyond your wildest dreams. 🚫🌍🔓💫
// 📖 This is the tale of youtube-exec, a tool that empowers you to shape your own narrative in the realm of YouTube.
//  Let your journey begin! 🚀🎬🔥
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
