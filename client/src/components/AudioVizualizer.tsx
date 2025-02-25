import { ComponentPropsWithRef, useEffect, useRef } from 'react';

type Props = ComponentPropsWithRef<'canvas'> & {
  stream: MediaStream | null;
  backgroundColor?: string;
};

const AudioVisualizer = ({
  stream,
  backgroundColor = 'transparent',
}: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext>(null);
  const analyserRef = useRef<AnalyserNode>(null);
  const dataArrayRef = useRef<Uint8Array<ArrayBuffer>>(null);

  useEffect(() => {
    if (!stream) return;

    const audioCtx = new AudioContext();
    const source = audioCtx.createMediaStreamSource(stream);
    // Update analyzer settings for better response
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 32;
    analyser.smoothingTimeConstant = 0.4;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    source.connect(analyser);
    audioCtxRef.current = audioCtx;
    analyserRef.current = analyser;
    dataArrayRef.current = dataArray;

    const canvas = canvasRef.current;

    if (canvas) {
      const ctx = canvas.getContext('2d');

      const draw = () => {
        requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);

        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          const padding = 10;
          const availableWidth = canvas.width - padding * 2;

          // Adjust bar calculations with padding
          const barWidth = availableWidth / 8;
          const maxHeight = canvas.height * 0.4;
          const gap = barWidth / 2;
          const radius = barWidth / 2;

          for (let i = 0; i < 5; i++) {
            let frequencyRange;

            if (i === 2) {
              const start = Math.floor(bufferLength * 0.4);
              const end = Math.floor(bufferLength * 0.6);
              frequencyRange = { start, end };
            }
            // Make bars 0,3 and 1,2 pairs handle the same frequencies
            if (i === 1 || i === 3) {
              // Middle bars (1,2) - focused on speech frequencies
              const start = Math.floor(bufferLength * 0.3);
              const end = Math.floor(bufferLength * 0.7);
              frequencyRange = { start, end };
            } else {
              // Outer bars (0,3) - handle lower and higher frequencies
              const start = Math.floor(bufferLength * 0.2);
              const end = Math.floor(bufferLength * 0.8);
              frequencyRange = { start, end };
            }

            let sum = 0;
            for (let j = frequencyRange.start; j < frequencyRange.end; j++) {
              sum += dataArray[j];
            }
            const average = sum / (frequencyRange.end - frequencyRange.start);

            // Make sensitivity the same for each pair
            const sensitivityMultiplier =
              i === 2 ? 3 : i === 1 || i === 3 ? 2.25 : 1.5;
            const volume = (average / 255) * sensitivityMultiplier;

            // Ensure minimum height is equal to width (making it a circle when at minimum)
            const barHeight = Math.max(barWidth, volume * maxHeight);

            // Adjust x position to account for padding
            const x = padding + (i * (barWidth + gap) + gap);
            const y = (canvas.height - barHeight) / 2;

            // Create gradient based on volume with adjusted intensity
            const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
            const intensity = Math.floor(volume * 255);
            gradient.addColorStop(0, `rgb(${intensity}, 34, 215)`);
            gradient.addColorStop(1, 'rgb(91, 34, 215)');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.roundRect(x, y, barWidth, barHeight, radius);
            ctx.fill();
          }
        }
      };
      draw();
    }

    return () => {
      audioCtx.close();
    };
  }, [stream]);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={400}
      style={{
        background: backgroundColor,
        width: '150px',
        height: '100px',
      }}
    />
  );
};

export default AudioVisualizer;
