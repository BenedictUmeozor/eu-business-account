import clsx from "clsx";
import { ReactNode, useMemo, useState } from "react";
import { Link, useLocation } from "react-router";
import {
  LayoutDashboardIcon,
  FolderIcon,
  PieChartIcon,
  SendIcon,
  WorkflowIcon,
  UsersIcon,
  UserIcon,
  LogOutIcon,
  XIcon,
} from "lucide-react";
import { Button } from "antd";

interface MenuItem {
  key: string;
  icon: ReactNode;
  label: string;
  to: string;
  active: boolean;
}

const Sidebar = () => {
  const { pathname } = useLocation();

  const menuItems: MenuItem[] = useMemo(
    () => [
      {
        key: "1",
        label: "Onboarding",
        icon: <FolderIcon className="h-4 w-4" />,
        to: "/onboarding",
        active: pathname.startsWith("/onboarding"),
      },
      {
        key: "2",
        label: "Dashboard",
        icon: <LayoutDashboardIcon className="h-4 w-4" />,
        to: "/dashboard",
        active: pathname.startsWith("/dashboard"),
      },
      {
        key: "3",
        label: "Accounts",
        icon: <PieChartIcon className="h-4 w-4" />,
        to: "/accounts",
        active: pathname.startsWith("/accounts"),
      },
      {
        key: "4",
        label: "Transfers",
        icon: <SendIcon className="h-4 w-4" />,
        to: "/transfers",
        active: pathname.startsWith("/transfers"),
      },
      {
        key: "5",
        label: "Transactions",
        icon: <WorkflowIcon className="h-4 w-4" />,
        to: "/transactions",
        active: pathname.startsWith("/transactions"),
      },
      {
        key: "6",
        label: "Beneficiaries",
        icon: <UsersIcon className="h-4 w-4" />,
        to: "/beneficiaries",
        active: pathname.startsWith("/beneficiaries"),
      },
    ],
    [pathname]
  );

  return (
    <aside className="bg-secondary-500 max-lg:hidden relative h-screen w-[200px] overflow-y-auto grid grid-rows-[auto_1fr] pb-6 gap-6 no-scrollbar">
      <a
        href="https://hellomemoney.com/"
        className="flex items-center justify-center gap-2 sticky top-0 z-10 pt-6 bg-secondary-500 pb-2">
        <img src="/images/hellome.png" alt="Hellomemoney" className="h-7 w-7" />
        <p className="font-cabinet text-lg font-bold text-white no-underline">
          HelloMe Money
        </p>
      </a>
      <div className="space-y-12">
        <nav className="space-y-8">
          <ul className="space-y-2">
            {menuItems.map(item => (
              <li
                key={item.key}
                className={clsx(
                  "border-0 border-solid border-r-4 hover:bg-secondary-400 hover:border-r-secondary-200 transition-all duration-200 ease-linear",
                  {
                    "bg-secondary-400 border-r-secondary-200": item.active,
                  },
                  { "border-r-transparent": !item.active }
                )}>
                <Link
                  to={item.to}
                  className={clsx(
                    "flex items-center gap-2 py-2.5 w-[80%] mx-auto text-base font-normal",
                    !item.active && "text-primary-300",
                    item.active && "text-white"
                  )}>
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="h-[1px] bg-primary-700 w-[85%] mx-auto" />
          <ul className="space-y-2">
            <li
              className={clsx(
                "border-0 border-solid border-r-4 hover:bg-secondary-400 hover:border-r-secondary-200 transition-all duration-200 ease-linear",
                {
                  "bg-secondary-400 border-r-secondary-200":
                    pathname.startsWith("/profile"),
                },
                { "border-r-transparent": !pathname.startsWith("/profile") }
              )}>
              <Link
                to="/profile"
                className={clsx(
                  "flex items-center gap-2 py-2.5 w-[80%] mx-auto text-base font-normal",
                  !pathname.startsWith("/profile") && "text-primary-300",
                  pathname.startsWith("/profile") && "text-white"
                )}>
                <UserIcon className="h-4 w-4" />
                <span>Profile</span>
              </Link>
            </li>
            <li className="border-0 border-solid border-r-4 hover:bg-secondary-400 hover:border-r-secondary-200 transition-all duration-200 ease-linear">
              <p className="flex items-center gap-2 py-2.5 w-[80%] mx-auto text-base font-normal text-primary-300">
                <LogOutIcon className="h-4 w-4" />
                <span>Log out</span>
              </p>
            </li>
          </ul>
        </nav>
        <Closable />
      </div>
    </aside>
  );
};

const Closable = () => {
  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <div className="bg-secondary-400 rounded-xl px-2 pt-1 flex flex-col gap-4 w-[90%] mx-auto !text-[#5D9ADC]">
      <Button
        type="text"
        icon={<XIcon className="w-4 h-4" />}
        className=" self-end !text-[#5D9ADC]"
        onClick={() => setOpen(false)}
      />
      <p className="font-medium px-2 text-base">Global banking for future-proof businesses</p>
      <div className="grid place-items-center">
        <img src="/images/sidebar-banner.png" alt="banner" className="object-contain w-full" />
      </div>
    </div>
  );
};

export default Sidebar;
