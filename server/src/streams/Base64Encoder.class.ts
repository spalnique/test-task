import { Transform } from 'stream';

export class Base64Encoder extends Transform {
  private buffer: Buffer = Buffer.alloc(0);

  constructor() {
    super({ writableObjectMode: false, readableObjectMode: true });
  }

  _transform(
    chunk: Buffer,
    _encoding: string,
    callback: (error?: Error | null, data?: string) => void
  ) {
    try {
      this.buffer = Buffer.concat([this.buffer, chunk]);

      if (this.buffer.length >= 8192) {
        this.push(this.buffer.toString('base64'));
        this.buffer = Buffer.alloc(0);
      }

      callback();
    } catch (error) {
      callback(error);
    }
  }

  _flush(callback: (error?: Error | null) => void) {
    try {
      if (this.buffer.length > 0) {
        this.push(this.buffer.toString('base64'));
        this.buffer = Buffer.alloc(0);
      }

      callback();
    } catch (error) {
      callback(error);
    }
  }
}
