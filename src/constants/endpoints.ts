const ENDPOINTS = {
  FLAG_URL: (code: string) => `https://flagsapi.com/${code}/flat/64.png`,
  APP_BASE_URL: "https://hellomemoney-api.hellomepay.online/api/business",
  APP_SHARED_BASE_URL: "https://hellomemoney-api.hellomepay.online/api",

  // Auth
  CREATE_ACCOUNT: "/create_account",
  SEND_OTP: "/send_otp",
  CONFIRM_OTP: "/confirm_otp",
  LOGIN_USER: "/onboarding/signin",

  // Onboarding
  SEARCH_COMPANY: "/search_company",
  ONBOARDING_PROGRESS: "/onboarding_progress",
  VERIFY_BUSINESS: "/verify_business",
  BUSINESS_DETAILS: "/business_details",
  PERSONAL_DETAILS: "/personal_details",
  FETCH_PERSONAL_INFORMATION: "/fetch_personal_details",
};

export default ENDPOINTS;
