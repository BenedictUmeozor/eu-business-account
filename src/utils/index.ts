export const formatPhoneNumber = (phoneNumber: string, phoneCode: string) => {
  return phoneNumber.replace(phoneCode, "");
};

export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
