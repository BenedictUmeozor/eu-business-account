import { useState } from "react";

export function usePasscode() {
  const [passcode, setPasscode] = useState<string | undefined>(undefined);
  
  const updatePasscode = (value: string) => {
    setPasscode(value);
  };

  return {
    passcode,
    updatePasscode,
    resetPasscode: () => setPasscode(undefined)
  };
}