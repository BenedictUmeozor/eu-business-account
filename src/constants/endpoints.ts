const ENDPOINTS = {
  // FLAG_URL: (code: string) => `https://flagsapi.com/${code}/flat/64.png`,
  FLAG_URL: (code: string) => `https://flagcdn.com/w160/${code}.png`,
  APP_BASE_URL: "https://hellomemoney-api.hellomepay.online/api/business",
  APP_SHARED_BASE_URL: "https://hellomemoney-api.hellomepay.online/api",
  API_SUBSCRIPTION_KEY: "6293e6ec4f1949128067d751774bd709",

  //Enums
  SOURCE_OF_FUNDS: "/enums/financial_source_of_income",
  SOURCE_OF_WEALTH: "/enums/financial_source_of_wealth",

  // Auth
  CREATE_ACCOUNT: "/create_account",
  SEND_OTP: "/send_otp",
  CONFIRM_OTP: "/confirm_otp",
  LOGIN_USER: "/onboarding/signin",
  PASSCODE_SIGNIN: "/onboarding/passcode_signin",

  // Onboarding
  SEARCH_COMPANY: "/search_company",
  ONBOARDING_PROGRESS: "/onboarding_progress",
  VERIFY_BUSINESS: "/verify_business",
  BUSINESS_DETAILS: "/business_details",
  BUSINESS_TRANSACTION_DETAILS: "/business_transaction_details",
  PERSONAL_DETAILS: "/personal_details",
  FETCH_PERSONAL_INFORMATION: "/fetch_personal_details",
  FETCH_BUSINESS_DETAILS: "/fetch_business_details",
  FETCH_BUSINESS_TRANSACTION_DETAILS: "/fetch_business_transaction_details",
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
  SETUP_PASSCODE: "/onboarding/setup_passcode",
  FETCH_SECURITY_QUESTIONS: "/onboarding/fetch_questions",
  SET_SECURITY_QUESTION: "/onboarding/set_security_question",
  FORGOT_PASSWORD_LINK: "/onboarding/reset_password",
  RESET_ACCOUNT_PASSWORD: "/onboarding/reset_account_password",
  VERIFY_SECURITY_QUESTION: "/onboarding/verify_question",

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
  GET_RECEIPT: (id: string) =>
    `/payment-services/get_transaction?request_id=${id}`,
  FILTER_TRANSACTIONS: `/payment-services/filter_transaction`,

  // Beneficiaries
  SAVE_BENEFICIARY: "/account-services/save_beneficiary",
  FETCH_SINGLE_BENEFICIARY: "/account-services/get_beneficiary",
  FETCH_BENEFICIARY_BY_CURRENCY: "/account-services/beneficiary_by_currency",
  BANK_LIST: "/account-services/bank_list",
  RESOLVE_BANK_DETAILS: "/account-services/resolve_bank_details",
  FETCH_BENEFICIARY: "/account-services/fetch_beneficiary",

  // Payments
  REGISTER_DEVICE: "/customer-services/register_device_web",
  INITIATE_LOCAL_PAYMENT: "/payment-services/initiate_sca_payment",
  DEVICE_SCA_STATUS: "/customer-services/sca_status",

  // Accounts
  GET_ACCOUNTS: "/account-services/get_accounts",
  GET_ACCOUNT_BALANCES: "/account-services/account_balances",
  GET_ACCOUNT_CURRENCIES: "/account-services/client_currency",
  REQUEST_ACCOUNT_CUURENCY: "/account-services/request_account_currency",
  GET_BALANCE: "/account-services/get_balances",
  FETCH_IBAN: "/account-services/fetch_iban",
  GET_ACCOUNT_DETAILS: "/account-services/fetch_iban",
  GET_ALL_ACCOUNT_CURRENCIES: "/account-services/client_currency_international",

  // Others
  PARTNER_CURRENCY: "/payment-services/partner_currency",
  SEPA_COUNTRIES: "/account-services/sepa_countries",

  // Profile
  CHANGE_PASSWORD: "/profile/change_password",
  CHANGE_PIN: "/profile/change_pin",
  FETCH_USER_SECURITY_QUESTIONS: "/profile/fetch_security_questions",
  GET_CUSTOMER_PROFILE: "/profile/customer_profile",
  UPLOAD_PHOTO: "/profile/upload_photo",

  // International Payments
  REMITTER_SOURCE: "/remitter/remittance_source",
  REMITTER_DESTINATION: "/remitter/remittance_destinations",
  REMITTER_PAYMENT_METHODS: "/remitter/payment_method_international",
  REMITTER_DELIVERY_METHODS: "/remitter/delivery_method",
  REMITTER_SOURCE_OF_FUNDS: "/remitter/source_of_funds",
  REMITTER_TRANSFER_PURPOSE: "/remitter/transfer_purpose",
  PROCESS_REMITTANCE: "/remitter/process_request",
  SELECT_PAYMENT_ACCOUNT: "/remitter/select_account_payment",
  REMITTER_INITIATE_HELLOMEMONEY_PAYMENT: "/remitter/initiate_hellome_payment",
  PAYMENT_PROGRESS: "/remitter/payment_progress",

  GENERATE_QUOTE: "/payment-services/fx_qoute",
  LOCK_QUOTE: "/payment-services/lock_qoute", // Returns the reference
};

export default ENDPOINTS;
