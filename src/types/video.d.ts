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
