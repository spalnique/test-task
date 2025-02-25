import { useCallback, useEffect, useRef, useState } from 'react';

export function useTypingAnimation(chars: string[], delay = 25) {
  const [text, setText] = useState('');
  const intervalIdRef = useRef<NodeJS.Timeout>(undefined);

  const handleInterval = useCallback(() => {
    setText((prev) => {
      if (prev.length < chars.length) {
        return prev + chars[prev.length];
      }

      clearInterval(intervalIdRef.current);
      return prev;
    });
  }, [chars]);

  useEffect(() => {
    intervalIdRef.current = setInterval(handleInterval, delay);
    return () => clearInterval(intervalIdRef.current);
  }, [handleInterval, delay]);

  return text;
}
