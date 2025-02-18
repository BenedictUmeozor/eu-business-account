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

const GetStarted = () => import("./pages/(auth)/GetStarted");
const OTPVerification = () => import("./pages/(auth)/OTPVerification");
const EmailVerified = () => import("./pages/(auth)/EmailVerified");

const Onboarding = () => import("./pages/(protected)/Onboarding");
const Dashboard = () => import("./pages/(protected)/Dashboard");

const queryClient = new QueryClient();

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route Component={GetStartedLayout}>
          <Route path="get-started" lazy={GetStarted} />
          <Route path="verify-email" lazy={OTPVerification} />
          <Route path="email-verified" lazy={EmailVerified} />
        </Route>
        <Route Component={RootLayout}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="onboarding" lazy={Onboarding} />
          <Route path="dashboard" lazy={Dashboard} />
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
