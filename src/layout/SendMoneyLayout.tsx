import { Breadcrumb } from "antd";
import { Link, Outlet } from "react-router";

const SendMoneyLayout = () => {
  return (
    <section className="h-full grid grid-rows-[auto_1fr]">
      <Breadcrumb
        items={[
          {
            title: (
              <Link to="/dashboard" className="text-grey-600 text-base">
                Dashboard
              </Link>
            ),
          },
          {
            title: (
              <p className="text-grey-600 text-base font-semibold">
                Send Money
              </p>
            ),
          },
        ]}
      />
      <Outlet />
    </section>
  );
};
export default SendMoneyLayout;
