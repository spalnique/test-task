import { Transform } from 'stream';

import { v4 as uuidv4 } from 'uuid';
import WebSocket from 'ws';

import { OPENAI_API_URL } from '@constants';
import { audioTransformStream } from '@streams';
import { RealtimeAPIConfig, RealtimeAPIEvent } from '@types';

export default class RealtimeAPIConnection {
  private static readonly url = OPENAI_API_URL;

  private openai_ws: WebSocket;
  private stream: Transform;
  private client_ws: WebSocket;

  constructor(client_websocket: WebSocket, config: RealtimeAPIConfig) {
    this.client_ws = client_websocket;
    this.connect(config);
  }

  private connect(config: RealtimeAPIConfig) {
    this.openai_ws = new WebSocket(RealtimeAPIConnection.url, config);

    this.stream = audioTransformStream(this.openai_ws);
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.openai_ws.on('open', () => this.handleSessionUpdate());
    this.openai_ws.on('message', (event) => this.handleOpenAIMessage(event));
    this.openai_ws.on('error', (error) => this.handleError(error));
    this.openai_ws.on('close', () => this.handleClose());
  }

  private handleSessionUpdate() {
    const session: RealtimeAPIEvent = {
      event_id: `event_${uuidv4()}`,
      type: 'session.update',
      session: {
        modalities: ['text'],
        instructions: 'You are a helpful assistant.',
        voice: 'sage',
        input_audio_format: 'pcm16',
        output_audio_format: 'pcm16',
        input_audio_transcription: { model: 'whisper-1' },
        turn_detection: null,
        tools: [],
        tool_choice: 'auto',
        temperature: 0.8,
        max_response_output_tokens: 2048,
      },
    };

    this.openai_ws.send(JSON.stringify(session));
  }

  private handleOpenAIMessage(event: WebSocket.RawData) {
    try {
      const parsedEvent = JSON.parse(
        event.toString('utf-8')
      ) as RealtimeAPIEvent;

      switch (parsedEvent.type) {
        case 'session.updated':
          console.log('OpenAI message: session config updated');
          this.client_ws.send('ready');
          break;

        case 'response.done':
          console.log('OpenAI message: response done');

          const message = parsedEvent.response.output[0].content[0].text;
          console.log('Response:', message);

          this.client_ws.send(JSON.stringify(message));
          break;

        default:
          console.log('OpenAI message:', parsedEvent);
          break;
      }
    } catch (error) {
      console.error('Error handling OpenAI message:', error);
    }
  }

  public handleClientMessage(chunk: WebSocket.RawData) {
    this.stream.write(chunk);
  }

  private handleError(error: Error) {
    console.error('OpenAI WebSocket error:', error);
    this.client_ws.close();
  }

  private handleClose() {
    console.log('OpenAI connection closed');
    this.stream = null;
  }

  public close() {
    this.openai_ws.close();
  }
}
