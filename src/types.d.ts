export {};

declare global {
  namespace HM {
    export type BusinessType =
      | "limited_company"
      | "limited_liability_partnership"
      | "public_limited_company";
  }
}
