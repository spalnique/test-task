import { Transform } from 'stream';

import { RawData } from 'ws';

export class RawDataToBuffer extends Transform {
  constructor() {
    super({
      writableObjectMode: true,
      readableObjectMode: false,
    });
  }

  _transform(
    chunk: RawData,
    _encoding: string,
    callback: (error?: Error | null, data?: Buffer) => void
  ) {
    try {
      let buff: Buffer;

      if (Buffer.isBuffer(chunk)) {
        buff = chunk;
      } else if (
        chunk instanceof ArrayBuffer ||
        (typeof chunk === 'string' && chunk !== 'DONE')
      ) {
        buff = Buffer.from(chunk);
      } else if (chunk instanceof Array) {
        buff = Buffer.concat(chunk);
      } else {
        throw new Error(`Unsupported chunk type: ${typeof chunk}`);
      }

      this.push(buff);
      callback();
    } catch (error) {
      callback(error);
    }
  }
}
