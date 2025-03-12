import { Button, Card, Space, Tabs, TabsProps } from "antd";
import BalanceInfo from "./BalanceInfo";
import { ChevronRightIcon } from "lucide-react";
import { useMemo } from "react";
import BritishPounds from "./BritishPounds";
import Transactions from "./Transactions";
import AssetLineChart from "./LineChart";
import { Link } from "react-router";
import USDollars from "./USDollars";
import Euro from "./Euro";
import NGNaira from "./NGNaira";
import DKK from "./DKK";

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
        children: <USDollars />,
      },
      {
        key: "3",
        label: "EUR",
        children: <Euro />,
      },
      {
        key: "4",
        label: "NGN",
        children: <NGNaira />,
      },
      {
        key: "5",
        label: "DKK",
        children: <DKK />,
      },
    ],
    []
  );

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <BalanceInfo />
        <Space>
          <Link
            to="/dashboard/send-money?currency=GBP"
            state={{ currency: "GBP" }}>
            <Button
              type="primary"
              className="bg-primary-50 text-primary"
              shape="round"
              iconPosition="end"
              icon={<ChevronRightIcon className="h-4 w-4" />}>
              Send Money
            </Button>
          </Link>
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
      <Card>
        <AssetLineChart />
      </Card>
    </section>
  );
};

export const Component = Dashboard;

export default Dashboard;
