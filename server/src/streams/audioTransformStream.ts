import { Transform } from 'stream';

import { v4 as uuidv4 } from 'uuid';
import { WebSocket } from 'ws';

import { AudioEvent } from '../types';
import base64EncodeAudio from '../utils/base64EncodeAudio';

export default function createAudioTransformStream(websocket: WebSocket) {
  let isProcessing = false;

  const transform = new Transform({
    construct(callback) {
      if (websocket.readyState !== WebSocket.OPEN) {
        callback(new Error('WebSocket is not connected'));
        return;
      }
      callback();
    },

    transform(chunk, _encoding, callback) {
      try {
        const buffer = Buffer.from(chunk);
        const float32Array = new Float32Array(
          buffer.buffer,
          buffer.byteOffset,
          buffer.length / 4
        );
        const base64Audio = base64EncodeAudio(float32Array);

        isProcessing = true;

        const audioEvent: AudioEvent = {
          event_id: `event_${uuidv4()}`,
          type: 'input_audio_buffer.append',
          audio: base64Audio,
        };

        websocket.send(JSON.stringify(audioEvent));
        callback();
      } catch (error) {
        callback(error as Error);
      }
    },

    flush(callback) {
      if (isProcessing) {
        websocket.send(
          JSON.stringify({
            event_id: `event_${uuidv4()}`,
            type: 'response.create',
          })
        );

        isProcessing = false;
      }
      callback();
    },
  });

  return transform;
}
