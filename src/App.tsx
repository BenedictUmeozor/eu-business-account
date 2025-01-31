import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router";
import RootLayout from "./layout/RootLayout";

const Onboarding = () => import("./pages/Onboarding");
const Dashboard = () => import("./pages/Dashboard");

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

  return <RouterProvider router={router} />;
};
export default App;
