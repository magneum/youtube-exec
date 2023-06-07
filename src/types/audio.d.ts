declare module "dlAudio" {
  type Quality = "best" | "low";

  interface DownloadOptions {
    url: string;
    foldername?: string;
    quality: Quality;
    filename?: string;
  }

  function dlAudio(options: DownloadOptions): Promise<void>;

  export = dlAudio;
}
