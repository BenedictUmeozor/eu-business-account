import clsx from "clsx";
import { ReactNode, useMemo, useState } from "react";
import { Link, useLocation } from "react-router";
import {
  LayoutDashboardIcon,
  FolderIcon,
  WorkflowIcon,
  UserIcon,
  LogOutIcon,
  XIcon,
  FileTextIcon,
  RotateCcwSquareIcon,
  BriefcaseIcon,
  UsersIcon,
} from "lucide-react";
import { Button } from "antd";
import useLogout from "@/hooks/use-logout";
import Loader from "./Loader";
import { useAppSelector } from "@/hooks";
import { useAutoAnimate } from "@formkit/auto-animate/react";

interface MenuItem {
  key: string;
  icon: ReactNode;
  label: string;
  to: string;
  active: boolean;
}

const Sidebar = () => {
  const [parent] = useAutoAnimate();
  const { pathname } = useLocation();
  const onboardingStatus = useAppSelector(
    state => state.session.onboardingStatus
  );

  const { loading, logout } = useLogout();

  const MENU = [
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
      label: "Transactions",
      icon: <WorkflowIcon className="h-4 w-4" />,
      to: "/transactions",
      active: pathname.startsWith("/transactions"),
    },
    {
      key: "4",
      label: "Invoice",
      icon: <FileTextIcon className="h-4 w-4" />,
      to: "/invoice",
      active: pathname.startsWith("/invoice"),
    },
    {
      key: "5",
      label: "Conversions",
      icon: <RotateCcwSquareIcon className="h-4 w-4" />,
      to: "/conversions",
      active: pathname.startsWith("/conversion"),
    },
    {
      key: "6",
      label: "Beneficiaries",
      icon: <UsersIcon className="h-4 w-4" />,
      to: "/beneficiaries",
      active: pathname.startsWith("/beneficiaries"),
    },
  ];

  const disabled = useMemo(() => {
    return pathname.includes("onboarding");
  }, [pathname]);

  const menuItems: MenuItem[] = useMemo(() => {
    if (!onboardingStatus?.completed || pathname.includes("onboarding")) {
      return MENU;
    }
    return MENU.filter(item => item.key !== "1");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, onboardingStatus]);

  return (
    <aside
      className="bg-secondary-500 max-lg:hidden relative h-screen w-[200px] overflow-y-auto grid grid-rows-[auto_1fr] pb-6 gap-6 no-scrollbar"
    >
      {loading && <Loader />}
      <Link
        to="/"
        className="flex items-center justify-center gap-2 sticky top-0 z-10 pt-6 bg-secondary-500 pb-2">
        <img src="/images/hellome.png" alt="Hellomemoney" className="h-7 w-7" />
        <p className="font-cabinet text-lg font-bold text-white no-underline">
          HelloMe Money
        </p>
      </Link>
      <div className="space-y-12"   ref={parent}>
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
                  { "border-r-transparent": !item.active },
                  { "opacity-50": disabled && !item.active }
                )}>
                {disabled && !item.active ? (
                  <p
                    className={clsx(
                      "flex items-center gap-2 py-2.5 w-[80%] mx-auto text-base font-normal cursor-not-allowed",
                      !item.active && "text-primary-300",
                      item.active && "text-white"
                    )}>
                    {item.icon}
                    <span>{item.label}</span>
                  </p>
                ) : (
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
                )}
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
                    pathname.startsWith("/virtual-office"),
                },
                {
                  "border-r-transparent":
                    !pathname.startsWith("/virtual-office"),
                },
                {
                  "opacity-50":
                    disabled && !pathname.startsWith("/virtual-office"),
                }
              )}>
              {disabled ? (
                <p
                  className={clsx(
                    "flex items-center gap-2 py-2.5 w-[80%] mx-auto text-base font-normal",
                    !pathname.startsWith("/virtual-office") &&
                      "text-primary-300 cursor-not-allowed",
                    pathname.startsWith("/virtual-office") && "text-white"
                  )}>
                  <UserIcon className="h-4 w-4" />
                  <span>Virtual Office</span>
                </p>
              ) : (
                <Link
                  to="/virtual-office"
                  className={clsx(
                    "flex items-center gap-2 py-2.5 w-[80%] mx-auto text-base font-normal",
                    !pathname.startsWith("/virtual-office") &&
                      "text-primary-300",
                    pathname.startsWith("/virtual-office") && "text-white"
                  )}>
                  <BriefcaseIcon className="h-4 w-4" />
                  <span>Virtual Office</span>
                </Link>
              )}
            </li>
            <li
              className={clsx(
                "border-0 border-solid border-r-4 hover:bg-secondary-400 hover:border-r-secondary-200 transition-all duration-200 ease-linear",
                {
                  "bg-secondary-400 border-r-secondary-200":
                    pathname.startsWith("/profile"),
                },
                { "border-r-transparent": !pathname.startsWith("/profile") },
                { "opacity-50": disabled && !pathname.startsWith("/profile") }
              )}>
              {disabled ? (
                <p
                  className={clsx(
                    "flex items-center gap-2 py-2.5 w-[80%] mx-auto text-base font-normal",
                    !pathname.startsWith("/profile") &&
                      "text-primary-300 cursor-not-allowed",
                    pathname.startsWith("/profile") && "text-white"
                  )}>
                  <UserIcon className="h-4 w-4" />
                  <span>Profile</span>
                </p>
              ) : (
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
              )}
            </li>
            <li
              className="border-0 border-solid border-r-4 hover:bg-secondary-400 hover:border-r-secondary-200 transition-all duration-200 ease-linear cursor-pointer"
              onClick={logout}>
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
      <p className="font-medium px-2 text-base">
        Global banking for future-proof businesses
      </p>
      <div className="grid place-items-center">
        <img
          src="/images/sidebar-banner.png"
          alt="banner"
          className="object-contain w-full"
        />
      </div>
    </div>
  );
};

export default Sidebar;
