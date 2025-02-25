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

  private sendToClient(message: string) {
    this.client_ws.send(message);
  }

  private onRealtimeOpen() {
    this.sendToRealtime({
      type: 'session.update',
      session: {
        modalities: ['text'],
        instructions: 'prompt',
        max_response_output_tokens: 2048,
        turn_detection: null,
      },
    });
  }

  private onRealtimeMessage(event: RawData) {
    try {
      const parsedEvent = JSON.parse(
        event.toString('utf-8')
      ) as ServerRealtimeEvent;

      switch (parsedEvent.type) {
        case 'error':
          console.error('Realtime API Error:', parsedEvent.error.message);
          break;

        case 'session.updated':
          console.log('Realtime API:', parsedEvent.type);
          this.setupPipeline();
          this.sendToClient('OK');
          break;

        case 'response.done':
          console.log('Realtime API:', parsedEvent.type);
          this.sendToClient(parsedEvent.response.output[0].content[0].text);
          break;

        default:
          console.log('Realtime API:', parsedEvent.type);
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
    if (chunk.toString('utf-8') === 'DONE') {
      this.sendToRealtime({ type: 'input_audio_buffer.commit' });
      this.sendToRealtime({ type: 'response.create' });
      return;
    }

    const isBackpressure = this.stream.write(chunk);
    if (!isBackpressure) {
      this.client_ws.pause();
      this.stream.once('drain', this.client_ws.resume.bind(this));
    }
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
