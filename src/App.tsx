import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router";
import RootLayout from "./layout/RootLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const Onboarding = () => import("./pages/Onboarding");
const Dashboard = () => import("./pages/Dashboard");

const queryClient = new QueryClient();

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route Component={RootLayout}>
          <Route index lazy={Dashboard} />
          <Route path="onboarding" lazy={Onboarding} />
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
