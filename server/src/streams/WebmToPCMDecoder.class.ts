import { Transform } from 'stream';

import prism from 'prism-media';

export class WebmToPCMDecoder extends Transform {
  private readonly demuxer: prism.opus.WebmDemuxer;
  private readonly decoder: prism.opus.Decoder;

  constructor() {
    super({ objectMode: false });

    this.demuxer = new prism.opus.WebmDemuxer();
    this.decoder = new prism.opus.Decoder({
      rate: 24000,
      channels: 1,
      frameSize: 960,
    });

    this.demuxer.pipe(this.decoder);

    this.decoder.on('data', (chunk: Buffer) => {
      const isBackpressure = !this.push(chunk);
      if (isBackpressure) {
        this.decoder.pause();
      }
    });

    this.on('drain', () => {
      this.decoder.resume();
    });

    this.demuxer.on('error', (error) => this.emit('error', error));
    this.decoder.on('error', (error) => this.emit('error', error));
  }

  _transform(
    chunk: Buffer,
    _encoding: string,
    callback: (error?: Error | null) => void
  ) {
    try {
      this.demuxer.write(chunk);
      callback();
    } catch (error) {
      callback(error instanceof Error ? error : new Error('Decoding failed'));
    }
  }
}
