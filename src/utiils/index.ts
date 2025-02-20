export const formatPhoneNumber = (phoneNumber: string, phoneCode: string) => {
  return phoneNumber.replace(phoneCode, "");
};
