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

    interface LoginResponse {
      status: string;
      message: string;
      data: {
        user_token: string;
        fname: string;
        lname: string;
        email: string;
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

    interface OnboardingProgress {
      email_verification: string;
      business_verification: string;
      business_details: string;
      personal_details: string;
      shareholder: string;
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
