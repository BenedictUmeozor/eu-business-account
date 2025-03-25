import { useCallback } from 'react';

const useDelayTimer = () => {
  const delay = useCallback((ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }, []);

  return delay;
};

export default useDelayTimer;