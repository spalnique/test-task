import { RealtimeAPIConnection } from '@realtime_api';
import { WebSocket, WebSocketServer } from 'ws';

import { realtimeAPIConfig, serverConfig } from '@config';

function handleConnection(ws: WebSocket) {
  console.log('Client connected');

  try {
    const connection = new RealtimeAPIConnection(ws, realtimeAPIConfig);

    ws.on('message', (chunk) => connection.handleClientMessage(chunk));
    ws.on('close', () => {
      console.log('Client disconnected');
      connection.close();
    });
  } catch (error) {
    console.error(error);
  }
}

function handleListening() {
  console.log('WebSocket server listening at', serverConfig.port);
}

const ws_server = new WebSocketServer(serverConfig);

ws_server.on('listening', handleListening);
ws_server.on('connection', handleConnection);
