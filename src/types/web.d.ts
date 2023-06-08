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
