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
const dlAudio = require("../../src/cjs/audio.js");
const dlVideo = require("../../src/cjs/video.js");
const streamAudio = require("../../src/cjs/web.js");
const dlAudioVideo = require("../../src/cjs/vid_aud.js");

module.exports = {
  dlAudio,
  streamAudio,
  dlVideo,
  dlAudioVideo,
};
