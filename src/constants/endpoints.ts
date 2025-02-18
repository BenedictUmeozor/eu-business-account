const ENDPOINTS = {
  FLAG_URL: (code: string) => `https://flagsapi.com/${code}/flat/64.png`,
  APP_BASE_URL: "https://hellomemoney-api.hellomepay.online/api/business",

  // Onboarding
  SEARCH_COMPANY: "/search_company",
  CREATE_ACCOUNT: "/create_account",
  SEND_OTP: "/send_otp",
  CONFIRM_OTP: "/confirm_otp",
};

export default ENDPOINTS;
