import { ComponentPropsWithRef, useEffect, useRef } from 'react';

type Props = ComponentPropsWithRef<'canvas'> & {
  stream: MediaStream | null;
  backgroundColor?: string;
};

export default function AudioVisualizer({
  stream,
  backgroundColor = 'transparent',
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext>(null);
  const analyserRef = useRef<AnalyserNode>(null);
  const dataArrayRef = useRef<Uint8Array<ArrayBuffer>>(null);

  useEffect(() => {
    if (!stream) return;

    const audioCtx = new AudioContext();
    const source = audioCtx.createMediaStreamSource(stream);
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
            if (i === 1 || i === 3) {
              const start = Math.floor(bufferLength * 0.3);
              const end = Math.floor(bufferLength * 0.7);
              frequencyRange = { start, end };
            } else {
              const start = Math.floor(bufferLength * 0.2);
              const end = Math.floor(bufferLength * 0.8);
              frequencyRange = { start, end };
            }

            let sum = 0;
            for (let j = frequencyRange.start; j < frequencyRange.end; j++) {
              sum += dataArray[j];
            }
            const average = sum / (frequencyRange.end - frequencyRange.start);

            const sensitivityMultiplier =
              i === 2 ? 3 : i === 1 || i === 3 ? 2.25 : 1.5;
            const volume = (average / 255) * sensitivityMultiplier;

            const barHeight = Math.max(barWidth, volume * maxHeight);

            const x = padding + (i * (barWidth + gap) + gap);
            const y = (canvas.height - barHeight) / 2;

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
}
