import { useEffect, useRef, useState } from 'react';

export const useWebSockets = (isConversation: boolean) => {
  const wsRef = useRef<WebSocket>(null);

  const [isReady, setIsReady] = useState(false);
  const [response, setResponse] = useState('');

  useEffect(() => {
    if (isConversation) {
      const ws = new WebSocket('ws://localhost:4001/');

      ws.onopen = () => console.log('Connected to WS server');
      ws.onerror = (err) => console.error('WebSocket error:', err);
      ws.onclose = () => {
        setIsReady(false);
        console.log('Disconnected from WS server');
      };

      ws.onmessage = (event) => {
        if (event.data === 'OK') {
          setIsReady(true);
        } else {
          setResponse(event.data);
        }
      };

      wsRef.current = ws;
    } else {
      wsRef.current?.close();
      setResponse('');
    }

    return () => wsRef.current?.close();
  }, [isConversation]);

  return { response, isReady, websocket: wsRef.current };
};
