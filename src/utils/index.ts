import { AxiosError } from "axios";

export const formatPhoneNumber = (phoneNumber: string, phoneCode: string) => {
  return phoneNumber?.replace(phoneCode, "") || "";
};

export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getErrorMessage = (error: AxiosError<unknown, any>) => {
  console.log("getErrorMessage -> error", error);
  const errorMap = {
    401: "Your session has expired. Please login again.",
    404: "Resource not found",
  };

  if (typeof error === "string") return error;
  if (!navigator.onLine) return "Please check your internet connection";
  if ((error.response?.data as any)?.message)
    return (error.response?.data as any).message;
  if (error.response?.status && error.response.status in errorMap) {
    return errorMap[error.response.status as keyof typeof errorMap];
  }
  if (error.message) return error.message;

  return "An unexpected error occurred. Please try again.";
};
