import { Message } from '@/types/chat.type';
import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

export const useConversation = () => {
  const wsRef = useRef<WebSocket>(null);
  const streamRef = useRef<MediaStream>(null);
  const recorderRef = useRef<MediaRecorder>(null);

  const [isActive, setIsActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [responses, setResponses] = useState<Message[]>([]);

  const resetAll = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    recorderRef.current = null;

    setIsActive(false);
    setIsMuted(false);
    setIsConnected(false);
    setResponses([]);
  }, []);

  const setupMicrophone = useCallback(async () => {
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: { sampleRate: 24000 },
      });
    } catch (error) {
      toast.error('Microphone access is required');
      console.error('Microphone access error:', error);
    }
  }, []);

  const setupRecorder = useCallback(() => {
    recorderRef.current = new MediaRecorder(streamRef.current!, {
      mimeType: 'audio/webm',
      audioBitsPerSecond: 24000,
    });

    recorderRef.current.onstop = () => resetAll();
    recorderRef.current.onpause = () => setIsMuted(true);
    recorderRef.current.onresume = () => setIsMuted(false);

    recorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0 && isConnected) {
        wsRef.current?.send(event.data);
      }
    };

    recorderRef.current.onerror = (err) => {
      toast.error('Recorder error');
      console.error('Recorder error:', err);
      resetAll();
    };
  }, [isConnected, resetAll]);

  const setupWebSocket = useCallback(() => {
    wsRef.current = new WebSocket('ws://localhost:4001/assistant');
    if (!wsRef.current) return;

    wsRef.current.onopen = () => {
      wsRef.current!.onerror = (err) => {
        console.error('WebSocket error:', err);
        toast.error('WebSocket error');
        recorderRef.current?.stop();
      };

      wsRef.current!.onclose = () => {
        console.log('Disconnected from WS server');
        setIsConnected(false);
      };

      wsRef.current!.onmessage = (event) => {
        if (event.data === 'OK') {
          setIsConnected(true);
          recorderRef.current?.start(250);
        } else {
          setResponses((prev) => [JSON.parse(event.data), ...prev]);
        }
      };

      toast.dismiss('ws_loading');
      console.log('Connected to WS server');
    };
  }, []);

  useEffect(() => {
    if (!isActive) return;

    setIsPending(true);

    (async () => {
      toast.loading('Preparing...', { id: 'ws_loading' });

      await setupMicrophone();
      if (!streamRef.current) return;

      setupRecorder();
      setupWebSocket();
    })();

    setIsPending(false);

    return () => {
      recorderRef.current?.stop();
      resetAll();
    };
  }, [isActive, setupMicrophone, setupRecorder, setupWebSocket, resetAll]);

  const start = useCallback(() => setIsActive(true), []);
  const stop = useCallback(() => recorderRef.current?.stop(), []);
  const mute = useCallback(() => recorderRef.current?.pause(), []);
  const unmute = useCallback(() => recorderRef.current?.resume(), []);

  return {
    start,
    stop,
    mute,
    unmute,
    stream: streamRef.current,
    responses,
    isMuted,
    isPending,
    isConnected,
  };
};
