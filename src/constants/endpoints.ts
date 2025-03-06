const ENDPOINTS = {
  // FLAG_URL: (code: string) => `https://flagsapi.com/${code}/flat/64.png`,
  FLAG_URL: (code: string) => `https://flagcdn.com/w160/${code}.png`,
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
  FETCH_BUSINESS_DETAILS: "/fetch_business_details",
  GET_DOCUMENT_TYPES: "/document_type",
  GET_COMPANY_TYPES: "/company_type",
  GET_BUSINESS_DOCUMENT_TYPES: "/business_document_type",
  GET_SHAREHOLDERS: "/shareholders",
  ADD_SHAREHOLDER: "/add_shareholder",
  EDIT_SHAREHOLDER: "/edit_shareholder",
  UPLOAD_SHAREHOLDER_ID: "/upload_shareholder_id",
  UPLOAD_PROOF_OF_IDENTIFICATION: "/proof_of_identification",
  UPLOAD_BUSINESS_DOCUMENT: "/upload_business_document",
  FETCH_BUSINESS_DOCUMENTS: "/business_documents",

  // Conversions
  CONVERSION_INDICATIVE_RATE: "/payment-services/fx_indicative_rate",
  CONVERSION_RATE: "/payment-services/fx_execute",

  // Transactions
  GET_CONVERSIONS: (page = 1, row_per_page = 15) =>
    `/payment-services/conversion_transaction?row_per_page=${row_per_page}&page=${page}`,
  GET_LOCAL_TRANSACTIONS: (page = 1, row_per_page = 15) =>
    `/payment-services/transaction_localpayment?row_per_page=${row_per_page}&page=${page}`,
  GET_INTERNATIONAL_TRANSACTIONS: (page = 1, row_per_page = 15) =>
    `/payment-services/transaction_international?row_per_page=${row_per_page}&page=${page}`,
};

export default ENDPOINTS;
