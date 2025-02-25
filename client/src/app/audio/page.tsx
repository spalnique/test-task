'use client';

import AudioVisualizer from '@/components/AudioVizualizer';
import ChatResponse from '@/components/ChatResponse';
import MicrophoneButton from '@/components/MicrophoneButton';
import PageWrapper from '@/components/PageWrapper';
import { useMediaRecorder } from '@/hooks/useMediaRecorder';
import { useWebSockets } from '@/hooks/useWebSockets';
import { Button } from '@heroui/react';
import { useState } from 'react';

export default function AudioPage() {
  const [isConversation, setIsConversation] = useState(false);

  const { response, isReady, websocket } = useWebSockets(isConversation);
  const { stream, isRecording, start, stop } = useMediaRecorder(websocket);

  const toggleConversation = () => setIsConversation((prev) => !prev);

  return (
    <PageWrapper className="min-h-80 w-[550px] items-center justify-center gap-8 rounded-3xl px-5 py-10">
      {isReady && isConversation && (
        <>
          {stream && isRecording && (
            <AudioVisualizer stream={stream} backgroundColor="transparent" />
          )}

          <MicrophoneButton
            isReady={isReady}
            isRecording={isRecording}
            onStart={start}
            onStop={stop}
          />
          {response && <ChatResponse key={response} response={response} />}
        </>
      )}
      <Button onPress={toggleConversation} className="bg-[#622BD8] text-white">
        {`${isConversation && isReady ? 'Stop' : 'Start'} conversation`}
      </Button>
    </PageWrapper>
  );
}
