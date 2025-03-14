import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router";
import RootLayout from "./layout/RootLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import GetStartedLayout from "./layout/GetStartedLayout";
import SendMoneyLayout from "./layout/SendMoneyLayout";
import ErrorBoundary from "./pages/error";
import AccountsProvider from "./providers/AccountsProvider";

const NotFound = () => import("./pages/not-found");

// Auth Pages
const GetStarted = () => import("./pages/(auth)/GetStarted");
const OTPVerification = () => import("./pages/(auth)/OTPVerification");
const EmailVerified = () => import("./pages/(auth)/EmailVerified");
const Login = () => import("./pages/(auth)/Login");
const ForgotPassword = () => import("./pages/(auth)/ForgotPassword");

const Onboarding = () => import("./pages/(protected)/Onboarding");

const Dashboard = () => import("./pages/(protected)/Dashboard");
const SendMoney = () => import("./pages/(protected)/Dashboard/SendMoney");
const LocalPayments = () =>
  import("./pages/(protected)/Dashboard/SendMoney/LocalPayments");
const LocalSinglePayments = () =>
  import(
    "./pages/(protected)/Dashboard/SendMoney/LocalPayments/SinglePayments"
  );
const SendToBeneficiary = () =>
  import(
    "./pages/(protected)/Dashboard/SendMoney/LocalPayments/SinglePayments/[Beneficiary]"
  );
const TransferSummary = () =>
  import(
    "./pages/(protected)/Dashboard/SendMoney/LocalPayments/SinglePayments/Summary"
  );

const InternationalPayments = () =>
  import("./pages/(protected)/Dashboard/SendMoney/InternationalPayments");
const InternationalSinglePayments = () =>
  import(
    "./pages/(protected)/Dashboard/SendMoney/InternationalPayments/SinglePayments"
  );
const SelectInternationalBeneficiary = () =>
  import(
    "./pages/(protected)/Dashboard/SendMoney/InternationalPayments/SelectBeneficiary"
  );
const SendToInternationalBeneficiary = () =>
  import(
    "./pages/(protected)/Dashboard/SendMoney/InternationalPayments/[Beneficiary]"
  );
const OnlinePaymentInternational = () =>
  import(
    "./pages/(protected)/Dashboard/SendMoney/InternationalPayments/OnlinePayment"
  );
const HellomeMoneyPayment = () =>
  import(
    "./pages/(protected)/Dashboard/SendMoney/InternationalPayments/HellomeMoneyPayment"
  );
const CompletePayment = () =>
  import(
    "./pages/(protected)/Dashboard/SendMoney/InternationalPayments/CompletePayment"
  );
const TransactionProgress = () =>
  import(
    "./pages/(protected)/Dashboard/SendMoney/InternationalPayments/TransactionProgress"
  );

// Transactions
const Transactions = () => import("./pages/(protected)/Transactions");

// Conversions
const Conversions = () => import("./pages/(protected)/Conversions");

const queryClient = new QueryClient();

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" errorElement={<ErrorBoundary />}>
        <Route Component={GetStartedLayout}>
          <Route path="get-started" lazy={GetStarted} />
          <Route path="verify-email" lazy={OTPVerification} />
          <Route path="email-verified" lazy={EmailVerified} />
          <Route path="login" lazy={Login} />
          <Route path="forgot-password" lazy={ForgotPassword} />
        </Route>
        <Route
          element={
            <AccountsProvider>
              <RootLayout />
            </AccountsProvider>
          }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="onboarding" lazy={Onboarding} />
          <Route path="dashboard" lazy={Dashboard} />

          <Route path="dashboard/send-money" Component={SendMoneyLayout}>
            <Route index lazy={SendMoney} />
            <Route path="local-payments">
              <Route index lazy={LocalPayments} />
              <Route path="single">
                <Route index lazy={LocalSinglePayments} />
                <Route path=":beneficiary" lazy={SendToBeneficiary} />
                <Route path="summary" lazy={TransferSummary} />
              </Route>
            </Route>
            <Route path="international-payments">
              <Route index lazy={InternationalPayments} />
              <Route path="single">
                <Route index lazy={InternationalSinglePayments} />
                <Route
                  path="select-beneficiary"
                  lazy={SelectInternationalBeneficiary}
                />
                <Route
                  path="beneficiary/:beneficiary"
                  lazy={SendToInternationalBeneficiary}
                />
                <Route
                  path="online-payment"
                  lazy={OnlinePaymentInternational}
                />
                <Route
                  path="hellome-money-payment"
                  lazy={HellomeMoneyPayment}
                />
                <Route
                  path="hellome-money-payment/complete"
                  lazy={CompletePayment}
                />
                <Route path="transaction-progress" lazy={TransactionProgress} />
              </Route>
            </Route>
          </Route>

          {/* Transactions */}
          <Route path="transactions" lazy={Transactions} />

          {/* Conversions */}
          <Route path="conversions" lazy={Conversions} />
        </Route>
        <Route path="*" lazy={NotFound} />
      </Route>
    )
  );

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};
export default App;
