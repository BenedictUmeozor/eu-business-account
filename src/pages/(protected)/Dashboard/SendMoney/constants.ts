interface Beneficiary {
  first_name: string;
  last_name: string;
  bank_name: string;
  account_number: string;
  country: string; // ng, gb etc
}

interface SendMoneyOption {
  title: string | ((currency?: string) => string);
  description: string;
  image: string;
  to: string;
  tag?: string;
}

interface PaymentType extends Omit<SendMoneyOption, "title"> {
  title: string;
  comingSoon?: boolean;
}

export const PAYMENT_TYPES: PaymentType[] = [
  {
    title: "Single Payments",
    description:
      "Send money to a beneficiary globally with the click of a button. Zero hassles",
    image: "/images/single.png",
    to: "/dashboard/send-money/local-payments/single",
  },
  {
    title: "Bulk Payments",
    description:
      "Your smart way to pay. Set up bulk transfers to family, teams or vendors globally. ",
    image: "/images/bulk.png",
    to: "/dashboard/send-money/local-payments/bulk",
    comingSoon: true,
  },
];

export const PAYMENT_TYPES_INTERNATIONAL: PaymentType[] = [
  {
    title: "Single Payments",
    description:
      "Send money to a beneficiary globally with the click of a button. Zero hassles",
    image: "/images/single.png",
    to: "/dashboard/send-money/international-payments/single",
  },
  {
    title: "Bulk Payments",
    description:
      "Your smart way to pay. Set up bulk transfers to family, teams or vendors globally. ",
    image: "/images/bulk.png",
    to: "/dashboard/send-money/international-payments/bulk",
    comingSoon: true,
  },
];

export const SEND_MONEY_OPTIONS: SendMoneyOption[] = [
  {
    title: (currency?: string) => `Local (${currency} - ${currency})`,
    description:
      "Need to make a local payment UK/EU/USA? Select this option for fast, secure transfers within your country!",
    image: "/images/local-payment.png",
    to: "/dashboard/send-money/local-payments",
    tag: "Fast Payment",
  },
  {
    title: "International",
    description:
      "Send money to your friends or family overseas effortlessly! Choose this option for quick and reliable international transfers.",
    image: "/images/international-payment.png",
    to: "/dashboard/send-money/international-payments",
  },
  {
    title: "Payment Link",
    description: "Create a payment link, for fast and secure transaction",
    image: "/images/payment-link.png",
    to: "/dashboard/send-money/payment-link",
  },
  {
    title: "HelloMe Money Friends",
    description: "Send money to your friends on HelloMe Money using tags",
    image: "/images/hellome-money-friends.png",
    to: "/dashboard/send-money/hellome-money-friends",
  },
];

export const BENEFICIARIES: Beneficiary[] = [
  {
    first_name: "John",
    last_name: "Smith",
    bank_name: "Barclays",
    account_number: "82749203847",
    country: "gb",
  },
  {
    first_name: "Olayinka",
    last_name: "Adebayo",
    bank_name: "GTBank",
    account_number: "0123456789",
    country: "ng",
  },
  {
    first_name: "Sarah",
    last_name: "Johnson",
    bank_name: "HSBC",
    account_number: "92837465019",
    country: "gb",
  },
  {
    first_name: "Chioma",
    last_name: "Okonkwo",
    bank_name: "Access Bank",
    account_number: "2345678901",
    country: "ng",
  },
  {
    first_name: "Michael",
    last_name: "Williams",
    bank_name: "Lloyds",
    account_number: "74839201846",
    country: "gb",
  },
  {
    first_name: "Babajide",
    last_name: "Ogunleye",
    bank_name: "UBA",
    account_number: "3456789012",
    country: "ng",
  },
  {
    first_name: "Emma",
    last_name: "Brown",
    bank_name: "NatWest",
    account_number: "84756301928",
    country: "gb",
  },
  {
    first_name: "Aisha",
    last_name: "Ibrahim",
    bank_name: "Zenith Bank",
    account_number: "4567890123",
    country: "ng",
  },
  {
    first_name: "David",
    last_name: "Taylor",
    bank_name: "Santander",
    account_number: "93847561029",
    country: "gb",
  },
  {
    first_name: "Chinedu",
    last_name: "Eze",
    bank_name: "First Bank",
    account_number: "5678901234",
    country: "ng",
  },
];
