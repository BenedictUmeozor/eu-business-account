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

const GetStarted = () => import("./pages/(auth)/GetStarted");
const OTPVerification = () => import("./pages/(auth)/OTPVerification");
const EmailVerified = () => import("./pages/(auth)/EmailVerified");
const Login = () => import("./pages/(auth)/Login");

const Onboarding = () => import("./pages/(protected)/Onboarding");

const Dashboard = () => import("./pages/(protected)/Dashboard");
const SendMoney = () => import("./pages/(protected)/Dashboard/SendMoney");
const SendToBeneficiary = () =>
  import("./pages/(protected)/Dashboard/SendMoney/[Beneficiary]");
const TransferSummary = () =>
  import("./pages/(protected)/Dashboard/SendMoney/Summary");

const queryClient = new QueryClient();

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route Component={GetStartedLayout}>
          <Route path="get-started" lazy={GetStarted} />
          <Route path="verify-email" lazy={OTPVerification} />
          <Route path="email-verified" lazy={EmailVerified} />
          <Route path="login" lazy={Login} />
        </Route>
        <Route Component={RootLayout}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="onboarding" lazy={Onboarding} />
          <Route path="dashboard" lazy={Dashboard} />
          <Route path="dashboard/send-money" Component={SendMoneyLayout}>
            <Route index lazy={SendMoney} />
            <Route path=":beneficiary" lazy={SendToBeneficiary} />
            <Route path="summary" lazy={TransferSummary} />
          </Route>
        </Route>
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
