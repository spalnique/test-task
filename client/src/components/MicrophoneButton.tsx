import { DotLottie, DotLottieReact } from '@lottiefiles/dotlottie-react';
import {
  ComponentPropsWithRef,
  RefCallback,
  useCallback,
  useMemo,
  useRef,
} from 'react';

type Props = ComponentPropsWithRef<'div'> & {
  isRecording: boolean;
  isReady: boolean;
  onStart: () => Promise<void>;
  onStop: () => void;
};

export default function MicrophoneButton({
  isRecording,
  isReady,
  onStart,
  onStop,
}: Props) {
  const lottieRef = useRef<DotLottie | null>(null);

  const dotLottieRefCallback: RefCallback<DotLottie | null> = (lottie) => {
    lottie?.setViewport(0, 0, 100, 100);
    lottieRef.current = lottie;
  };

  const handleMouseEnter = useCallback(() => {
    if (isReady && lottieRef.current) lottieRef.current.play();
  }, [isReady]);

  const handleMouseLeave = useCallback(() => {
    if (isReady && lottieRef.current) lottieRef.current.stop();
  }, [isReady]);

  const lottieSrc = useMemo(
    () => (isRecording ? 'microphone_red.lottie' : 'microphone_violet.lottie'),
    [isRecording]
  );

  return (
    <div className="mb-3 size-20 scale-[1.5] cursor-pointer">
      <DotLottieReact
        src={lottieSrc}
        className="size-full"
        dotLottieRefCallback={dotLottieRefCallback}
        speed={0.75}
        renderConfig={{ autoResize: true }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={isRecording ? onStop : onStart}
        autoplay={isRecording}
        loop
      />
    </div>
  );
}
