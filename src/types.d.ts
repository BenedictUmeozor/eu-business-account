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

    type TableState<RecordType = any> = {
      pagination: TablePaginationConfig;
      filters: Record<string, FilterValue | null>;
      sorter: SorterResult<RecordType> | SorterResult<RecordType>[];
      extra: TableCurrentDataSource<RecordType>;
    };

    interface QueryResponse<T> {
      data: T;
      message: string;
      status: number;
    }

    export interface CompanyDetails {
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
  }
}
