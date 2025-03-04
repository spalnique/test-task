import { useCallback, useEffect, useRef, useState } from 'react';

export function useTypingAnimation(string: string = '') {
  const [text, setText] = useState('');
  const intervalIdRef = useRef<NodeJS.Timeout>(undefined);

  const chars = string.split('');

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
    setText('');
  }, [string]);

  useEffect(() => {
    intervalIdRef.current = setInterval(handleInterval, 25);
    return () => clearInterval(intervalIdRef.current);
  }, [handleInterval]);

  return text;
}
