import {
  FilterValue,
  SorterResult,
  TableCurrentDataSource,
} from "antd/es/table/interface";

export {};

declare global {
  namespace HM {
    export type BusinessType =
      | "limited_company"
      | "limited_liability_partnership"
      | "public_limited_company";

    type ModalRefObject = {
      openModal: () => void;
    };

    type TableState<RecordType = any> = {
      pagination: TablePaginationConfig;
      filters: Record<string, FilterValue | null>;
      sorter: SorterResult<RecordType> | SorterResult<RecordType>[];
      extra: TableCurrentDataSource<RecordType>;
    };

    interface QueryResponseWithData<T> {
      data: T;
      message: string;
      status: number;
    }

    interface QueryResponse {
      message: string;
      status: number;
    }

    interface CustomerProfile {
      status: string;
      fname: string;
      lname: string;
      phone_code: string;
      phone_number: string;
      occupation: string;
      gender: string;
      dob: string;
      address: string;
      refcode?: any;
      country: string;
      postcode?: any;
    }

    interface LoginResponse {
      status: string;
      message: string;
      data: {
        user_token: string;
        fname: string;
        lname: string;
        email: string;
        country: string;
        account_type: string;
        is_existing?: any;
        existing_onboarding_status?: any;
        jwt: string;
      };
      business_data: {
        business_token: string;
        business_name?: any;
        incorporation_number?: any;
        business_type?: any;
        business_structure: string;
        business_industry?: any;
      };
    }

    interface DocumentType {
      name: string;
      code: string;
    }

    interface CompanyDetails {
      status: string;
      company_details: {
        company_name: string;
        company_number: string;
        company_status: string;
        date_of_creation: string;
        etag: string;
        jurisdiction: string;
        address_line_1: string;
        address_line_2: string;
        country: string;
        locality: string;
        postcode: string;
        region?: any;
        sic_codes: string;
        type: string;
      };
    }

    interface CompanyType {
      id: string;
      code: string;
      company_type: string;
    }

    interface Transaction {
      source_account: string;
      currency: string;
      amount: number;
      charge: number;
      bank_country: string;
      beneficiary_account: string;
      beneficiary_name: string;
      reference: string;
      request_id: string;
      transaction_status: string;
      request_status?: any;
      date: string;
      type: string;
      category: string;
      binding_ref?: any;
      balance_before: number;
      balance_after?: any;
    }

    interface AccountDetails {
      accountRef: string;
      accountName: string;
      accountType: string;
      currency: string;
      customer_number: string;
      account_number: string;
      vibans: string[];
      ibans: Record<string, string>;
    }

    interface BalanceInfo {
      type: string;
      amount: number;
      ccy: string;
    }

    interface Bank {
      id: number;
      code: string;
      name: string;
      logo: string;
      created: string;
    }

    interface SepaCountry {
      country: string;
      iso: string;
    }

    interface PartnerCurrency {
      name: string;
      currency: string;
    }

    interface AccountCurrency {
      status: string;
      details: {
        currencies: string[][];
      };
    }

    interface ResolveBankData {
      status: string;
      message: string;
      beneficiary_name?: any;
      bank_country: string;
      account_number?: any;
      beneficiary_country: string;
      currency: string;
      bank?: any;
    }

    interface AccountBalances {
      data: {
        currency: string;
        balance: BalanceInfo;
      }[];
    }

    interface ConversionTransaction {
      source_account: string;
      currency: string;
      amount: number;
      charge: number;
      bank_country?: any;
      beneficiary_account: string;
      beneficiary_name: string;
      reference: string;
      request_id?: any;
      transaction_status: string;
      request_status?: any;
      date: string;
      type: string;
      currency_pair: string;
      binding_ref: string;
      balance_before: number;
      balance_after: number;
    }

    interface Currency {
      currencyCode: string;
      currencySymbol: string;
      flag: string;
      countryName: string;
      countryCode: string;
    }

    interface IndicativeRate {
      status: string;
      source_currency: string;
      target_currency: string;
      source_amount: number;
      target_amount: number;
      rate: number;
      indication: string;
    }

    interface ConversionRate {
      status: string;
      message: string;
      source_currency: string;
      target_currency: string;
      source_amount: number;
      target_amount: number;
      reference: string;
    }

    interface BusinessDetails {
      status: string;
      message: string;
      business_token: string;
      business_name: string;
      incorporation_number: string;
      business_type: string;
      business_industry: string;
      business_structure?: any;
      phone_code: string;
      phone_number: string;
      account_purpose: string;
      sic: string;
      website: string;
      monthly_turnover: string;
      expected_currency: string;
      source_countries: string;
      target_countries: string;
      partners: string;
      business_license: string;
      is_registered?: any;
      incorporation_date: string;
      etag: string;
      business_address: string;
      town: string;
      region: string;
      postcode: string;
      partners_outgoing: string;
      economic_activity: string;
      annual_balance_sheet_exceed_2m: string;
      product_services_sold: string;
      is_publicly_listed: string;
      allows_for_issuance_share: string;
      tax_residence_country: string;
      vat_number: string;
      is_financial_institution: string;
      giin: string;
      established_security_market: string;
      is_company_licensed_by_regulatory: string;
      regulatory_entity: string;
      core_source_of_revenue: string;
      fatca: string;
      source_of_funds: string;
      source_of_wealth: string;
      number_of_ubo: string;
      main_currency: string;
    }

    interface BusinessTransactionDetails {
      status: string;
      message: string;
      incoming_sepa_trans?: string;
      average_incoming_sepa_trans?: string;
      incoming_uk_trans?: string;
      average_incoming_uk_trans?: string;
      incoming_crossborder_trans?: string;
      average_incoming_crossborder_trans?: string;
      outgoing_sepa_trans?: string;
      average_outgoing_sepa?: string;
      outgoing_uk_trans?: string;
      average_outgoing_uk_trans?: string;
      outgoing_crossborder_trans?: string;
      average_outgoing_crossborder_trans?: string;
    }

    interface Pagination {
      total_record: number;
      row_per_page: number;
      no_of_pages: number;
      current_page: number;
    }

    interface Question {
      question_id: number;
      question: string;
    }

    interface Beneficiary {
      beneficiary_id: number;
      type: "Personal" | "Business";
      category: string;
      fname: string | null;
      lname: string | null;
      oname: string | null;
      fullname: string | null;
      receiver_email: string | null;
      currency: string;
      account_number: string;
      bank_name: string | null;
      bank_code: string | null;
      account_type: string | null;
      bank_country: string;
      ben_country: string;
      ben_city: string | null;
      ben_address: string | null;
      routing_number: string | null;
      iban: string | null;
      bic: string | null;
      company_name?: string | null;
      corresponding_bank: string | null;
    }

    interface PersonalDetails {
      status: string;
      message: string;
      fname: string;
      lname: string;
      oname: string;
      dob: string;
      occupation: string;
      gender: string;
      address: string;
      street: string;
      city: string;
      postcode: string;
      business_role: string;
      business_stake: string;
      percentage_stake: string;
      authorized_signatory: string;
      document: {
        data: {
          document_name: string;
          document_type: string;
          id_number: string;
          filepath: string;
        }[];
      };
    }

    interface Shareholder {
      shareholder_token: string;
      type: string;
      fname: string;
      lname: string;
      business_name: string | undefined | null;
      business_number: string | undefined | null;
      email: string;
      role: string;
      residential_address: string;
      postcode: string;
      region: string;
      shareholding_percentage: string;
      authorized_signatory: string;
      political_exposed_person: string | undefined;
      position_held: string | undefined;
      country_of_pep: string | undefined;
      related_pep: string | undefined;
      name_of_pep: string | undefined;
      relationship_with_pep: string | undefined;
      political_position: string | undefined;
      country_position_held: string | undefined;
      documents: {
        data: {
          document_type: string;
          document_name: string;
          side: string;
          filepath: string;
        }[];
      };
    }

    interface UploadedDocuments {
      status: string;
      message: string;
      documents: {
        data: {
          document_id: number;
          document_type: string;
          document_name: string;
          filepath: string;
        }[];
      };
    }

    type TransactionStatus =
      | "Completed"
      | "Declined"
      | "Accepted"
      | "CompletedWithErrors"
      | "Processing";

    type TransactionCurr = "EUR" | "GBP" | "USD" | "NGN" | "DKK";

    interface TransactionFilter {
      row_per_page?: number;
      page: string | number;
      from: string;
      to: string;
      transaction_status: TransactionStatus;
      category: "LocalPayment" | "InternationalPayment" | "Conversion" | "ALL";
      currency: TransactionCurr;
    }

    interface SingleReceipt {
      status: string;
      type: string;
      category: string;
      currency: string;
      amount_sent: {
        currency: string;
        value: number;
      };
      transaction_status: string;
      date: {
        value: string | null;
        posting: string;
      };
      charges: {
        currency: string;
        value: number | null;
      };
      balance: {
        balance_before: number;
        balance_after: number | null;
      };
      beneficiary: {
        country: string;
        account_number: string;
        name: string;
        city: string | null;
        address: string | null;
      };
      bank: {
        bank_name: string | null;
        bank_country: string;
        bic: string;
      };
      sender: {
        sender_name: string;
        sender_account: string;
      };
      reference: string | null;
      narration: string;
      request_status: string;
      exchange_rate: number | null;
      errors: string;
    }

    interface ShareholderResponse {
      status: string;
      shareholder: {
        data: Shareholder[];
      };
    }
  }

  namespace PD {
    interface PersonalDetails {
      status: string;
      message: string;
      fname: string;
      lname: string;
      oname: string;
      dob?: string;
      occupation?: string;
      gender?: string;
      address?: string;
      street?: string;
      city?: string;
      postcode?: string;
      business_role?: string;
      business_stake?: string;
      percentage_stake?: string;
      authorized_signatory?: string;
    }
  }
}
