import { Button, Tabs, TabsProps } from "antd";
import { Edit } from "iconsax-react";
import Personal from "./Personal";
import Business from "./Business";
import ChangePassword from "./ChangePassword";
import ChangePin from "./ChangePin";
import Notification from "./Notification";
import AboutUs from "./AboutUs";
import PrivacyPolicy from "./PrivacyPolicy";
import TermsAndConditions from "./TermsAndConditions";
import { useState } from "react";
import { useAppSelector } from "@/hooks";

const BusinessProfile = () => {
  const [activeKey, setActiveKey] = useState("1");
  const session = useAppSelector(state => state.session);

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: (
        <span className={activeKey === "1" ? "" : "text-grey-500"}>
          Personal
        </span>
      ),
      children: <Personal />,
    },
    {
      key: "2",
      label: (
        <span className={activeKey === "2" ? "" : "text-grey-500"}>
          Business
        </span>
      ),
      children: <Business />,
    },
    {
      key: "3",
      label: (
        <span className={activeKey === "3" ? "" : "text-grey-500"}>
          Change Password
        </span>
      ),
      children: <ChangePassword />,
    },
    {
      key: "4",
      label: (
        <span className={activeKey === "4" ? "" : "text-grey-500"}>
          Change Pin
        </span>
      ),
      children: <ChangePin />,
    },
    {
      key: "5",
      label: (
        <span className={activeKey === "5" ? "" : "text-grey-500"}>
          Notification
        </span>
      ),
      children: <Notification />,
    },
    {
      key: "6",
      label: (
        <span className={activeKey === "6" ? "" : "text-grey-500"}>
          About us
        </span>
      ),
      children: <AboutUs />,
    },
    {
      key: "7",
      label: (
        <span className={activeKey === "7" ? "" : "text-grey-500"}>
          Privacy Policy
        </span>
      ),
      children: <PrivacyPolicy />,
    },
    {
      key: "8",
      label: (
        <span className={activeKey === "8" ? "" : "text-grey-500"}>
          Terms & Conditions
        </span>
      ),
      children: <TermsAndConditions />,
    },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-grey-600 text-xl font-medium">Profile</h2>
      <div className="">
        <div className="flex items-center justify-center h-40 rounded-xl">
          <img
            src="/images/profile-banner.png"
            alt=""
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
        <div className="flex items-center justify-between -mt-10 pl-[7.5%]">
          <div className="w-32">
            <div className="flex items-center justify-center overflow-hidden h-28 w-28 rounded-full">
              <img
                src="/images/profile-logo.png"
                alt="Profile Logo"
                className="h-full w-full object-cover rounded-full"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 flex-grow self-end">
            <div className=" space-y-1">
              <p className="text-xl text-grey-700 font-medium">
                {session.business?.business_name}
              </p>
              <span className="text-grey-600">{session.user?.email}</span>
            </div>
            <Button
              type="text"
              icon={<Edit className="w-4 h-4 text-primary" />}
              className="text-primary font-medium">
              Update logo
            </Button>
          </div>
        </div>
      </div>
      <Tabs
        defaultActiveKey="1"
        activeKey={activeKey}
        onChange={setActiveKey}
        items={items}
      />
    </div>
  );
};

export const Component = BusinessProfile;

export default BusinessProfile;
