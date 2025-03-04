export const debounce = <T extends unknown[]>(
  fn: (...args: T) => void,
  delay: number
) => {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: T) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn(...args);
      clearTimeout(timeout);
    }, delay);
  };
};
