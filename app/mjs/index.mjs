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
import dlAudio from "../../src/mjs/audio.mjs";
import dlVideo from "../../src/mjs/video.mjs";
import streamAudio from "../../src/mjs/web.mjs";
import dlAudioVideo from "../../src/mjs/vid_aud.mjs";

export { dlAudio, streamAudio, dlAudioVideo, dlVideo };
