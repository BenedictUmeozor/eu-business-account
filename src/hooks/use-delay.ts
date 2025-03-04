import { useCallback, useRef, useState } from 'react';

/**
 * A hook that returns a function which will delay the execution of the callback
 * for the specified amount of time. If called multiple times, previous calls
 * will be canceled. Also provides a loading state.
 * 
 * @param callback The function to delay execution
 * @param delay The delay time in milliseconds (defaults to 300ms)
 * @returns An object containing the delayed function and a loading state
 */
const useDelay = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 300
): {
  delayedFunction: (...args: Parameters<T>) => void;
  isLoading: boolean;
} => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const delayedFunction = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setIsLoading(true);

      timeoutRef.current = setTimeout(() => {
        callback(...args);
        setIsLoading(false);
      }, delay);
    },
    [callback, delay]
  );

  return {
    delayedFunction,
    isLoading,
  };
};

export default useDelay;