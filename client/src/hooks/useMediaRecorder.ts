import { useCallback, useRef, useState } from 'react';

export const useMediaRecorder = (websocket: WebSocket | null) => {
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const init = useCallback(async () => {
    if (!websocket || websocket.readyState !== websocket.OPEN) {
      throw new Error('WebSocket is not connected');
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 24000,
          noiseSuppression: false,
          echoCancellation: false,
          autoGainControl: false,
        },
      });

      streamRef.current = stream;

      const recorder = new MediaRecorder(streamRef.current, {
        mimeType: 'audio/webm',
        audioBitsPerSecond: 24000,
      });

      recorder.onerror = (err) => {
        console.error('Recorder error:', err);
        setError(err.error);
      };

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0 && websocket.readyState === WebSocket.OPEN) {
          websocket.send(event.data);
        }
      };

      recorder.onstart = () => {
        setIsRecording(true);
      };

      recorder.onstop = () => {
        websocket?.send('DONE');
        setIsRecording(false);

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
        recorderRef.current = null;
      };

      recorderRef.current = recorder;
      return recorder;
    } catch (error) {
      console.error('Error initializing recorder:', error);
      setError(
        error instanceof Error
          ? error
          : new Error('Failed to initialize recorder')
      );
      throw error;
    }
  }, [websocket]);

  const start = useCallback(async () => {
    try {
      const recorder = await init();
      recorder.start(250);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  }, [init]);

  const stop = useCallback(() => {
    if (recorderRef.current && isRecording) {
      recorderRef.current.stop();
    }
  }, [isRecording]);

  return {
    stream: streamRef.current,
    isRecording,
    error,
    start,
    stop,
  };
};
