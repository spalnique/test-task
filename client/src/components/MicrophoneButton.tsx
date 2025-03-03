import { DotLottie, DotLottieReact } from '@lottiefiles/dotlottie-react';
import { ComponentPropsWithRef, RefCallback, useEffect, useRef } from 'react';

type Props = ComponentPropsWithRef<'div'> & {
  isMuted: boolean;
  mute: () => void;
  unmute: () => void;
};

export default function MicrophoneButton({ isMuted, mute, unmute }: Props) {
  const lottieRef = useRef<DotLottie | null>(null);

  const dotLottieRefCallback: RefCallback<DotLottie | null> = (lottie) => {
    lottie?.setViewport(0, 0, 100, 100);
    lottieRef.current = lottie;
  };

  const toggleMute = () => (isMuted ? unmute() : mute());

  useEffect(() => {
    if (isMuted) lottieRef.current?.play();

    return () => {
      lottieRef.current?.stop();
      lottieRef.current = null;
    };
  }, [isMuted]);

  const lottieSrc = isMuted
    ? 'microphone_violet.lottie'
    : 'microphone_red.lottie';

  return (
    <div className="mb-3 size-20 scale-[1.5] cursor-pointer">
      <DotLottieReact
        src={lottieSrc}
        className="size-full"
        dotLottieRefCallback={dotLottieRefCallback}
        speed={0.75}
        renderConfig={{ autoResize: true }}
        onClick={toggleMute}
        autoplay
        loop
      />
    </div>
  );
}
