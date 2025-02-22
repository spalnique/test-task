import { RealtimeAPIConnection } from '@realtime_api';
import { WebSocketServer } from 'ws';

import { realtimeAPIConfig, serverConfig } from '@config';

const ws_server = new WebSocketServer(serverConfig);

ws_server.on('listening', () => {
  console.log('WebSocket server listening at', serverConfig.port);
});

ws_server.on('connection', (ws) => {
  console.log('Client connected');
  const connection = new RealtimeAPIConnection(ws, realtimeAPIConfig);

  ws.on('message', (chunk) => connection.handleClientMessage(chunk));
  ws.on('close', () => {
    console.log('Client disconnected');
    connection.close();
  });
});
