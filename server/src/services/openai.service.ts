import { Transform } from 'stream';

import WebSocket, { RawData } from 'ws';

import { realtimeAPIConfig } from '@configs';
import { OPENAI_API_URL } from '@constants';
import { Base64Encoder, RawDataToBuffer, WebmToPCMDecoder } from '@streams';
import { ClientRealtimeEvent, ServerRealtimeEvent } from '@types';

export class RealtimeAPIService {
  private readonly client_ws: WebSocket;
  private readonly realtime_ws: WebSocket;
  private stream: Transform;

  constructor(client_ws: WebSocket) {
    this.client_ws = client_ws;
    this.realtime_ws = new WebSocket(OPENAI_API_URL, realtimeAPIConfig);

    this.setupClientEventHandlers();
    this.setupRealtimeEventHandlers();
  }

  private setupPipeline() {
    this.stream = new RawDataToBuffer();
    this.stream
      .pipe(new WebmToPCMDecoder())
      .pipe(new Base64Encoder())
      .on('data', this.onPipelineData.bind(this));
  }

  private onPipelineData(base64Audio: string) {
    this.sendToRealtime({
      type: 'input_audio_buffer.append',
      audio: base64Audio,
    });
  }

  private setupRealtimeEventHandlers() {
    this.realtime_ws.on('open', this.onRealtimeOpen.bind(this));
    this.realtime_ws.on('message', this.onRealtimeMessage.bind(this));
    this.realtime_ws.on('close', this.onRealtimeClose.bind(this));
    this.realtime_ws.on('error', this.onRealtimeError.bind(this));
  }

  private setupClientEventHandlers() {
    this.client_ws.on('message', this.onClientMessage.bind(this));
    this.client_ws.on('close', this.onClientCloseOrError.bind(this));
    this.client_ws.on('error', this.onClientCloseOrError.bind(this));
  }

  private sendToRealtime(event: ClientRealtimeEvent) {
    this.realtime_ws.send(JSON.stringify(event));
  }

  private sendToClient(event: string) {
    this.client_ws.send(event);
  }

  private onRealtimeOpen() {
    this.sendToRealtime({
      type: 'session.update',
      session: {
        modalities: ['text'],
        instructions:
          "Be useful. Don't talk too much. Use Ukrainian or English language to answer. If you hear Слава Україні you should respond Героям слава!",
        max_response_output_tokens: 1024,
        input_audio_transcription: {
          model: 'whisper-1',
        },
        turn_detection: {
          type: 'server_vad',
          prefix_padding_ms: 300,
          silence_duration_ms: 500,
          threshold: 0.5,
          create_response: true,
        },
      },
    });
  }

  private onRealtimeMessage(event: RawData) {
    try {
      const parsed = JSON.parse(event.toString('utf8')) as ServerRealtimeEvent;

      switch (parsed.type) {
        case 'error':
          console.error('Realtime API Error:', parsed.error.message);
          break;

        case 'session.updated':
          this.setupPipeline();
          this.sendToClient('OK');
          break;

        case 'response.done':
          const response = JSON.stringify({
            id: parsed.event_id,
            text: parsed.response.output[0].content[0].text,
          });
          this.sendToClient(response);
          break;

        default:
          console.log('Realtime API:', parsed.type);
          break;
      }
    } catch (error) {
      console.error('Error handling Realtime API message:', error);
    }
  }

  private onRealtimeClose() {
    this.sendToClient(
      'Connection with Realtime API has been interrupted. Please, refresh the page'
    );

    if (this.stream) this.stream.destroy();
  }

  private onRealtimeError(error: Error) {
    console.error(error);
    this.stream.destroy();
  }

  private onClientMessage(chunk: RawData) {
    this.stream.write(chunk);
  }

  private onClientCloseOrError() {
    if (this.stream) {
      this.stream.end(() => {
        this.sendToRealtime({ type: 'response.cancel' });
        this.sendToRealtime({ type: 'input_audio_buffer.clear' });
        this.realtime_ws.close();
        this.stream.removeAllListeners();
        this.stream.destroy();
        this.stream = null;
      });
    }
  }
}
