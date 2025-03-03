'use client';

import AudioVisualizer from '@/components/AudioVizualizer';
import MessageList from '@/components/MessageList';
import MicrophoneButton from '@/components/MicrophoneButton';
import PageWrapper from '@/components/PageWrapper';
import { useConversation } from '@/hooks/useConversation';
import { Button } from '@heroui/react';

export default function AudioPage() {
  const {
    stream,
    isPending,
    isMuted,
    isConnected,
    responses,
    start,
    stop,
    mute,
    unmute,
  } = useConversation();

  return (
    <PageWrapper className="min-h-80 w-[550px] items-center justify-center gap-8 rounded-3xl px-5 py-10">
      {isConnected && (
        <>
          <AudioVisualizer
            stream={isMuted ? null : stream}
            backgroundColor="transparent"
          />
          <MicrophoneButton isMuted={isMuted} mute={mute} unmute={unmute} />
        </>
      )}

      {!!responses.length && <MessageList responses={responses} />}
      <Button
        onPress={isConnected ? stop : start}
        className="bg-[#622BD8] text-white"
      >
        {isPending
          ? 'Connecting...'
          : isConnected
            ? 'Stop conversation'
            : 'Start conversation'}
      </Button>
    </PageWrapper>
  );
}
