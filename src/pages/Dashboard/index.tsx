import { Button, Space, Tabs, TabsProps } from "antd";
import BalanceInfo from "./BalanceInfo";
import { ChevronRightIcon } from "lucide-react";
import { useMemo } from "react";
import BritishPounds from "./BritishPounds";
import Transactions from "./Transactions";

const Dashboard = () => {
  const items: TabsProps["items"] = useMemo(
    () => [
      {
        key: "1",
        label: "GBP",
        children: <BritishPounds />,
      },
      {
        key: "2",
        label: "USD",
        children: <BritishPounds />,
      },
      {
        key: "3",
        label: "EUR",
        children: <BritishPounds />,
      },
      {
        key: "4",
        label: "NGN",
        children: <BritishPounds />,
      },
      {
        key: "5",
        label: "DKK",
        children: <BritishPounds />,
      },
    ],
    []
  );

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <BalanceInfo />
        <Space>
          <Button
            type="primary"
            className="bg-primary-50 text-primary"
            shape="round"
            iconPosition="end"
            icon={<ChevronRightIcon className="h-4 w-4" />}>
            Send Money
          </Button>
          <Button
            type="primary"
            shape="round"
            iconPosition="end"
            icon={<ChevronRightIcon className="h-4 w-4" />}>
            Add Money
          </Button>
        </Space>
      </div>
      <Tabs items={items} defaultActiveKey="1" />
      <Transactions />
    </section>
  );
};

export const Component = Dashboard;

export default Dashboard;
