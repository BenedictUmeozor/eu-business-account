interface Currency {
  currencyCode: string;
  currencySymbol: string;
  flag: string;
  countryName: string;
  countryCode: string;
}

export const CURRENCIES: Currency[] = [
  {
    currencyCode: "GBP",
    currencySymbol: "£",
    flag: "https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg",
    countryName: "United Kingdom",
    countryCode: "GB",
  },
  {
    currencyCode: "DKK",
    currencySymbol: "kr",
    flag: "https://upload.wikimedia.org/wikipedia/commons/9/9c/Flag_of_Denmark.svg",
    countryName: "Denmark",
    countryCode: "DK",
  },
  {
    currencyCode: "USD",
    currencySymbol: "$",
    flag: "https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg",
    countryName: "United States",
    countryCode: "US",
  },
  {
    currencyCode: "EUR",
    currencySymbol: "€",
    flag: "https://upload.wikimedia.org/wikipedia/commons/b/b7/Flag_of_Europe.svg",
    countryName: "European Union",
    countryCode: "EU",
  },
  //   {
  //     currencyCode: "NGN",
  //     currencySymbol: "₦",
  //     flag: "https://upload.wikimedia.org/wikipedia/commons/7/79/Flag_of_Nigeria.svg",
  //     countryName: "Nigeria",
  //     countryCode: "NG"
  //   }
];
